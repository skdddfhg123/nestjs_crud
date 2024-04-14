import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from "bcryptjs";
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}


    async signup(userDTO: CreateUserDTO): Promise<User> {
        const user = new User();
        user.username = userDTO.username;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt);

        const savedUser = await this.userRepository.save(user);
        // delete savedUser.password;
        return savedUser;
    }

    async findOne(data: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOneBy({ username: data.username });
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }
}
