import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, OrderStatus, Prisma } from '@prisma/client';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  // --- Products ---
  @Get('products')
  getProducts(@Query('categoryId') categoryId?: string, @Query('search') search?: string) {
    // Admin needs all products, so isActive is undefined to prevent inactive filters
    return this.productsService.findAll({ categoryId, search });
  }

  @Post('products')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // --- Categories ---
  @Get('categories')
  getCategories() {
    return this.categoriesService.findAll(true); // includeInactive = true
  }

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  // --- Orders ---
  @Get('orders')
  getOrders(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }

  // --- Users ---
  @Get('users')
  getUsers() {
    return this.usersService.findAll();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.usersService.update(id, data);
  }
}
