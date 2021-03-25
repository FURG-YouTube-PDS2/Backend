import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	ManyToMany,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import User from './User';
import Playlist from './Playlist';
import Video from './Video';

@Entity('playlist_videos')
class PlaylistVideo {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	position: number;

	// Cria coluna FK para User
	@Column()
	user_id: string;

	// Cria coluna FK para Video
	@Column()
	video_id: string;

	// Cria coluna FK para Playlist
	@Column()
	playlist_id: string;

	@CreateDateColumn()
	created_at: Date;
}

export default PlaylistVideo;
