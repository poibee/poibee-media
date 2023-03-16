import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateLicenseDto} from './dto/create-license.dto';
import {License, LicenseDocument} from './schemas/license.schema';
import {Error, ErrorDocument} from "./schemas/error.schema";
import {CreateErrorDto} from "./dto/create-error.dto";
import {LicenseError} from "../common/license-error";

@Injectable()
export class LicenseMongoService {
    constructor(
        @InjectModel(License.name) private readonly licenseModel: Model<LicenseDocument>,
        @InjectModel(Error.name) private readonly errorModel: Model<ErrorDocument>,
    ) {
    }

    license(license: string): string {
        return "MyLicense: " + license;
    };

    async createLicense(createLicenseDto: CreateLicenseDto): Promise<License> {
        const createdLicense = await this.licenseModel.create(createLicenseDto);
        return createdLicense;
    }

    async findLicense(osmid: string): Promise<License> {
        return this.licenseModel.findOne({osmid: osmid}).exec();
    }

    async createError(createErrorDto: CreateErrorDto): Promise<Error> {
        const createdError = await this.errorModel.create(createErrorDto);
        return createdError;
    }

    async findError(osmid: string): Promise<LicenseError> {
        return this.errorModel.findOne({osmid: osmid}).exec().then((e: Error) => this.errorToEnum(e));
    }

    private errorToEnum(e: Error) {
        return e ? ({error: e.code, message: e.message} as unknown as LicenseError) : null;
    }
}
