import {Injectable} from '@nestjs/common';
import {License} from "./schemas/license.schema";
import {LicenseError} from "../common/license-error";

@Injectable()
export class LicenseCacheService {

    private licenseCache: Map<String, License>;
    private errorCache: Map<String, LicenseError>;

    constructor() {
        this.licenseCache = new Map();
        this.errorCache = new Map();
    }

    public addLicense(license: License): void {
        console.log("Store license value: " + license.osmid);
        this.licenseCache.set(license.osmid, license);
    }

    public addError(osmid: string, licenseError: LicenseError): void {
        console.log("Store error value: " + osmid + " => " + JSON.stringify(licenseError));
        this.errorCache.set(osmid, licenseError);
    }

    public findLicense(osmid: string): License {
        const license = this.licenseCache.get(osmid);
        console.log("Find license value for " + osmid + " => " + JSON.stringify(license));
        return license;
    }

    public findError(osmid: string): LicenseError {
        const licenseError = this.errorCache.get(osmid);
        console.log("Find error value for " + osmid + " => " + JSON.stringify(licenseError));
        return licenseError;
    }

}
