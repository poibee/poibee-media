import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type LicenseDocument = HydratedDocument<License>;

@Schema({ timestamps: true, collection: 'image-licenses' })
export class License {
    @Prop({required: true})
    osmid: string;
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
    @Prop({required: true})
    license: string
    @Prop({required: true})
    licensetext: string
}

export const LicenseSchema = SchemaFactory.createForClass(License);
