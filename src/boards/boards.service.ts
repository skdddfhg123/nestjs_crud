import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BoardStatus } from './boards-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/users/user.entity';
import { CustomPaginationOptions } from '../users/user-pagination';
import { Photo } from 'src/photos/photo.entity';
import BoardResponse from './dto/boards-response.dto';
import { Comment } from 'src/comments/comment.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAllBoard(): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        const boards = await query.getMany();

        return boards;
    }

    async findAllmyBoard( user: User ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        query.where('board.userId = :userId', { userId: user.id })

        const boards = await query.getMany();

        return boards;
    }

    // async findOneBoard( id: number ): Promise<Board> {
    //     // const found = await this.boardRepository.findOneBy( {id} );
    //     const found = await this.boardRepository.createQueryBuilder('board')
    //         .leftJoinAndSelect('board.user', 'user')
    //         .where('board.id = :id', { id })
    //         .getOne(); // lazy load

    //     if (!found) {
    //         throw new NotFoundException(`Can't find Baord with id ${id}`);
    //     }

    //     return found;
    // }
    async findOneBoard(id: number): Promise<Board> {
        const found = await this.boardRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .leftJoinAndSelect('board.photo', 'photo')
            .where('board.id = :id', { id })
            .getOne();
    
        if (!found) {
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
    
        return found;
    }

    async createBoard(createBoardDto: CreateBoardDto, user: User, file: Express.Multer.File): Promise<Board> {
        const { title, description } = createBoardDto;
    
        const user_ = await this.userRepository.findOneBy({ useremail: user.useremail });
        // console.log(user)
        if (!user_) {
            throw new UnauthorizedException('Could not find user');
        }
        console.log(user_)

        try {
            const newBoard = this.boardRepository.create({
                title,
                description,
                user: user_
            });
    
            const savedBoard = await this.boardRepository.save(newBoard);
    
            if (file) {
                const newPhoto = this.photoRepository.create({
                    data: file.buffer,
                    board: savedBoard
                });
                await this.photoRepository.save(newPhoto);
            }
    
            return savedBoard;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Failed to create board');
        }
    }

    // async createBoard(createBoardDto: CreateBoardDto, user: User, file: Express.Multer.File): Promise<BoardResponse> {
    //     const { title, description } = createBoardDto;

    //     try {
    //         const newBoard = this.boardRepository.create({
    //             title,
    //             description,
    //             user,
    //         });

    //         const savedBoard = await this.boardRepository.save(newBoard);

    //         if (file) {
    //             const newPhoto = this.photoRepository.create({
    //                 data: file.buffer,
    //                 board: savedBoard,
    //             });
    //             await this.photoRepository.save(newPhoto);
    //             savedBoard.photo = newPhoto;
    //         }

    //         return this.mapBoardToResponse(savedBoard);
    //     } catch (error) {
    //         throw new InternalServerErrorException('Failed to create board');
    //     }
    // }

    // private mapBoardToResponse(board: Board): BoardResponse {
    //     const response: BoardResponse = {
    //         id: board.id,
    //         title: board.title,
    //         description: board.description,
    //         user: board.user,
    //         photo: board.photo, // 이 부분을 추가합니다.
    //         status: board.status,
    //         like: board.like,
    //         releasedDate: board.releasedDate,
    //         createdAt: board.createdAt,
    //         updatedAt: board.updatedAt,
    //     };
    //     return response;
    // }


    async deleteBoard(id: number, user: User): Promise<void> {
        const result = await this.boardRepository.delete({id, user});

        if (result.affected === 0) {
            throw new NotFoundException(`Can't find Board with id ${id}`)
        }
    }

    // async updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board> {
    //     const board = await this.findOneBoard(id);

    //     if (!board) {
    //         throw new NotFoundException(`Board with ID ${id} not found.`);
    //     }

    //     if (board.user.id !== user.id) {
    //         throw new UnauthorizedException('You are not authorized to update this board.');
    //     }

    //     board.status = status;
    //     await this.boardRepository.save(board);

    //     return board;
    // }
    async updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board> {
        const board = await this.findOneBoard(id);
    
        if (!board) {
            throw new NotFoundException(`Board with ID ${id} not found.`);
        }
    
        if (board.user.id !== user.id) {
            throw new UnauthorizedException('You are not authorized to update this board.');
        }
    
        board.status = status;  // 이 부분에서 status 타입을 확인해야 함
        await this.boardRepository.save(board);
    
        return board;
    }

    // async paginateAllBoards(options: IPaginationOptions): Promise<Pagination<Board>> {
    //     const queryBuilder = this.boardRepository.createQueryBuilder('board');
    //     queryBuilder.where('board.status = :status', { status: 'PUBLIC' });
    //     queryBuilder.orderBy('board.releasedDate', 'DESC');
    //     return paginate<Board>(queryBuilder, options);
    // }

    // async paginateAllBoards(options: IPaginationOptions): Promise<Pagination<Board>> {
    //     const queryBuilder = this.boardRepository.createQueryBuilder('board');
    //     queryBuilder.leftJoinAndSelect('board.user', 'user');
    //     queryBuilder.leftJoinAndSelect('board.photo', 'photo');
    //     queryBuilder.where('board.status = :status', { status: 'PUBLIC' });
    //     queryBuilder.orderBy('board.releasedDate', 'DESC');
    
    //     const paginatedBoards = await paginate<Board>(queryBuilder, options);
    //     console.log(paginatedBoards);
    //     return paginatedBoards;
    // }

    async paginateAllBoards(options: IPaginationOptions): Promise<Pagination<BoardResponse>> {
        const queryBuilder = this.boardRepository.createQueryBuilder('board');
        queryBuilder.leftJoinAndSelect('board.user', 'user');
        // queryBuilder.leftJoinAndSelect('board.comments', 'comments');
        queryBuilder.leftJoinAndSelect('board.photo', 'photo');
        queryBuilder.where('board.status = :status', { status: 'PUBLIC' });
        queryBuilder.orderBy('board.releasedDate', 'DESC');
        
        // print(queryBuilder);

        const paginatedBoards = await paginate<Board>(queryBuilder, options);
    
        // Photo 데이터가 필요할 때만 로드하여 Base64로 인코딩
        const boardResponses = await Promise.all(paginatedBoards.items.map(async (board) => {
            let photoData = null;
            if (board.photo) {
                const photo = board.photo ? await this.photoRepository.findOne({ where: { id: board.photo.id } }) : null;
                photoData = photo ? Buffer.from(photo.data).toString('base64') : null;
            }
    
            return {
                id: board.id,
                title: board.title,
                description: board.description,
                status: board.status,
                like: board.like,
                releasedDate: board.releasedDate,
                createdAt: board.createdAt,
                updatedAt: board.updatedAt,
                deletedAt: board.deletedAt || null,
                user: board.user,
                photo: photoData,
                // comments: board.comments
            };
        }));

        console.log(boardResponses);

        return new Pagination<BoardResponse>(
            boardResponses,
            paginatedBoards.meta,
            paginatedBoards.links,
        );
    }

    // async paginateMyBoards(options: CustomPaginationOptions): Promise<Pagination<Board>> {
    //     const queryBuilder = this.boardRepository.createQueryBuilder('board');
    //     queryBuilder.leftJoinAndSelect('board.user', 'user');
    //     queryBuilder.leftJoinAndSelect('board.photo', 'photo');
    //     queryBuilder.where('user.email = :email', { email: options.user.useremail }); // 이메일을 사용한 조건 추가
    //     queryBuilder.orderBy('board.releasedDate', 'DESC');

    //     console.log(options.user);
    //     return paginate<Board>(queryBuilder, options);
    // }

    // async paginateMyBoards(options: CustomPaginationOptions): Promise<Pagination<BoardResponse>> {
    //     // Create the query builder with joins to load user and photo
    //     const queryBuilder = this.boardRepository.createQueryBuilder('board');
    //     queryBuilder.leftJoinAndSelect('board.user', 'user');
    //     queryBuilder.leftJoinAndSelect('board.photo', 'photo');
    //     queryBuilder.where('user.useremail = :email', { email: options.user.useremail });
    //     queryBuilder.orderBy('board.releasedDate', 'DESC');
    
    //     // Use the paginate utility to get the paginated results
    //     const paginatedBoards = await paginate<Board>(queryBuilder, options);

    //     console.log(paginatedBoards);
    
    //     // Map over the items to handle the photo data similar to paginateAllBoards
    //     const boardResponses = await Promise.all(paginatedBoards.items.map(async (board) => {
    //         let photoData = null;
    //         if (board.photo) {
    //             const photo = board.photo ? await this.photoRepository.findOne({ where: { id: board.photo.id } }) : null;
    //             photoData = photo ? Buffer.from(photo.data).toString('base64') : null;
    //         }
    
    //         return {
    //             id: board.id,
    //             title: board.title,
    //             description: board.description,
    //             status: board.status,
    //             like: board.like,
    //             releasedDate: board.releasedDate,
    //             createdAt: board.createdAt,
    //             updatedAt: board.updatedAt,
    //             deletedAt: board.deletedAt || null,
    //             user: board.user,
    //             photo: photoData
    //         };
    //     }));

    //     // Return the new Pagination object with the modified structure
    //     return new Pagination<BoardResponse>(
    //         boardResponses,
    //         paginatedBoards.meta,
    //         paginatedBoards.links,
    //     );
    // }
}
