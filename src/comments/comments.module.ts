import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Board } from 'src/boards/board.entity';
import { User } from 'src/users/user.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Board, User])],
    providers: [CommentsService],
    controllers: [CommentsController]
})
export class CommentsModule {}