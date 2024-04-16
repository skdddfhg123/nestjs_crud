import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { PublicBoardsController, SecuredBoardsController } from './boards.controller';
import { Board } from './board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Photo } from 'src/photos/photo.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([Photo]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Comment]),
    AuthModule,
  ],
  providers: [BoardsService],
  controllers: [PublicBoardsController, SecuredBoardsController]
})
export class BoardsModule {}
