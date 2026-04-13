import { Router } from "express";
import { orderController } from "./controller";

const router = Router();

router.get("/", orderController.getAll);
router.put("/:id/status", orderController.updateStatus);

export default router;
