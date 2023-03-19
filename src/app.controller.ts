import {Controller, Get, HttpStatus, Param, Query, Res} from '@nestjs/common';
import {LicenseCacheService} from "./license/license-cache.service";
import {ProcessService} from "./process/process.service";
import {OsmQueryData} from "./common/osm-query-data";

import { Response } from 'express';
import {LicenseMongoService} from "./license/license-mongo.service";

@Controller()
export class AppController {
    constructor(
        private readonly licenseCacheService: LicenseCacheService,
        private readonly licenseMongoService: LicenseMongoService,
        private readonly processService: ProcessService,
        ) {
    }

    // Image by given OSM id
    // http://localhost:3000/image/node-1234?entityid=Q42
    // http://localhost:3000/image/node-1235?entityid=Q42&timeout=120
    // http://localhost:3000/image/node-1236?titleid=de:Douglas%20Adams&timeout=120
    @Get('image/:osmid')
    async getImage(@Res() response: Response, @Param('osmid') osmid: string, @Query("entityid") entityid: string, @Query("titleid") titleid: string, @Query("timeout") timeout: number) {
        if (!this.processService.isProcessing()) {

            let license = null; // TODO = this.licenseCacheService.findLicense(osmid);
            if (license == null) {
                license = await this.licenseMongoService.findLicense(osmid)
            }

            let error = null; // TODO = this.licenseCacheService.findError(osmid);
            if (error == null) {
                error = await this.licenseMongoService.findError(osmid)
            }

            console.log("getImage start: " + osmid + " => license=" + this.exists(license) + ", error=" + this.exists(error));

            if (license == null && error == null) {
                response.status(HttpStatus.NO_CONTENT).send("No content yet. Server processing has been triggered. Try again in some seconds.");

                console.log("getImage process license: " + osmid);
                const osmQueryData = new OsmQueryData(osmid, entityid, titleid);
                this.processService.process(osmQueryData, timeout);
            } else {
                const content = license ? license : error;
                // TODO: don't return the error
                response.status(HttpStatus.OK).json(content);
            }
        } else {
            response.status(HttpStatus.SERVICE_UNAVAILABLE).send("Server processing is busy. Try again in some seconds.");
        }
        console.log("getImage done: " + osmid);
    };

    private exists(object :any): boolean {
        return object !== undefined && object!== null;
    }
}
