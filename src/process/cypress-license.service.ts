import {Injectable} from "@nestjs/common";
import {ImageProperties} from "../common/image-properties";
import {LicenseError} from "../common/license-error";
import {License} from "../license/schemas/license.schema";
import {ImagePropertiesUtil} from "../common/image-properties-util";
import {exec} from "child_process";

const fs = require('fs');
const path = require("path");

const CYPRESS_TIMEOUT_IN_SECONDS = 180;

const WORKING_DIRECTORY = 'work';

@Injectable()
export class CypressLicenseService {

    async licenseOfData(osmid: string, imageProperties: ImageProperties): Promise<License | LicenseError> {
        this.deleteFilesOfDirectory(WORKING_DIRECTORY + '/');

        const result1 = this.writeToFile(WORKING_DIRECTORY + '/exchange-image-1-searchvalue.txt', imageProperties.entityid);
        const result2 = this.writeToFile(WORKING_DIRECTORY + '/exchange-image-2-data.json', JSON.stringify(imageProperties));
        const allResults: void | LicenseError = result1 ? result1 : result2;
        if (ImagePropertiesUtil.isErrorProperties(allResults)) {
            return new Promise(resolve => resolve(allResults as LicenseError));
        }

        this.startCypressProcess();

        const fileExists = await this.waitTillLicenseFileExists(WORKING_DIRECTORY + '/exchange-image-3-license.html', CYPRESS_TIMEOUT_IN_SECONDS);
        if (!fileExists) {
            return new Promise(resolve => resolve(LicenseError.E9_CYPRESS_TIMEOUT_ERROR));
        }

        const licenseHtml = this.readFromFile(WORKING_DIRECTORY + '/exchange-image-3-license.html');
        if (!ImagePropertiesUtil.isString(licenseHtml)) {
            return new Promise(resolve => resolve(LicenseError.E10_READING_CYPRESS_RESPONSE_FiLE_ERROR));
        }
        const license = this.licenseOfValue(osmid, imageProperties, licenseHtml as string);
        return new Promise(resolve => resolve(license));
    };

    private async waitTillLicenseFileExists(filePath: string, timeoutInSeconds: number): Promise<boolean> {
        const logIntervalInSeconds = 10;
        let waitingStepsInSeconds = timeoutInSeconds / logIntervalInSeconds;

        const poll = resolve => {
            console.log("Cypress waits for response file: " + (waitingStepsInSeconds * logIntervalInSeconds) + " seconds");
            waitingStepsInSeconds --;
            const fileExists = fs.existsSync(filePath);
            if (fileExists || waitingStepsInSeconds < 0) {
                resolve(fileExists);
            } else {
                setTimeout(() => poll(resolve), (1000 * logIntervalInSeconds));
            }
        }
        return await new Promise(poll);
    }

    private deleteFilesOfDirectory(directory: string) {
        let files = fs.readdirSync(directory);
        for (const file of files) {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
            });
        }
    }

    private writeToFile(file: string, content: string): void | LicenseError {
        try {
            fs.writeFileSync(file, content)
            return;
        } catch (err) {
            console.error("Cypress error - writing file: " + err);
            return LicenseError.E8_WRITING_CYPRESS_REQUEST_FiLE_ERROR;
        }
    }

    private readFromFile(file: string): string | LicenseError {
        try {
            return fs.readFileSync(file, 'utf8');
        } catch (err) {
            console.error("Cypress error - reading file: " + err);
            return LicenseError.E8_WRITING_CYPRESS_REQUEST_FiLE_ERROR;
        }
    }

    private licenseOfValue(osmid : string, imageProperties: ImageProperties, licenseHtml: string) {
        const licenseTypeWithoutEndTag = licenseHtml.replace(/<\/a>/g,'');
        const licenseType = licenseTypeWithoutEndTag.substring(licenseTypeWithoutEndTag.lastIndexOf(">") + 1);
        const licenseObject: License = {
            osmid: osmid,
            type: imageProperties.type,
            entityid: imageProperties.entityid,
            titleid: imageProperties.titleid,
            filename: imageProperties.filename,
            originurl: imageProperties.originurl,
            resizeurl: imageProperties.resizeurl,
            license: licenseType,
            licensetext: licenseHtml
        };
        return licenseObject;
    }

    private startCypressProcess() {
        exec('npm run cypress:run', (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout:\n${stdout}`);
        });
    }
}
