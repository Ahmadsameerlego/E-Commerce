import prisma from "@/lib/prisma";

export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
  status: string;
  categoryId?: string;
}

export const productService = {
  getAll: async () => {
    return await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (id: string) => {
    return await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  create: async (data: CreateProductData) => {
    return await prisma.product.create({
      data,
      include: { category: true },
    });
  },

  update: async (id: string, data: Partial<CreateProductData>) => {
    return await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  delete: async (id: string) => {
    return await prisma.product.delete({
      where: { id },
    });
  },
};
