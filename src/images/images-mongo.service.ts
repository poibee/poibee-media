import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {CreateImageDto} from './dto/create-image.dto';
import {Image, ImageDocument} from './schemas/image.schema';

@Injectable()
export class ImagesMongoService {
    constructor(
        @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    ) {
    }

    async create(createImageDto: CreateImageDto): Promise<Image> {
        const createdImage = await this.imageModel.create(createImageDto);
        return createdImage;
    }

    async findAll(): Promise<Image[]> {
        return this.imageModel.find().exec();
    }

    async findOne(id: string): Promise<Image> {
        return this.imageModel.findOne({_id: id}).exec();
    }

    async delete(id: string) {
        const deletedImage = await this.imageModel
            .findByIdAndRemove({_id: id})
            .exec();
        return deletedImage;
    }
}
