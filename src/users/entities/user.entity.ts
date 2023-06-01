import { Gender } from 'src/constant/constant';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  dob: string;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  otp: string;
}
