import Sequelize, { Model } from 'sequelize';

class UserVideo extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                liked: Sequelize.INTEGER,
                reported: Sequelize.BOOLEAN,
                report_text: Sequelize.STRING,
                report_option: Sequelize.STRING,
                timestamp: Sequelize.DATE,
                watches: Sequelize.INTEGER,
                is_owner: Sequelize.BOOLEAN,
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
        this.belongsTo(models.Video, {
            foreignKey: 'video_id',
            as: 'video',
        });
    }

}

export default UserVideo;