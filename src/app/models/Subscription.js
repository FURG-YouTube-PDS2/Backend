import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                timestamp: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );
    }
    // Relações
    // Para as duas chaves de User:
    // Uma apelidada como 'Viewer' e outra como 'Channel'
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'viewer',
        });
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'channel',
        });
    }
}

export default Subscription;
