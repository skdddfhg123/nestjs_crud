import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/user.entity";
import { Photo } from "src/photos/photo.entity";
import { Comment } from "src/comments/comment.entity";

export class BoardResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: User })
    user: User;
    
    // @ApiProperty({ type: Photo })
    // photo: Photo;
    @ApiProperty()
    photo: string | null;

    // @ApiProperty()
    // comments: Comment[] | null;

    @ApiProperty()
    status: string;

    @ApiProperty()
    like: number;

    @ApiProperty()
    releasedDate: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export default BoardResponse;