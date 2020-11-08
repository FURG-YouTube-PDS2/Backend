import jwt from 'jsonwebtoken';

// Função que transforma uma função no estilo antigo (callbacks) para função async/await
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Espera-se que Token tenha sido enviado pelo header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // ["bearer", "token"]
  const [, token] = authHeader.split(' ');

  try {
    // promisify retorna uma função async, que é invocada em seguida
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // inserindo id referente ao token decodificado no request
    // pra poder saber o usuário a ser gerenciado
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
