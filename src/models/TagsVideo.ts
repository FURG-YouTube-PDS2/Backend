import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from 'typeorm';
import Tags from './Tags';
import Video from './Video';

@Entity('tags_video')
class TagsVideo {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// Cria coluna para a chave estrangeira
	@Column()
	tag_id: string;

	// Cria coluna para a chave estrangeira
	@Column()
	video_id: string;

	@JoinColumn({ name: 'tag_id' })
	tags: Tags;

	@JoinColumn({ name: 'video_id' })
	video: Video;

	@CreateDateColumn()
	created_at: Date;
}

export default TagsVideo;
