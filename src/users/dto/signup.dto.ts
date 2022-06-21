// Usado para cadastrar os usuários
// Dados que recebemos de outra aplicação

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto {
    @IsNotEmpty() // não pode ser vazio
    @IsString() // tem que ser string
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail() // é um e-mail
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4) // tamanho mínimo de 4 caracteres
    password: string;
}
