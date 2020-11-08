import Sequelize, { Model } from 'sequelize';

class Playlist extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
      // Iniciando classe pai de user (Model)
      super.init(
        {
			// definição das colunas (sem PK, FK e Create/Update)
			id_user: Sequelize.STRING,
			last_name: Sequelize.STRING,
			email: Sequelize.STRING,
			password: Sequelize.VIRTUAL,
			timestamp: Sequelize.DATE,
        },
        {
			sequelize,
        }
      );
	  return this;
	}
	// Relações
	static associate(models) {
		this.belongsTo(models.Deliverer, {
			foreignKey: 'deliverer_id',
			as: 'deliverer',
		});
		this.belongsTo(models.Recipient, {
			foreignKey: 'recipient_id',
			as: 'recipient',
		});
	}
  }
  
  
  export default User;
  