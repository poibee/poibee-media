import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {ImagesController} from './images.controller';
import {Image, ImageSchema} from './schemas/image.schema';
import {ImagesMongoService} from "./images-mongo.service";

@Module({
    imports: [MongooseModule.forFeature([{name: Image.name, schema: ImageSchema}])],
    controllers: [ImagesController],
    providers: [ImagesMongoService],
})
export class ImagesModule {
}
