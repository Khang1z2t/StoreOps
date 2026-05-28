export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  active: boolean;
  imageUrl?: string;
  category: Category;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type Paginated<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "USER";
};

export type LoginRequest = {
  identifier: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  fullName: string;
};

export type RegisterResponse = null;
