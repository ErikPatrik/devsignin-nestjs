import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './models/users.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User')
        private readonly usersModel: Model<User>,
        private readonly authService: AuthService,
    ) {}

    // método para o usuário se registrar
    // retorna um Usuário
    public async signup(signupDto: SignupDto): Promise<User> {
        const user = new this.usersModel(signupDto);

        return user.save();
    }

    // método para se autenticar, retornando um objeto com name, jwtToken e email, isto retorna ao se autenticar
    public async signin(
        signinDto: SigninDto,
    ): Promise<{ name: string; jwtToken: string; email: string }> {
        // verificar se o e-mail existe na aplicação
        const user = await this.findByEmail(signinDto.email);
        const match = await this.checkPassword(signinDto.password, user);

        if (!match) {
            throw new NotFoundException('Invalid credentials.');
        }

        // se está tudo certo, cria o token
        const jwtToken = await this.authService.createAccessToken(user._id);

        // quando o usuário se autenticar, retorna isso
        return { name: user.name, jwtToken, email: user.email };
    }

    // método criado para buscar o e-mail
    private async findByEmail(email: string): Promise<User> {
        const user = await this.usersModel.findOne({ email });

        if (!user) {
            throw new NotFoundException('Email not found.');
        }

        return user;
    }

    // verifica se a senha ta certa do usuário no banco de dados
    private async checkPassword(
        password: string,
        user: User,
    ): Promise<boolean> {
        const match = await bcrypt.compare(password, user.password); // compare recebe dois parâmetros, a senha sem criptografia e a senha do banco de dados que possui hash

        if (!match) {
            throw new NotFoundException('Password not found.');
        }

        return match;
    }

    // método para buscar todos os usuários da aplicação, onde retorna um array, lista dos usuários
    public async findAll(): Promise<User[]> {
        return this.usersModel.find();
    }
}
