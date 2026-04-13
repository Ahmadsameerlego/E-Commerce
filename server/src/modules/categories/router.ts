import { Router } from "express";
import { categoryController } from "./controller";

const router = Router();

router.get("/", categoryController.getAll);
router.post("/", categoryController.create);
router.put("/:id", categoryController.update);
router.delete("/:id", categoryController.delete);

export default router;
