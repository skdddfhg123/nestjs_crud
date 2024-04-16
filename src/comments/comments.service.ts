import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/boards/board.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentDTO } from './dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createComment(user: User, boardId: number, commentText: string): Promise<Comment> {
        const user_ = await this.userRepository.findOneBy({ useremail: user.useremail });
        // console.log(user_);
        if (!user_) {
            throw new NotFoundException('user not found');
        }
        
        const board = await this.boardRepository.findOne({
            where: { id: boardId },
            relations: ['comments']
        });
    
        if (!board) {
            throw new NotFoundException('Board not found');
        }
    
        const comment = this.commentRepository.create({
            user: user_,
            board: board,
            comment: commentText,
            username: user.username
        });
    
        // Board의 댓글 목록에 추가
        board.comments = [...board.comments, comment];
    
        await this.commentRepository.save(comment);
        await this.boardRepository.save(board);  // 보드 업데이트
    
        console.log(comment);
        return comment;
    }

    async getCommentsByBoardId(boardId: number): Promise<CommentDTO[]> {
        const comments = await this.commentRepository.find({
            where: { board: { id: boardId } },
            relations: ['user']
        });
        return comments.map(comment => new CommentDTO(comment));
    }

    async deleteComment(commentId: number, user: User): Promise<void> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user', 'board']  // 댓글과 연관된 보드도 함께 로드
        });
    
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found.`);
        }
    
        if (comment.user.username !== user.username) {
            throw new UnauthorizedException('You are not authorized to delete this comment.');
        }
    
        // Board 엔티티의 comments 배열에서 해당 댓글 제거
        if (comment.board) {
            const board = await this.boardRepository.findOne({
                where: { id: comment.board.id },
                relations: ['comments']
            });
    
            if (board) {
                // 댓글 객체의 ID와 일치하지 않는 댓글만 필터링하여 목록 재구성
                board.comments = board.comments.filter(c => c.id !== commentId);
                await this.boardRepository.save(board);  // 업데이트된 보드 저장
            }
        }
    
        // 댓글 삭제
        await this.commentRepository.remove(comment);
    }
}
