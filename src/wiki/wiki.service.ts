import {Injectable} from '@nestjs/common';
import {LicenseError} from 'src/common/license-error';
import {ImageProperties} from "../common/image-properties";

const WBK = require('wikibase-sdk')
const wdk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

const DEFAULT_WIKIPEDIA_LANGUAGE = "de";

@Injectable()
export class WikiService {

    async imageByWikidataEntity(entityid: string): Promise<ImageProperties | LicenseError> {
        return new Promise((resolve: (value: ImageProperties) => void) => {
            this.evaluateByWikidataEntity(entityid, null, "wikidata:entity", resolve);
        });
    };

    async imageByWikipediaSitelinks(wikititleid: string): Promise<ImageProperties | LicenseError> {
        return new Promise((resolve: (value: ImageProperties | LicenseError) => void) => {
            const [lang, term] = this.splitWikipediaTitle(wikititleid);
            // https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-sitelinks
            const entityUrl = wdk.getEntitiesFromSitelinks(term, lang + "wiki");
            console.log("EntityUrl: " + entityUrl);
            // => https://www.wikidata.org/w/api.php?action=wbgetentities&titles=Douglas+Adams&sites=dewiki&format=json&normalize=true
            this.evaluateWikidataUrl(entityUrl, "wikipedia:sitelink", null, wikititleid, resolve);
        });
    };

    async imageByWikipediaSearch(wikititleid: string): Promise<ImageProperties | LicenseError> {
        return new Promise((resolve: (value: ImageProperties | LicenseError) => void) => {
            const [lang, term] = this.splitWikipediaTitle(wikititleid);
            // https://github.com/maxlath/wikibase-sdk/blob/main/docs/search_entities.md
            const searchUrl: string = wdk.searchEntities({search: term, language: lang, limit: 1});
            console.log("SearchUrl: " + searchUrl);
            const fetchCall: Promise<any> = fetch(searchUrl);
            fetchCall
                .then((r: any) => r.json())
                .then((r: any) => r.search as any[]) // SearchResult[]
                .then((searchResults) => {
                    if (!searchResults[0] || !searchResults[0].id) {
                        resolve(LicenseError.E6_NO_WIKIPEDIA_FOUND_FOR_SEARCH);
                        return undefined; // avoid errors of the following lines
                    }
                    return searchResults[0].id;
                })
                .then((entityid: string) => this.evaluateByWikidataEntity(entityid, wikititleid, "wikipedia:search", resolve))
        });
    };

    private splitWikipediaTitle(wikititleid: string): [string, string] {
        const pageIdParts = wikititleid.split(":");
        const lang = pageIdParts.length >= 2 ? pageIdParts[0] : DEFAULT_WIKIPEDIA_LANGUAGE;
        const term = pageIdParts.length >= 2 ? pageIdParts[1] : pageIdParts[0];
        return [lang, term];
    }

    private evaluateByWikidataEntity(entityid: string, titleid: string, type: string, resolve: (value: ImageProperties | LicenseError) => void) {
        let entityUrl: string;
        try {
            // https://github.com/maxlath/wikibase-sdk/blob/main/docs/get_entities.md#by-ids
            entityUrl = wdk.getEntities({ids: entityid, props: "claims"});
        } catch (e) {
            resolve(LicenseError.E1_INVALID_WIKIDATA_ID);
        }

        console.log("EntityUrl: " + entityUrl);
        // => https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q1551353&format=json&props=claims
        this.evaluateWikidataUrl(entityUrl, type, entityid, titleid, resolve);
    }

    // Evaluate Response of this API: https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
    private evaluateWikidataUrl(entityUrl: string, type: string, entityid: string, titleid: string, resolve: (value: ImageProperties | LicenseError) => void) {
        const fetchCall: Promise<any> = fetch(entityUrl);
        fetchCall
            // extract JSON of request
            .then((response: any) => response.json())
            .then((r: any) => {
                const requestString = JSON.stringify(r);
                if (requestString.indexOf('"error"') >= 0) {
                    resolve(LicenseError.E2_NO_WIKIDATA_ENTITY);
                }
                if (requestString.indexOf('"missing"') >= 0) {
                    if (requestString.indexOf('"id"') >= 0) {
                        resolve(LicenseError.E2_NO_WIKIDATA_ENTITY);
                    } else if (requestString.indexOf('"title"')) {
                        resolve(LicenseError.E3_NO_WIKIPEDIA_ARTICLE_FOR_TITLE);
                    } else {
                        resolve(LicenseError.E4_REQUEST_WIKI_CAUSES_UNKNOWN_ERROR);
                    }
                    return undefined;
                }
                // simplify JSON by removing superfluous properties
                return wdk.simplify.entities(r)
            })
            // grab the claim "P18" as image name like 'Panorama Pestruper Gräberfeld.jpg'
            .then((simplifiedEntities: any) => {
                const firstSimplifiedEntity: any = simplifiedEntities[Object.keys(simplifiedEntities)[0]];
                const p18Claim = firstSimplifiedEntity.claims["P18"];
                if (!p18Claim) {
                    resolve(LicenseError.E5_NO_IMAGE_FOUND);
                }
                return p18Claim;
            })
            // there is always exactly one image for an existing P18 claim
            .then((images: any) => images[0])
            // assemble data
            .then((filename: string) => {
                const originurl: string = wdk.getImageUrl(filename).replace('Special:FilePath/', 'File:');
                const resizeurl: string = wdk.getImageUrl(filename, 300);
                const media: ImageProperties = {
                    type: type,
                    entityid: entityid,
                    titleid: titleid,
                    filename: filename,
                    originurl: originurl,
                    resizeurl: resizeurl
                };
                resolve(media);
            }).catch((reason: any) => {
                console.log("Unknown error " + reason);
                resolve(LicenseError.E7_PROCESSING_WIKI_CAUSES_UNKNOWN_ERROR);
            });
    }

}
