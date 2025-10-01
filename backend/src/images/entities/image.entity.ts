import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ImageItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column('simple-array')
  keywords: string[];
}
