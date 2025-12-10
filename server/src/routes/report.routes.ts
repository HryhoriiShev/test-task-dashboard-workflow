import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import upload from "../middlewares/upload";
import { uploadLimiter } from "../middlewares/rate-limit";

const router: Router = Router();

router.post(
  "/",
  uploadLimiter,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  ReportController.create
);

router.get("/", ReportController.list);
router.get("/business/:businessId", ReportController.listByBusiness);

export default router;
