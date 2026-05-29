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
  unit: string;
  active: boolean;
  imageUrl?: string;
  category: Category;
};

export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  active: boolean;
  imageUrl?: string;
  categoryId: string;
};

export type ProductFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  quantity: string;
  unit: string;
  categoryId: string;
  active: boolean;
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

export type OrderItemRequest = {
  productId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  items: OrderItemRequest[];
  note?: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Order = {
  id: string;
  userId: string;
  userFullName: string;
  status: "PENDING" | "APPROVED" | "DELIVERED" | "CANCELLED";
  totalPrice: number;
  note: string;
  createdAt: string;
  items: OrderItem[];
};
