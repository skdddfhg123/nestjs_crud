import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('signup')
    signUp(@Body(ValidationPipe) userDTO: CreateUserDTO): Promise<User> {
        return this.usersService.signup(userDTO);
    }
    
    @Post('login')
    login(
        @Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        return this.authService.login(loginDTO);
    }

    @Get('test')
    testEnv() {
        return this.authService.getEnvVariables();
    }
}
