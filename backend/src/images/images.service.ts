import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ImageItem } from './entities/image.entity';
import { ConfigService } from '@nestjs/config';

function getRandomLetter() {
  const charCode = 97 + Math.floor(Math.random() * 26); // a=97 → z=122
  return String.fromCharCode(charCode);
}

@Injectable()
export class ImagesService {
  private readonly maxKeywordsCount: number;

  constructor(
    @InjectRepository(ImageItem)
    private readonly imagesRepository: Repository<ImageItem>,
    private readonly configService: ConfigService,
  ) {
    this.maxKeywordsCount =
      this.configService.get<number>('MAX_KEYWORDS_COUNT', 7) || 7;
  }

  async findAll(
    page: number,
    perPage: number,
    filters?: string[],
  ): Promise<ImageItem[]> {
    const query = this.imagesRepository.createQueryBuilder('image');

    if (filters && filters.length) {
      filters.forEach((filter, index) => {
        query.andWhere(`image.keywords LIKE :filter${index}`, {
          [`filter${index}`]: `%${filter}%`,
        });
      });
    }

    const maxAttempts = 5;
    let attempt = 0;
    let images: ImageItem[] = [];

    while (attempt < maxAttempts) {
      images = await query
        .take(perPage)
        .skip((page - 1) * perPage)
        .orderBy('image.id', 'ASC')
        .getMany();

      if (images.length > 0) {
        break;
      }

      await this.generateAndSaveImages(perPage * 2, filters);

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

  private async generateAndSaveImages(count: number, filters?: string[]) {
    const imagesToSave: Partial<ImageItem>[] = Array.from({
      length: count,
    }).map((_, i) => ({
      url: `https://placehold.co/${200 + (i % 5) * 50}x${150 + (i % 3) * 40}`,
      keywords: this.generateKeywords(filters),
    }));

    await this.imagesRepository.save(imagesToSave);
  }

  private generateKeywords(filters?: string[]): string[] {
    const count = Math.floor(Math.random() * this.maxKeywordsCount) + 1;
    const keywordsSet = new Set<string>();

    while (keywordsSet.size < count) {
      const keyword = `keyword_${getRandomLetter()}`;
      keywordsSet.add(keyword);
    }

    if (filters) {
      filters.forEach((filter) => {
        if (!keywordsSet.has(filter)) {
          keywordsSet.add(filter);
        }
      });
    }

    return Array.from(keywordsSet);
  }
}
