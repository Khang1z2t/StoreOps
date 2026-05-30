import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import type {
  ApiResponse,
  AuthUser,
  LoginRequest,
  LoginResponse,
  Paginated,
  Product,
  Category,
  ProductPayload,
  RegisterRequest,
  RegisterResponse,
  CreateOrderRequest,
  Order,
} from "@/types";

const API_MODE_KEY = "storeops-api-mode";
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const localRawBaseUrl = "http://localhost:8080";

function withApiSuffix(url: string) {
  return url.endsWith("/api") ? url : `${url}/api`;
}

function getStoredApiMode(): "prod" | "local" {
  if (typeof window === "undefined") return "prod";
  return window.localStorage.getItem(API_MODE_KEY) === "local" ? "local" : "prod";
}

function resolveBaseURL() {
  const mode = getStoredApiMode();
  return withApiSuffix(mode === "local" ? localRawBaseUrl : rawBaseUrl);
}

const api = axios.create({
  baseURL: resolveBaseURL(),
});

const refreshApi = axios.create({
  baseURL: resolveBaseURL(),
});

function syncApiClientsBaseURL() {
  const baseURL = resolveBaseURL();
  api.defaults.baseURL = baseURL;
  refreshApi.defaults.baseURL = baseURL;
}

export function getApiMode() {
  return getStoredApiMode();
}

export function toggleApiMode() {
  if (typeof window === "undefined") return "prod" as const;
  const nextMode = getStoredApiMode() === "local" ? "prod" : "local";
  window.localStorage.setItem(API_MODE_KEY, nextMode);
  syncApiClientsBaseURL();
  return nextMode;
}

type RetryableConfig = {
  _retry?: boolean;
  headers?: Record<string, string>;
};

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();
    if (!refreshToken) throw new Error("Missing refresh token");

    try {
      const response = await refreshApi.post<ApiResponse<LoginResponse>>(
        "/auth/refresh",
        undefined,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const { accessToken, refreshToken: nextRefreshToken } = response.data.data;
      setTokens(accessToken, nextRefreshToken ?? refreshToken);
      return accessToken;
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) return config;

  config.headers = config.headers ?? {};
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableConfig;

    const status = error.response?.status;

    if (
      (status !== 401 && status !== 403) ||
      !originalRequest ||
      originalRequest._retry ||
      (typeof error.config?.url === "string" && error.config.url.includes("/auth/refresh"))
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextAccessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export async function getProducts(params?: { page?: number; size?: number; name?: string }) {
  const response = await api.get<ApiResponse<Paginated<Product>>>("/products", { params });
  return response.data.data.content;
}

export async function getProductsPaginated(params?: { page?: number; size?: number; name?: string }) {
  const response = await api.get<ApiResponse<Paginated<Product>>>("/products", { params });
  return response.data.data;
}

export async function getCategories() {
  const response = await api.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
}

export async function createProduct(payload: ProductPayload) {
  const response = await api.post<ApiResponse<Product>>("/products", payload);
  return response.data.data;
}

export async function updateProduct(productId: string, payload: ProductPayload) {
  const response = await api.put<ApiResponse<Product>>(`/products/${productId}`, payload);
  return response.data.data;
}

export async function deleteProduct(productId: string) {
  const response = await api.delete<ApiResponse<null>>(`/products/${productId}`);
  return response.data;
}

export async function login(payload: LoginRequest) {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", payload);
  return response.data.data;
}

export async function getMe() {
  const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
  return response.data.data;
}

export async function register(payload: RegisterRequest) {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", payload);
  return response.data;
}

export async function createOrder(payload: CreateOrderRequest, accessToken: string) {
  const response = await api.post<ApiResponse<Order>>("/orders", payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
}

export async function getMyOrders(accessToken: string, params?: { page?: number; size?: number }) {
  const response = await api.get<ApiResponse<Paginated<Order>>>("/orders/my", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data.content;
}

export async function getOrders(accessToken: string, params?: { page?: number; size?: number; status?: Order["status"] }) {
  const response = await api.get<ApiResponse<Paginated<Order>>>("/orders", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data.content;
}

export async function updateOrderStatus(orderId: string, status: "APPROVED" | "DELIVERED" | "CANCELLED") {
  const response = await api.put<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
  return response.data.data;
}

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
};

export async function getDashboardStats(accessToken: string) {
  const response = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
}

export default api;
