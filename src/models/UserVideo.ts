import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import User from './User';
import Video from './Video';

@Entity('user_videos')
class UserVideo {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	liked: number;

	@Column()
	reported: boolean;

	@Column()
	report_text: string;

	@Column()
	report_option: string;

	@Column()
	watches: number;

	@Column()
	is_owner: boolean;

	// Cria coluna para a chave estrangeira
	@Column()
	user_id: string;

	// Cria coluna para a chave estrangeira
	@Column()
	video_id: string;

	@JoinColumn({ name: 'user_id' })
	user: User;

	@JoinColumn({ name: 'video_id' })
	video: Video;

	@CreateDateColumn()
	created_at: Date;

	@CreateDateColumn()
	last_watch: Date;
}

export default UserVideo;
