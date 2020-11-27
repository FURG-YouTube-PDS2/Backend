import { Response } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth'


/* Payload = Informações do usuario no header do token
 * iat: Quando foi criado
 * exp: Quando expira
 * sub: Id do usuário
 */
interface TokenPayload {
	iat: number;
	exp: number;
	sub: string;
}


export default function checkJwt(token: string): TokenPayload {
	if (!token) {
		throw new Error('JWT não foi passado');
	}

	const { secret } = authConfig.jwt;

	try {
		const decodedToken = <any>verify(token, secret);

		// Retorna o payload
		return decodedToken;

	} catch (err) {
		throw new Error('JWT token invalido.');
	}
}
