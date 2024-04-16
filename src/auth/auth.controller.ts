import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
    constructor (
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환',
        type: CreateUserDTO
    })
    @Post('signup')
    signUp(@Body(ValidationPipe) userDTO: CreateUserDTO): Promise<User> {
        try {
            return this.usersService.signup(userDTO);
        } catch (e) {
            throw e;
        }
    }
    
    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환',
        type: LoginDTO
    })
    @Post('login')
    login(
        @Body(ValidationPipe) loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        return this.authService.login(loginDTO);
    }


    @Get('env_test')
    testEnv() {
        return this.authService.getEnvVariables();
    }


    @ApiBearerAuth('JWT-auth')
    @Post('jwtGuard_test')
    @UseGuards(JwtAuthGuard)
    test(@Req() req: any) {
        console.log('req', req.user);
    }

    @ApiBearerAuth('JWT-auth')
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@Req() req: any): {username: string, useremail: string} {
        console.log('req', req.user.username);
        return { username: req.user.username, useremail: req.user.useremail };
    } 
}
