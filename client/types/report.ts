import { Business } from "./business";

export interface Report {
  id: number;
  sales: string;
  expenses: string;
  customerCount: number;
  notes: string | null;
  imageUrl: string;
  videoUrl: string | null;
  businessId: number;
  business?: Business;
  createdAt: string;
}

export interface CreateReportDto {
  sales: number;
  expenses: number;
  customerCount: number;
  notes?: string;
  businessId: number;
  image: File;
  video?: File;
}
