import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import User from './User';

@Entity('videos')
class Video {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	file: string;

	@Column()
	thumb: string;

	@Column()
	privacy: boolean;

	@CreateDateColumn()
	created_at: Date;
}

export default Video;
