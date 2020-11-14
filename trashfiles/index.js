import Sequelize from 'sequelize';

// Models import
import User from '../app/models/Example_User';
import Recipient from '../app/models/Recipient';
import Deliverer from '../app/models/Deliverer';
import Order from '../app/models/Order';

import databaseConfig from '../config/database';

const models = [User, Recipient, Deliverer, Order];

class Database {
  constructor() {
    this.init();
  }

  // Método para conexão com a base de dados e carregar os models
  init() {
    this.connection = new Sequelize(databaseConfig);

    // Percorre todos os models e inicia todos com a conexão feita acima
    models.map(model => model.init(this.connection));

    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
