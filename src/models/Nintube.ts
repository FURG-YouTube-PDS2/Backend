import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nintubes')
class Nintube {
	// Podia ser "increment"
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	nickname: string;

	@Column()
	file: string;
}

export default Nintube;
