import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {LicenseController} from "./license.controller";
import {LicenseMongoService} from "./license-mongo.service";
import {LicenseCacheService} from "./license-cache.service";
import {License, LicenseSchema} from "./schemas/license.schema";
import {Error, ErrorSchema} from "./schemas/error.schema";

@Module({
    imports: [MongooseModule.forFeature([
        {name: Error.name, schema: ErrorSchema},
        {name: License.name, schema: LicenseSchema},
    ])],
    controllers: [LicenseController],
    providers: [LicenseCacheService, LicenseMongoService],
    exports: [LicenseCacheService, LicenseMongoService]
})
export class LicenseModule {
}
