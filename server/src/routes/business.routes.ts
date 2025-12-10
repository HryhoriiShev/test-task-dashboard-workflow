import { Router } from "express";
import { BusinessController } from "../controllers/business.controller";

const router: Router = Router();

router.post("/", BusinessController.create);
router.get("/", BusinessController.list);

export default router;
