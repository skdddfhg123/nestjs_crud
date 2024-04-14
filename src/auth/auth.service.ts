import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.userService.findOne(loginDTO);

        const passwordMatched = await bcrypt.compare(
            loginDTO.password,
            user.password
        );
        console.log(passwordMatched)
        if (passwordMatched) {
            const payload = { username: user.username, sub: user.id };
            return {accessToken: this.jwtService.sign(payload)};
        } else {
            throw new UnauthorizedException("Password does not match"); // 5.
        }
    }
}
