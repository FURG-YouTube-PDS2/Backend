import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import User from './User';

@Entity('subscriptions')
class Subscription {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Cria coluna para a chave estrangeira
	@Column()
	user_subscriber: string;

	// Cria coluna para a chave estrangeira
	@Column()
	user_target: string;

	// Relação com usuario 1
	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_subscriber' })
	viewer: User;

	// Relação com usuario 2
	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_target' })
	channel: User;

	@CreateDateColumn()
	created_at: Date;
}

export default Subscription;
