export class CreateLicenseDto {
    readonly osmid: string;
    readonly type: string;
    readonly entityid: string;
    readonly titleid: string;
    readonly filename: string;
    readonly originurl: string;
    readonly resizeurl: string;
    readonly license: string;
    readonly licensetext: string;
}
