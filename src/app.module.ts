import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {ImagesModule} from "./images/images.module";
import {WikiModule} from "./wiki/wiki.module";
import {LicenseModule} from "./license/license.module";
import {ProcessService} from "./process/process.service";
import {CypressLicenseService} from "./process/cypress-license.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/poibee'),
        ImagesModule,
        LicenseModule,
        WikiModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        ProcessService,
        CypressLicenseService,
    ],
})

export class AppModule {
}
