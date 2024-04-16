import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './boards-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { GetUser } from 'src/users/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BoardResponse } from './dto/boards-response.dto';

@ApiTags("board")
@Controller('all_board')
export class PublicBoardsController {
    constructor (private boardsService: BoardsService) {}

    @Get()
    findAllBoards(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<BoardResponse>> {
        try {
            limit = limit > 100 ? 100 : limit;
            return this.boardsService.paginateAllBoards({
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
}

@ApiTags("board")
@ApiBearerAuth('JWT-auth')
@Controller('boards')
@UseGuards(JwtAuthGuard)
export class SecuredBoardsController {
    constructor (private boardsService: BoardsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('photo'))
    @ApiConsumes('multipart/form-data')
    create(
        @Req() req: any,
        @Body() createBoardDto: CreateBoardDto,
        @GetUser() user:User,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Board> {
        console.log(file);
        return this.boardsService.createBoard(createBoardDto, user, file);
    }
    
    // @Get()
    // findMyBoards(
    //     @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    //     @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    //     @GetUser() user: User
    // ): Promise<Pagination<BoardResponse>> {
    //     try {
    //         limit = limit > 100 ? 100 : limit;
    //         return this.boardsService.paginateMyBoards({
    //             page,
    //             limit,
    //             user
    //         });
    //     } catch (e) {
    //         throw new HttpException(
    //         'server error',
    //         HttpStatus.INTERNAL_SERVER_ERROR, {
    //             cause: e,
    //         });
    //     }
    // }

    @Get(":id")
    findOne(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    ) id: number): Promise<Board> {
        return this.boardsService.findOneBoard(id);
    }

    @Patch(":id/status")
    async update(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus,
        @GetUser() user: User
    ) {
        try {
            return await this.boardsService.updateBoardStatus(id, status, user);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
            } else if (e instanceof UnauthorizedException) {
                throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR, { cause: e });
            }
        }
    }
    
    @Delete(":id")
    delete(
        @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.boardsService.deleteBoard(id, user);
    }
}
