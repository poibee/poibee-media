import {LicenseError} from "../common/license-error";
import {ImageProperties} from "./image-properties";
import {License} from "../license/schemas/license.schema";

export class ImagePropertiesUtil {

    public static isImageProperties(object : ImageProperties | LicenseError) {
        return object && (object as ImageProperties).type !== undefined;
    }

    public static isLicenseProperties(object : License | LicenseError) {
        return object && (object as License).type !== undefined;
    }

    public static isErrorProperties(object : void | LicenseError) {
        return object !== null && object !== undefined;
    }

    public static isString(object : string | LicenseError) {
        return (typeof object === "string");
    }
}
