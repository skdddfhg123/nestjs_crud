// import { User } from "src/auth/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BoardStatus } from "./boards-status.enum";
import { User } from "src/users/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/photos/photo.entity";
import { Comment } from "src/comments/comment.entity";

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: BoardStatus,
        default: BoardStatus.PUBLIC  // 기본값을 'PUBLIC'으로 설정
    })
    status: BoardStatus;

    @Column({ default: 0})
    like: number;

    @ManyToOne(type => User, user => user.boards, { eager: false })
    user: User;

    @OneToOne(type => Photo, photo => photo.board, { eager: true })
    photo: Photo

    @OneToMany(type => Comment, comment => comment.board, { eager: true })
    comments: Comment[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    releasedDate: Date;

    @CreateDateColumn()
    @ApiProperty({ description: 'The date when the board was created', example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: 'The date when the board was last updated', example: '2023-01-02T00:00:00.000Z' })
    updatedAt: Date;

    @DeleteDateColumn()
    @ApiProperty({ description: 'The date when the board was deleted', example: '2023-01-03T00:00:00.000Z' })
    deletedAt?: Date;
}
