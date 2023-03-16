import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
    @Prop({required: true})
    type: string;
    @Prop()
    entityid: string;
    @Prop()
    titleid: string;
    @Prop({required: true})
    filename: string;
    @Prop({required: true})
    originurl: string;
    @Prop({required: true})
    resizeurl: string
}

export const ImageSchema = SchemaFactory.createForClass(Image);
