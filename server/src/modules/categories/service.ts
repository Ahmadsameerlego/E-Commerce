import prisma from "@/lib/prisma";

export const categoryService = {
  getAll: async () => {
    return await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  create: async (name: string) => {
    return await prisma.category.create({
      data: { name },
    });
  },

  update: async (id: string, name: string) => {
    return await prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  delete: async (id: string) => {
    return await prisma.category.delete({
      where: { id },
    });
  },
};
