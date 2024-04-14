import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { Board } from './board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [BoardsService],
  controllers: [BoardsController]
})
export class BoardsModule {}
