import Sequelize, { Model } from 'sequelize';

class UserComment extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                liked: Sequelize.INTEGER,
                timestamp: Sequelize.DATE,
            },
            {

                sequelize,
            }
        );
    }
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
        this.belongsTo(models.Comment, {
            foreignKey: 'comment_id',
            as: 'comment',
        });
    }

}

export default UserComment;