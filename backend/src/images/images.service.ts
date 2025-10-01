import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ImageItem } from './entities/image.entity';

function getRandomLetter() {
  const charCode = 97 + Math.floor(Math.random() * 26); // a=97 → z=122
  return String.fromCharCode(charCode);
}

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ImageItem)
    private readonly imagesRepository: Repository<ImageItem>,
  ) {}

  async findAll(
    page: number,
    perPage: number,
    filter?: string,
  ): Promise<ImageItem[]> {
    const where = filter ? { keywords: Like(`%${filter}%`) } : {};

    const maxAttempts = 5;
    let attempt = 0;
    let images: ImageItem[] = [];

    while (attempt < maxAttempts) {
      images = await this.imagesRepository.find({
        where,
        take: perPage,
        skip: (page - 1) * perPage,
        order: { id: 'ASC' },
      });

      if (images.length > 0) {
        break;
      }

      await this.generateAndSaveImages(perPage * 2, filter);

      attempt += 1;
    }

    return images;
  }

  async findById(id: number): Promise<ImageItem | null> {
    return this.imagesRepository.findOneBy({ id });
  }

  async create(data: Partial<ImageItem>): Promise<ImageItem> {
    const image = this.imagesRepository.create(data);
    return this.imagesRepository.save(image);
  }

  private async generateAndSaveImages(count: number, filter?: string) {
    const imagesToSave: Partial<ImageItem>[] = Array.from({
      length: count,
    }).map((_, i) => ({
      url: `https://placehold.co/${200 + (i % 5) * 50}x${150 + (i % 3) * 40}`,
      keywords: this.generateKeywords(filter),
    }));

    await this.imagesRepository.save(imagesToSave);
  }

  private generateKeywords(filter?: string): string[] {
    const count = Math.floor(Math.random() * 7) + 1;
    const keywordsSet = new Set<string>();

    while (keywordsSet.size < count) {
      const keyword = `keyword_${getRandomLetter()}`;
      keywordsSet.add(keyword);
    }

    if (filter) {
      keywordsSet.add(filter);
    }

    return Array.from(keywordsSet);
  }
}
