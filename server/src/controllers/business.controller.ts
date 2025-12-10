import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const createBusinessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(10, "Phone number must be valid"),
  category: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
});

export const BusinessController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createBusinessSchema.parse(req.body);

      const newBusiness = await prisma.business.create({
        data: data,
      });

      res.status(201).json(newBusiness);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      console.error("Failed to create business:", error);
      res.status(500).json({ error: "Failed to create business" });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [businesses, total] = await Promise.all([
        prisma.business.findMany({
          skip: skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.business.count(),
      ]);

      res.json({
        data: businesses,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error: unknown) {
      console.error("Failed to fetch businesses:", error);
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  },
};
