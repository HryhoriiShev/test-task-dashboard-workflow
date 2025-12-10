import { api } from "@/lib/axios";
import { Report, CreateReportDto } from "@/types/report";
import { PaginatedResponse } from "@/types/api";

export const reportService = {
  create: async (data: CreateReportDto): Promise<Report> => {
    const formData = new FormData();
    formData.append("sales", data.sales.toString());
    formData.append("expenses", data.expenses.toString());
    formData.append("customerCount", data.customerCount.toString());
    formData.append("businessId", data.businessId.toString());
    formData.append("image", data.image);

    if (data.notes) {
      formData.append("notes", data.notes);
    }

    if (data.video) {
      formData.append("video", data.video);
    }

    const response = await api.post<Report>("/api/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  list: async (page = 1, limit = 10): Promise<PaginatedResponse<Report>> => {
    const response = await api.get<PaginatedResponse<Report>>("/api/reports", {
      params: { page, limit },
    });
    return response.data;
  },

  listByBusiness: async (
    businessId: number,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Report>> => {
    const response = await api.get<PaginatedResponse<Report>>(
      `/api/reports/business/${businessId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },
};
