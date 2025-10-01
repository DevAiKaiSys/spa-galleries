import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImageItem } from './entities/image.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // GET /images?page=1&perPage=20&filter=keyword_x
  @Get()
  async getImages(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
    @Query('filter') filter?: string,
  ): Promise<ImageItem[]> {
    return this.imagesService.findAll(
      parseInt(page, 10),
      parseInt(perPage, 10),
      filter,
    );
  }
}
