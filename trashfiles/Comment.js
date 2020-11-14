import Sequelize, { Model } from 'sequelize';

class Comment extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                text: Sequelize.STRING,
                timestamp: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );
    }
    // Relações
    static associate(models) {
        this.belongsTo(models.Video, {
            foreignKey: 'video_id',
            as: 'video',
        });
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

export default Comment;
