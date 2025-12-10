import { api } from "@/lib/axios";
import { Business, CreateBusinessDto } from "@/types/business";
import { PaginatedResponse } from "@/types/api";

export const businessService = {
  create: async (data: CreateBusinessDto): Promise<Business> => {
    const response = await api.post<Business>("/api/businesses", data);
    return response.data;
  },

  list: async (page = 1, limit = 10): Promise<PaginatedResponse<Business>> => {
    const response = await api.get<PaginatedResponse<Business>>(
      "/api/businesses",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<Business> => {
    const response = await api.get<Business>(`/api/businesses/${id}`);
    return response.data;
  },
};
