import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { S3File } from "../types/multer-s3";

const createReportSchema = z.object({
  sales: z.coerce.number().min(0),
  expenses: z.coerce.number().min(0),
  customerCount: z.coerce.number().int().min(0),
  notes: z.string().optional(),
  businessId: z.coerce.number().int(),
});

export const ReportController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files["image"]?.[0] as S3File | undefined;
      const videoFile = files["video"]?.[0] as S3File | undefined;

      if (!imageFile) {
        res.status(400).json({ error: "Image is required" });
        return;
      }

      const data = createReportSchema.parse(req.body);

      const newReport = await prisma.report.create({
        data: {
          sales: data.sales,
          expenses: data.expenses,
          customerCount: data.customerCount,
          businessId: data.businessId,
          notes: data.notes ?? null,
          imageUrl: imageFile.location,
          videoUrl: videoFile ? videoFile.location : null,
        },
      });

      res.status(201).json(newReport);
    } catch (error: unknown) {
      console.error("Failed to create report:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      res.status(500).json({ error: "Failed to submit report" });
    }
  },

  async listByBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { businessId } = req.params;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const id = Number(businessId);

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where: { businessId: id },
          skip: skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.report.count({
          where: { businessId: id },
        }),
      ]);

      res.json({
        data: reports,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: unknown) {
      console.error("Failed to fetch reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  },
};
