export interface Business {
  id: number;
  name: string;
  ownerName: string;
  ownerPhone: string;
  category: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessDto {
  name: string;
  ownerName: string;
  ownerPhone: string;
  category: string;
  city: string;
}
