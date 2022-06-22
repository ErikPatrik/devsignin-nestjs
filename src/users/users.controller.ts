import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/users.model';
import { UsersService } from './users.service';

//aqui criamos as rotas

@Controller('users')
export class UsersController {
    // criamos um constructor para injetar os serviços do users.service aqui
    constructor(private readonly usersService: UsersService) {}

    // para criar um usuário / users/signup
    @Post('signup')
    @HttpCode(HttpStatus.CREATED) // retorna informação de criado
    public async signup(@Body() signupDto: SignupDto): Promise<User> {
        // parametro que recebemos por conteudo é o body do tipo signupDto e retorna como Promisse o User
        return this.usersService.signup(signupDto);
    }

    // para se autenticar
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    public async(
        @Body() signinDto: SigninDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        return this.usersService.signin(signinDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt')) // rota protegida como parâmetro passando o que vai proteger a rota
    @HttpCode(HttpStatus.OK)
    public async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
}
