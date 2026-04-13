import prisma from "@/lib/prisma";

export const orderService = {
  getAll: async () => {
    return await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (id: string) => {
    return await prisma.order.findUnique({
      where: { id },
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await prisma.order.update({
      where: { id },
      data: { status },
    });
  },
};
