import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['username', 'useremail'])  // 이메일에 대한 유니크 제약 조건 추가
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of the user' })
    id: number;

    @Column()
    @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
    username: string;

    @Column()
    @ApiProperty({ description: 'The email of the user', example: 'john_doe@example.com' })
    useremail: string;

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn()
    @ApiProperty({ description: 'The date when the user was created', example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @UpdateDateColumn()
    @ApiProperty({ description: 'The date when the user was last updated', example: '2023-01-02T00:00:00.000Z' })
    updatedAt: Date;

    @DeleteDateColumn()
    @ApiProperty({ description: 'The date when the user was deleted', example: '2023-01-03T00:00:00.000Z' })
    deletedAt?: Date;

    @OneToMany(type => Board, board => board.user, { eager: false })
    boards: Board[];
}