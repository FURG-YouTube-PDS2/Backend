import * as Yup from 'yup';
import User from '../models/User';

require('express-async-errors');

class UserController {
  async store(req, res) {
    // Schema de verificação de input usando Yup
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
    });

    // Teste que verifica se o req.body está dentro das regras criadas no schema
    const schemaVerify = await schema.validate(req.body).catch(err => {
      return err.message;
    });
    if (typeof schemaVerify === 'string') {
      return res.status(400).json({ error: schemaVerify });
    }

    // Método RocketSeat - Mensagem de erro genérica
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation error' });
    // }

    // Busca no DB se existe um email correspondente
    const userVerify = await User.findOne({ where: { email: req.body.email } });
    if (userVerify) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const { first_name, last_name, email, password } = await User.create(
      req.body
    );

    return res.json({
      first_name,
      last_name,
      email,
      password,
    });
  }

  async update(req, res) {
    // Schema de verificação de input usando Yup
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      // "when" como condicional que exige password caso oldpassword tenha sido passado
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => {
          return oldPassword ? field.required() : field;
        }),
      confirmPassword: Yup.string().when('password', (password, field) => {
        // Confirma que senha == confirmarSenha
        return password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    // Teste que verifica se o req.body está dentro das regras criadas no schema
    const schemaVerify = await schema.validate(req.body).catch(err => {
      return err.message;
    });
    if (typeof schemaVerify === 'string') {
      return res.status(400).json({ error: schemaVerify });
    }

    const { email, oldPassword } = req.body;

    // ID passado para dentro do request pelo middleware de auth
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Wrong Password' });
    }

    const { id, name, provider, first_name, last_name } = await user.update(
      req.body
    );

    return res.json({ id, name, email, provider, first_name, last_name });
  }
}

export default new UserController();
