import {Controller, Get, Param} from '@nestjs/common';
import {LicenseMongoService} from "./license-mongo.service";

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseMongoService: LicenseMongoService) {}

  /**
   * http://localhost:3000/license/text/Huhu-ihr-alle
   */
  @Get('text/:license')
  getLicense(@Param('license') license: string): string {
    return this.licenseMongoService.license(license);
  }

}
