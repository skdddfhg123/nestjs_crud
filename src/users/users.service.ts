import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
        const existingUsername = await this.userRepository.findOne({ where: { username: userDTO.username } });
        const existingEmail = await this.userRepository.findOne({ where: { useremail: userDTO.useremail } });

        if (existingUsername) {
            throw new ConflictException('Username already exists');
        }

        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const user = new User();
        user.username = userDTO.username;
        user.useremail = userDTO.useremail;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt);

        try {
            const savedUser = await this.userRepository.save(user);
            // delete savedUser.password;
            return savedUser;
        } catch (e) {
            // if (e.code === '23505') {
            //     throw new ConflictException('Username or Email already exists');
            // }
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findOne(data: Partial<User>): Promise<User> {
        // console.log(data)
        const user = await this.userRepository.findOneBy({ useremail: data.useremail });
        // console.log(user)
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }
}
