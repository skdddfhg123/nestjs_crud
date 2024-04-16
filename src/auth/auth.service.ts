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
        // console.log(loginDTO);
        const user = await this.userService.findOne(loginDTO);
        
        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        // console.log(user);

        const passwordMatched = await bcrypt.compare( loginDTO.password, user.password );

        if (passwordMatched) {
            const payload = { username: user.username, sub: user.useremail };
            console.log(payload);
            return {accessToken: this.jwtService.sign(payload)};
        } else {
            throw new UnauthorizedException("Password does not match");
        }
    }
}
