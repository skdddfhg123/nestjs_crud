import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) {}

    async findAllBoard(): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        // query.where('board.userId = :userId', { userId: user.id })

        const boards = await query.getMany();

        return boards;
    }

    async findOneBoard(id: number): Promise<Board> {
        const found = await this.boardRepository.findOneBy({id});

        if (!found) {
            throw new NotFoundException(`Can't find Baord with id ${id}`);
        }

        return found;
    }

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        const {title, description} = createBoardDto;

        const board = {
            title,
            description,
            status: BoardStatus.PUBLIC
        }

        return await this.boardRepository.save(board);
    }

    async deleteBoard(id: number): Promise<void> {
        const result = await this.boardRepository.delete({id});

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
        const board = await this.findOneBoard(id);

        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Board>> {
        const queryBuilder = this.boardRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.id', 'DESC');
        return paginate<Board>(queryBuilder, options);
    }
}
