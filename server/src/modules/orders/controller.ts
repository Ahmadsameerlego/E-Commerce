import { Request, Response, NextFunction } from "express";
import { orderService } from "./service";
import { z } from "zod";

const OrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export const orderController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await orderService.getAll();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = OrderStatusSchema.parse(req.body);
      const order = await orderService.updateStatus(id, data.status);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
};
