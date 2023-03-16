import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {CreateImageDto} from './dto/create-image.dto';
import {Image} from './schemas/image.schema';
import {ImagesMongoService} from "./images-mongo.service";

@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesMongoService) {
    }

    @Post()
    async create(@Body() createImageDto: CreateImageDto) {
        await this.imagesService.create(createImageDto);
    }

    @Get()
    async findAll(): Promise<Image[]> {
        return this.imagesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Image> {
        return this.imagesService.findOne(id);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.imagesService.delete(id);
    }
}
