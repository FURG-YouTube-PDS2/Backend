import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './User';
import Video from './Video';

@Entity('comments')
class Comment {
    // Podia ser "increment"
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    // Coluna qualquer
    text: string;

    @Column()
    // Coluna qualquer
    edited: boolean;

    // Cria coluna para a chave estrangeira
    @Column()
    user_id: string;

    // Cria coluna para a chave estrangeira
    @Column()
    video_id: string;

    // Cria coluna para a chave estrangeira
    @Column()
    reply_id: string;

    // Relação com usuario
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relação com usuario
    @ManyToOne(() => Video)
    @JoinColumn({ name: 'video_id' })
    video: Video;

    // Relação com usuario
    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'reply_id' })
    comment: Comment;

    @CreateDateColumn()
    created_at: Date;
}

export default Comment;
