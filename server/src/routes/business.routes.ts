import { Router } from "express";
import { BusinessController } from "../controllers/business.controller";
import { createLimiter } from "../middlewares/rate-limit";

const router: Router = Router();

router.post("/", createLimiter, BusinessController.create);
router.get("/", BusinessController.list);

export default router;
