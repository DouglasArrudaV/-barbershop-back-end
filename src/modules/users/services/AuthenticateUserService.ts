import { getRepository } from 'typeorm';
import {compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/user'

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({email, password}: Request): Promise<Response> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne({where: {email}});

        if(!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        //user.password - Senha criptografada
        //password - Senha não-criptografada

        const paawordMatched = await compare(password, user.password);

        if(!paawordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        const {secret, expiresIn} = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };

    }
}

export default AuthenticateUserService;