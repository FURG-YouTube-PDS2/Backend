import Sequelize, { Model } from 'sequelize';

class PlaylistVideo extends Model {
    // Parâmetro de entrada é a conexão do model
    static init(sequelize) {
        // Iniciando classe pai de user (Model)
        super.init(
            {
                // definição das colunas (sem PK, FK e Create/Update)
                position: Sequelize.INTEGER,
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
        this.belongsTo(models.Playlist, {
            foreignKey: 'playlist_id',
            as: 'playlist',
        });
        this.belongsTo(models.Video, {
            foreignKey: 'video_id',
            as: 'video',
        });
        this.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });
    }
}

export default PlaylistVideo;
