export interface Property {
  id: string;
  name: string;
  owner: string;
  location: string;
  description: string;
  imageUrl: string;
  price: bigint;
  status: bigint;
  isVerified: boolean;
  reviewIds?: string[];
  likeCount?: number;
  currentTenant: string | number;
  rentalEndDate: bigint;
  reviewCount?: number;
}

export interface Review {
  id: string;
  propertyId: string;
  reviewer: string;
  content: string;
  rating: number;
}

