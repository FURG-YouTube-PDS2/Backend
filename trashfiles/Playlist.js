import Sequelize, { Model } from 'sequelize';

class Playlist extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                name: Sequelize.STRING,
                public: Sequelize.BOOLEAN,
                fixed: Sequelize.BOOLEAN,
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
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }
}

export default Playlist;
