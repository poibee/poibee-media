import {Controller, Get, Param} from '@nestjs/common';
import {WikiService} from "./wiki.service";
import {ImageProperties} from "../common/image-properties";
import {LicenseError} from "../common/license-error";

@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  // Wikidata image by given entity id
  // http://localhost:3000/wiki/entity/Q1551353
  // https://commons.wikimedia.org/wiki/Special:FilePath/Panorama Pestruper Gräberfeld.jpg?width=300
  @Get('entity/:entity')
  getImageByWikidataEntity(@Param('entity') entity: string): Promise<ImageProperties | LicenseError> {
    return this.wikiService.imageByWikidataEntity(entity);
  }

  // Wikidata image by sitelinks of Wikipedia article with the given title
  // http://localhost:3000/wiki/title/de:Douglas Adams
  // https://commons.wikimedia.org/wiki/Special:FilePath/Douglas adams portrait cropped.jpg?width=300
  @Get('title/:title')
  getImageByWikipediaSitelinks(@Param('title') title: string): Promise<ImageProperties | LicenseError> {
    return this.wikiService.imageByWikipediaSitelinks(title);
  };

  // Wikidata image by first article of the Wikipedia search with the given search query
  // http://localhost:3000/wiki/search/de:Douglas Adams
  // https://commons.wikimedia.org/wiki/Special:FilePath/Douglas adams portrait cropped.jpg?width=300
  @Get('search/:query')
  getImageByWikipediaSearch(@Param('query') query: string): Promise<ImageProperties | LicenseError> {
    return this.wikiService.imageByWikipediaSearch(query);
  };

}
