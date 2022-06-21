import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersSchema } from './schemas/users.schemas';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    //importamos os módulos abaixo
    imports: [
        MongooseModule.forFeature([
            // módulo do mongoose
            {
                name: 'User',
                schema: UsersSchema,
            },
        ]),
        AuthModule, // módulo da autenticação
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
