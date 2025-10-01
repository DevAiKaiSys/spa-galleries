import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageItem } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageItem])],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
