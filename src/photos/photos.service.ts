import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>
    ) {}

    async savePhoto(dataBuffer: Buffer) {
        const photo = new Photo();
        photo.data = dataBuffer;
        return await this.photoRepository.save(photo);
    }
}
