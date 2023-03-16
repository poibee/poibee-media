import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type ErrorDocument = HydratedDocument<Error>;

@Schema({ timestamps: true, collection: 'image-errors' })
export class Error {
    @Prop({required: true})
    osmid: string;
    @Prop()
    entityid: string;
    @Prop()
    titleid: string;
    @Prop({required: true})
    code: number;
    @Prop({required: true})
    message: string;
}

export const ErrorSchema = SchemaFactory.createForClass(Error);
