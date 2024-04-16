import { Exclude } from 'class-transformer';
import { Board } from 'src/boards/board.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    comment: string;

    @Column({ default: 0 })
    like: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Board, board => board.comments)
    @Exclude()
    board: Board;
}