import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './User';


@Entity('playlists')
class Playlist {
    // Podia ser "increment"
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    // Coluna qualquer
    name: string;

    @Column()
    // Coluna qualquer
    public: boolean;

    @Column()
    // Coluna qualquer
    fixed: boolean;

    // Cria coluna para a chave estrangeira
    @Column()
    user_id: string;

    // Relação com usuario
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // @Column('timestamp with time zone')
    // //timestamp:
    // timestamp: Date;

    @CreateDateColumn()
    created_at: Date;
}

export default Playlist;
