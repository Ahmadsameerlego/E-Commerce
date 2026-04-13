import prisma from "@/lib/prisma";

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
}

export const userService = {
  getAll: async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  create: async (data: CreateUserData) => {
    return await prisma.user.create({
      data,
    });
  },

  update: async (id: string, data: Partial<CreateUserData>) => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return await prisma.user.delete({
      where: { id },
    });
  },
};
