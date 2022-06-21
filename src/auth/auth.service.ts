import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { User } from '../users/models/users.model';
import { JwtPayload } from './models/jwt-payload.model';

// aqui temos os métodos de autenticação, como validação de token
@Injectable()
export class AuthService {
    // aqui podemos injetar o model de usuários através do constructor
    constructor(
        // model injetado, passando como atributo o User
        @InjectModel('User')
        private readonly usersModel: Model<User>, // atributo que recebe a injeção de dependência, como nome usersModel, do tipo Model(Mongoose) e um genérico do tipo da informação User
    ) {}

    // abaixo estamos criando um token para o usuário, retornando uma promessa string
    // recebe o ID do usuário como parâmetro, e tal ID é passado para o método de assinar/cria o token como payload
    public async createAccessToken(userId: string): Promise<string> {
        // agora vamos assinatura o token com o método sign do jsonwebtoken
        return sign(
            {
                userId,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION,
            },
        );
    }

    // método para validar o usuário que retorna o Usuário(model) com todos os dados
    public async validateUser(jwtPayload: JwtPayload): Promise<User> {
        const user = await this.usersModel.findOne({
            _id: jwtPayload.userId,
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    // método para extrair o token do JWT e poder usá-lo
    // vai pegar o token e entregar para quem solicitar
    // o Request é do express
    private static jwtExtractor(request: Request): string {
        const authHeader = request.headers.authorization; // token vem no cabeçalho da requisição

        // se não existe o token
        if (!authHeader) {
            throw new BadRequestException('Bad request.');
        }

        // se existe
        // type: Bearer
        // pega somente a segunda parte
        const [, token] = authHeader.split(' ');

        return token;
    }

    // método que retorna o JWTExtractor
    public returnJwtExtractor(): (request: Request) => string {
        return AuthService.jwtExtractor;
    }
}
