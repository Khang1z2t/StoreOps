import axios from "axios";
import type {
  ApiResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  Paginated,
  Product,
  RegisterRequest,
  RegisterResponse,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
});

export async function getProducts(params?: { page?: number; size?: number; name?: string }) {
  const response = await api.get<ApiResponse<Paginated<Product>>>("/products", { params });
  return response.data.data.content;
}

export async function login(payload: LoginRequest) {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function getMe(accessToken: string) {
  const response = await api.get<ApiResponse<AuthUser>>("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
}

export async function register(payload: RegisterRequest) {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", payload);
  return response.data;
}

export default api;
