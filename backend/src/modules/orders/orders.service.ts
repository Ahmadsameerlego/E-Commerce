import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // Execute stock verification and updates in an isolated transaction
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const verifiedItems = [];

      // Validate products and deduct stock
      for (const item of dto.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }
        
        if (!product.isActive) {
          throw new BadRequestException(`Product '${product.title}' is not active`);
        }
        
        if (product.stock < item.quantity) {
          throw new ConflictException(`Insufficient stock for product: '${product.title}'. Available: ${product.stock}`);
        }

        // Atomically Deduct stock safely inside the transaction block
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });

        // Snapshot Principle: Capture state so future product price/title changes don't alter history
        verifiedItems.push({
          productId: product.id,
          productTitleSnapshot: product.title,
          priceSnapshot: product.price,
          quantity: item.quantity
        });
        
        totalAmount += product.price * item.quantity;
      }

      // Generate the Final Order Entity
      const order = await tx.order.create({
        data: {
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          totalAmount,
          status: OrderStatus.PENDING,
          items: {
            create: verifiedItems
          }
        },
        include: { items: true }
      });

      return order;
    });
  }

  async findAll(statusFilter?: OrderStatus) {
    const where = statusFilter ? { status: statusFilter } : {};
    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    
    // Status finite state machine protections
    const validNextStates: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      CONFIRMED: [OrderStatus.SHIPPED],
      SHIPPED: [OrderStatus.DELIVERED],
      DELIVERED: [],
      CANCELLED: []
    };
    
    const allowed = validNextStates[order.status].includes(dto.status);
    
    if (!allowed) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${dto.status}.`
      );
    }
    
    // Update successfully if rules allow
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true }
    });
  }
}
