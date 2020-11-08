import Sequelize, { Model } from 'sequelize';

class User extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
      // Iniciando classe pai de user (Model)
      super.init(
        {
          // definição das colunas (sem PK, FK e Create/Update)
          first_name: Sequelize.STRING,
          last_name: Sequelize.STRING,
          email: Sequelize.STRING,
          password: Sequelize.VIRTUAL,
          timestamp: Sequelize.DATE,
        },
        {
          sequelize,
        }
      );
    }

  }
  
  export default User;
  