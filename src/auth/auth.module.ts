import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../users/schemas/users.schemas';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// aqui configuramos os recursos da autenticação
// importamos o Mongoose, o Passport module e JWT
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UsersSchema,
            },
        ]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                // informamos aqui o expiresIn
                expiresIn: process.env.JWT_EXPIRATION,
            },
        }),
    ],
    providers: [AuthService],
    exports: [AuthService], //exportamos o service para ser usado em outro módulo
})
export class AuthModule {}
