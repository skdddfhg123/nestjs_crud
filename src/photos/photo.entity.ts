import { Exclude } from 'class-transformer';
import { Board } from 'src/boards/board.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bytea' })
    @Exclude()
    data: Buffer;

    @OneToOne(() => Board, board => board.photo)
    @JoinColumn()
    board: Board;
}
