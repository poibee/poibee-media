import {Injectable} from '@nestjs/common';
import {OsmQueryData} from "../common/osm-query-data";
import {WikiService} from "../wiki/wiki.service";
import {ImageProperties} from "../common/image-properties";
import {LicenseError} from "../common/license-error";
import {ImagePropertiesUtil} from "../common/image-properties-util";
import {LicenseCacheService} from "../license/license-cache.service";
import {CypressLicenseService} from "./cypress-license.service";
import {License} from "../license/schemas/license.schema";
import {LicenseMongoService} from "../license/license-mongo.service";
import {CreateErrorDto} from "../license/dto/create-error.dto";

@Injectable()
export class ProcessService {

    private processing: boolean;

    constructor(
        private readonly wikiService: WikiService,
        private readonly cypressService: CypressLicenseService,
        private readonly licenseCacheService: LicenseCacheService,
        private readonly licenseMongoService: LicenseMongoService,
    ) {
    }

    isProcessing(): boolean {
        return this.processing;
    }

    async process(osmQueryData: OsmQueryData, cypressTimeoutInSeconds: number): Promise<void> {
        this.processing = true;

        console.log("process -> start: " + JSON.stringify(osmQueryData));

        const imagePropertiesOrError: ImageProperties | LicenseError = await this.calculateImageProperties(osmQueryData);

        if (ImagePropertiesUtil.isImageProperties(imagePropertiesOrError)) {
            console.log("process -> imagePropertiesOrError: " + "Found !");
            const imageProps = imagePropertiesOrError as ImageProperties;
            const license = await this.cypressService.licenseOfData(osmQueryData.osmid, imageProps, cypressTimeoutInSeconds)

            if (ImagePropertiesUtil.isLicenseProperties(license)) {
                console.log("process -> license: " + "Found !");
                this.licenseCacheService.addLicense(license as License);
                await this.licenseMongoService.createLicense(license as License)
            } else {
                console.log("process -> license: " + "Error ! ");
                this.licenseCacheService.addError(osmQueryData.osmid, license as LicenseError)
                await this.licenseMongoService.createError(this.asErrorDto(osmQueryData, license as LicenseError))
            }
        } else {
            console.log("process -> imagePropertiesOrError: " + "Error !");
            this.licenseCacheService.addError(osmQueryData.osmid, imagePropertiesOrError as LicenseError)
            await this.licenseMongoService.createError(this.asErrorDto(osmQueryData, imagePropertiesOrError as LicenseError))
        }

        this.processing = false;
    };

    private asErrorDto(osmQueryData: OsmQueryData, license: LicenseError) {
        const createErrorDto: CreateErrorDto = {
            osmid: osmQueryData.osmid,
            entityid: osmQueryData.entityid,
            titleid: osmQueryData.titleid,
            code: (license as any).error,
            message: (license as any).message
        }
        return createErrorDto;
    }

    private async calculateImageProperties(osmQueryData: OsmQueryData): Promise<ImageProperties | LicenseError> {
        let imageProperties: ImageProperties | LicenseError;

        if (osmQueryData.entityid) {
            try {
                console.log("process -> imageByWikidataEntity -> start: " + osmQueryData.entityid);
                imageProperties = await this.wikiService.imageByWikidataEntity(osmQueryData.entityid);
                console.log("process -> imageByWikidataEntity -> end: " + JSON.stringify(imageProperties));
            } catch (e: unknown) {
                this.handleError(e);
            }

        } else if (osmQueryData.titleid) {
            try {
                console.log("process -> imageByWikipediaSitelinks -> start: " + osmQueryData.entityid);
                imageProperties = await this.wikiService.imageByWikipediaSitelinks(osmQueryData.titleid);
                console.log("process -> imageByWikipediaSitelinks -> end: " + JSON.stringify(imageProperties));
            } catch (e: unknown) {
                this.handleError(e);
            }

            if (!ImagePropertiesUtil.isImageProperties(imageProperties)) {
                try {
                    console.log("process -> imageByWikipediaSearch -> start: " + osmQueryData.entityid);
                    imageProperties = await this.wikiService.imageByWikipediaSearch(osmQueryData.titleid);
                    console.log("process -> imageByWikipediaSearch -> end: " + JSON.stringify(imageProperties));
                } catch (e: unknown) {
                    this.handleError(e);
                }
            }
        }
        return imageProperties;
    }

    private handleError(e: unknown) {
        if (typeof e === "string") {
            console.log("Error message: " + e)
        } else if (e instanceof Error) {
            console.log("Error: " + e.message)
        } else {
            console.log("Error unknown: " + JSON.stringify(e))
        }
    }
}
