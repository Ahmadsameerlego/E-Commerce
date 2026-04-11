import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { EngineConfigService } from '../../config/config.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: EngineConfigService
  ) {}

  async create(dto: CreateProductDto) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        currency: dto.currency || this.config.currency,
        images: dto.images || [],
        stock: dto.stock ?? 0,
        isActive: dto.isActive ?? true,
        category: { connect: { id: dto.categoryId } }
      }
    });
  }

  async findAll(filters: { categoryId?: string; isActive?: boolean; search?: string }) {
    const where: any = {};
    
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters.search) {
      where.title = {
        contains: filters.search,
        mode: 'insensitive'
      };
    }

    return this.prisma.product.findMany({
      where,
      include: { category: true }
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // validates existence
    
    return this.prisma.product.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id); // validates existence
    
    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
