import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './User';
import Comment from './Comment'; 


@Entity('UserComment')
class UserComment {
    // Podia ser "increment"
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    liked: number;

    // Cria coluna para a chave estrangeira
    @Column()
    user_id: string;

    // Cria coluna para a chave estrangeira
    @Column()
    comment_id: string;

    @JoinColumn({ name: 'user_id' })
    user: User;

    @JoinColumn({ name: 'comment_id' })
    comment: Comment;

    @CreateDateColumn()
    created_at: Date;
}

export default UserComment;