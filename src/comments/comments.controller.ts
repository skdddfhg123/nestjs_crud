import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CommentsService } from './comments.service';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.entity';

@ApiTags("comments")
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) {}

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ 
        schema: {
            type: 'object',
            required: ['boardId', 'comment'],
            properties: { boardId: { type: 'number' } , comment: { type: 'string' } },
        },
    })
    async createComment(
        @Body('boardId') boardId: number,
        @Body('comment') comment: string,
        @GetUser() user:User,
    ) {
        try {
            await this.commentService.createComment(user, boardId, comment);
            return { message: 'Comment created successfully.' };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        }
    }

    @Get('/:boardId')
    async getComments(@Param('boardId') boardId: number) {
        return this.commentService.getCommentsByBoardId(boardId);
    }

    @Delete('/:commentId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async deleteComment(
        @Param('commentId') commentId: number,
        @GetUser() user: User
    ) {
        try {
            await this.commentService.deleteComment(commentId, user);
            return { message: 'Comment deleted successfully.' };
        } catch (e) {
            // Specific exception types can be handled more gracefully
            if (e instanceof NotFoundException || e instanceof UnauthorizedException) {
                throw new HttpException(e.message, HttpStatus.FORBIDDEN);
            }
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
