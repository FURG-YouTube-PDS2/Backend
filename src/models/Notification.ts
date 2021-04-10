import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import User from './User';

@Entity('notifications')
class Notification {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	type: string;

	@Column()
	user_id: string;

	@Column()
	action_id: string;

	@Column()
	target_id: string;

	@Column()
	readed: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@CreateDateColumn()
	created_at: Date;
}

export default Notification;
