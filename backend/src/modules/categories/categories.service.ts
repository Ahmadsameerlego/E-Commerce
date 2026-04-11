import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(text: string): string {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-');    // Replace multiple - with single -
  }

  async create(dto: CreateCategoryDto) {
    const existingName = await this.prisma.category.findFirst({
        where: { name: dto.name }
    });

    if (existingName) {
        throw new ConflictException('Category with this name already exists');
    }

    const slug = dto.slug || this.generateSlug(dto.name);
    
    // Validate uniqueness of the slug 
    const existingSlug = await this.prisma.category.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new ConflictException(`Category slug '${slug}' already exists`);
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        isActive: dto.isActive ?? true
      }
    });
  }

  findAll(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.prisma.category.findMany({ where });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    
    let updatedSlug = category.slug;
    
    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
      if (existing) {
        throw new ConflictException('Category slug already exists');
      }
      updatedSlug = dto.slug;
    } else if (dto.name && dto.name !== category.name && !dto.slug) {
       // Auto-gen new slug if name changed but explicit slug wasn't specified
       updatedSlug = this.generateSlug(dto.name);
       const existing = await this.prisma.category.findUnique({ where: { slug: updatedSlug } });
       if (existing) {
         throw new ConflictException('Generated slug already exists, please provide a custom one');
       }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: updatedSlug,
        description: dto.description,
        isActive: dto.isActive
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check exists
    // Soft delete per requirement
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
