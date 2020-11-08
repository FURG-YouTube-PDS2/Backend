import * as Yup from 'yup';
import Deliverer from '../models/Deliverer';

require('express-async-errors');

class DelivererController {
  async store(req, res) {
    // Schema de verificação de input usando Yup
    const schema = Yup.object().shape({
      first_name: Yup.string(),
      last_name: Yup.string(),
      email: Yup.string().email(),
    });

    /**
     * Body request verification with precise error message
     */
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

    const delivererVerify = await Deliverer.findOne({
      where: { email: req.body.email },
    });
    if (delivererVerify) {
      return res.status(400).json({ error: 'Deliverer already registered.' });
    }

    const { first_name, last_name, email, avatar_id } = await Deliverer.create(
      req.body
    );

    return res.json({
      first_name,
      last_name,
      email,
      avatar_id,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      first_name: Yup.string()
        .min(2)
        .max(40),
      last_name: Yup.string()
        .min(2)
        .max(40),
    });

    const schemaVerify = await schema.validate(req.body).catch(err => {
      return err.message;
    });
    if (typeof schemaVerify === 'string') {
      return res.status(400).json({ error: schemaVerify });
    }

    const { email } = req.body;
    const { id } = req.params;

    const deliverer = await Deliverer.findOne({ where: { id } });

    if (email) {
      const delivererExists = await Deliverer.findOne({ where: { email } });

      if (delivererExists) {
        return res.status(400).json({ error: 'Deliverer already exists.' });
      }
    }

    const { first_name, last_name } = await deliverer.update(req.body);

    return res.json({ id, first_name, last_name, email });
  }
}

export default new DelivererController();
