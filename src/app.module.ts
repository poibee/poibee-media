import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {ImagesModule} from "./images/images.module";
import {WikiModule} from "./wiki/wiki.module";
import {LicenseModule} from "./license/license.module";
import {ProcessService} from "./process/process.service";
import {CypressLicenseService} from "./process/cypress-license.service";

@Module({
    imports: [
        //MongooseModule.forRoot('mongodb://localhost:27017/poibee'),
        //MongooseModule.forRoot('mongodb://poibee-mongo:27017/poibee'),
        MongooseModule.forRoot('mongodb://192.168.178.21:27017/poibee'),
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
