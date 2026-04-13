import { Router } from "express";
import { settingsController } from "./controller";

const router = Router();

router.get("/", settingsController.get);
router.put("/", settingsController.update);

export default router;
