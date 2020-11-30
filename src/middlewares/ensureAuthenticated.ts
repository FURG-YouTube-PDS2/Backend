import { Request, Response, NextFunction } from 'express';
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



/* Utilização:
 * Invocar essa função antes de uma ação que precise estar logado
 * Todas rotas: xxxRouter.use(ensureAuthenticated);
 * Uma rota: xxxRouter.get('/', ensureAuthenticated, (req,res))
 */
export default function ensureAuthenticated(
	request: Request,
	response: Response,
	next: NextFunction
): void {
	// Validação do token JWT

	const authHeader = request.headers.authorization;

	if (!authHeader) {
		throw new Error('JWT não foi passado');
	}

	const [, token] = authHeader.split(' ')

	const { secret } = authConfig.jwt;

	try {
		const decodedToken = verify(token, secret);

		// Permite que o usuario continue a aplicação
		return next();

	} catch (err) {
		throw new Error('JWT token invalido.')
	}
}
