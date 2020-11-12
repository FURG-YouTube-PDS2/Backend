import { Entity, Column, PrimaryGenerateColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './User'


@Entity('appointments')
class Comment {
    // Podia ser "increment"
    @PrimaryGenerateColumn('uuid');
    id: string;

    @Column()
    // Coluna qualquer

    // Cria coluna para a chave estrangeira
    @Column()
    user_id: string;

    // Relação com usuario
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('timestamp with time zone')
    //timestamp:
    date: Date;

    @CreateDateColumn()
    created_at: Date;
}

export default Comment;