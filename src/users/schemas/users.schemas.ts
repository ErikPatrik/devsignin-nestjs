import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

// Schema é uma estrutura de um objeto para cada atributo que temos no model User para definir o schema de dados que o mongoose vai trabalhar
export const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

// FAZENDO ALGUMAS VALIDAÇÕES

// Antes de salvar um registro
UsersSchema.pre('save', async function (next) {
    try {
        // se a senha que estou enviando pra ser salva ela não foi modificada, não faço nada
        if (!this.isModified('password')) {
            return next(); // parte para a próxima tarefa, então vai para o salvar
        }

        // a senha chega sem criptografia, então criptografamos para salvar,e mais o 10 do salt
        this['passowrd'] = await bcrypt.hash(this['passowrd'], 10);
    } catch (err) {
        return next(err);
    }
});
