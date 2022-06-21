import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { User } from '../../users/models/users.model';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../models/jwt-payload.model';

// PassportStrategy: quem define as estratégias de autenticação
// classe injetável que está extendendo do PassportStrategy
// Agora precisamos importar este arquivo no módulo de autenticação
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: authService.returnJwtExtractor(), // aqui traz o token
            ignoreEexpiration: false, // não pode ignorar o tempo de expiração
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    // Método para validar se o Token está válido, se o usuário pode seguir no uso da aplicação
    async validate(jwtPayload: JwtPayload): Promise<User> {
        // pega o usuário para fazer a validação la ná no AuthService
        const user = await this.authService.validateUser(jwtPayload);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
