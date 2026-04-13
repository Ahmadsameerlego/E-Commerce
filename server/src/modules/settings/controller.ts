import { Request, Response, NextFunction } from "express";
import { settingsService } from "./service";
import { z } from "zod";

const SettingsSchema = z.object({
  storeName: z.string().optional(),
  storeEmail: z.string().email("Invalid email address").optional(),
  currency: z.string().optional(),
  language: z.enum(["ar", "en"]).optional(),
});

export const settingsController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await settingsService.get();
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = SettingsSchema.parse(req.body);
      const settings = await settingsService.update(data);
      res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  },
};
