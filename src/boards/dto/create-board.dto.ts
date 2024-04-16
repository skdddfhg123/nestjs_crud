import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
    
    @ApiProperty({ type: 'string', format: 'binary', description: 'Upload photo' })
    photo: Express.Multer.File;
}
