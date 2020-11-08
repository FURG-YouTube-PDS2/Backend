import Sequelize, { Model } from 'sequelize';

class Video extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
      // Iniciando classe pai de user (Model)
      super.init(
        {
          // definição das colunas (sem PK, FK e Create/Update)
          first_name: Sequelize.STRING,
          title: Sequelize.STRING,
          description: Sequelize.STRING,
          password: Sequelize.VIRTUAL,
          timestamp: Sequelize.DATE,
        },
        {
          sequelize,
        }
      );
    }

  }
  
  export default Video;