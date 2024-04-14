import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('boards')
export class BoardsController {
    constructor (private boardsService: BoardsService) {}

    @Post()
    create(
        @Body() createBoardDto: CreateBoardDto
    ): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto);
    }
    
    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Board>> {
        try {
            limit = limit > 100 ? 100 : limit;
            return this.boardsService.paginate({
                page,
                limit,
            });
        } catch (e) {
            throw new HttpException(
            'server error',
            HttpStatus.INTERNAL_SERVER_ERROR, {
                cause: e,
            });
        }
    }

    @Get(":id")
    findOne(@Param(
        'id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    ) id: number): Promise<Board> {
        return this.boardsService.findOneBoard(id);
    }

    @Patch(":id/status")
    update(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }
    
    @Delete(":id")
    delete(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<void> {
        return this.boardsService.deleteBoard(id);
    }
}
