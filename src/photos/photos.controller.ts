import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggingInterceptor } from 'src/common/middleware/logger/logger.interceptor';
import { diskStorage } from 'multer';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'), LoggingInterceptor)
    @ApiOperation({ summary: 'Upload a photo' })
    @ApiResponse({ status: 201, description: 'Photo successfully uploaded.' })
    @ApiResponse({ status: 500, description: 'Failed to upload photo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'The file to upload.',
        type: 'file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    })
    async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }
        try {
            console.log(`Uploaded file size: ${file.size} bytes`);
            await this.photosService.savePhoto(file.buffer);
        } catch (e) {
            console.error('Error during file upload:', e);
            throw new HttpException('Failed to upload photo', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
