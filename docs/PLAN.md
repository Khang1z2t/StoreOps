# StoreOps — Project Plan

> Interview Project · 7-Eleven Vietnam  
> Convenience Store Order Management System

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 4.x, Spring Security 6, Spring Data JPA |
| Auth | JJWT 0.12.x (JWT + Refresh Token) |
| Database | PostgreSQL via Supabase · schema: `storeops` |
| API Docs | Springdoc OpenAPI 3.x + Swagger UI |
| Frontend | Next.js 14 App Router, TypeScript |
| UI | shadcn/ui + Radix UI, Tailwind CSS |
| State | TanStack Query (server) + Zustand (client) |
| Form | React Hook Form + Zod |
| DevOps | Docker Compose (local), GitHub Actions CI |
| Deploy | Vercel (FE) · Railway / Render (BE) |

---

## Roles & Permissions

### 🛡️ Admin — Store Manager
- Quản lý sản phẩm: thêm, sửa, xóa
- Xem danh sách & chi tiết sản phẩm
- Xem **toàn bộ** đơn hàng
- Cập nhật trạng thái đơn hàng
- Dashboard thống kê tổng quan

### 👤 Staff — Store Employee
- Xem danh sách sản phẩm
- Tìm kiếm & lọc theo category
- Thêm sản phẩm vào giỏ hàng
- Tạo & gửi đơn nhập hàng
- Xem **lịch sử đơn của mình**

---

## API Endpoints

### Auth (PUBLIC)
| Method | Path | Note |
|---|---|---|
| POST | `/api/auth/login` | Trả về access + refresh token |
| POST | `/api/auth/refresh` | Làm mới access token |
| POST | `/api/auth/logout` | Invalidate token |

### Products
| Method | Path | Role |
|---|---|---|
| GET | `/api/products` | ADMIN, STAFF |
| GET | `/api/products/{id}` | ADMIN, STAFF |
| POST | `/api/products` | ADMIN |
| PUT | `/api/products/{id}` | ADMIN |
| DELETE | `/api/products/{id}` | ADMIN |

### Orders
| Method | Path | Role |
|---|---|---|
| GET | `/api/orders` | ADMIN (tất cả đơn) |
| GET | `/api/orders/{id}` | ADMIN |
| GET | `/api/orders/my` | STAFF (đơn của mình) |
| POST | `/api/orders` | ADMIN, STAFF |
| PUT | `/api/orders/{id}/status` | ADMIN |

---

## Milestones

### M1 — Foundation & Auth · Tuần 1
- **[BE]** Setup Spring Boot, cấu hình Security + JWT filter
- **[DB]** Tạo schema `storeops` trên Supabase
- **[DB]** Entity: `users`, `roles`
- **[BE]** AuthController: login, refresh token, logout
- **[BE]** JwtFilter + JwtUtil + UserDetailsServiceImpl
- **[FE]** Setup Next.js 14, Tailwind, shadcn/ui, TanStack Query
- **[FE]** Trang login + Zustand auth store + route guard
- **[OPS]** Docker Compose (BE + PostgreSQL local), GitHub repo

### M2 — Product Module · Tuần 2
- **[DB]** Entity: `categories`, `products`
- **[BE]** ProductController: CRUD + phân quyền theo role
- **[BE]** Validation, GlobalExceptionHandler, ApiResponse wrapper
- **[BE]** Swagger UI + Springdoc OpenAPI config
- **[FE]** Admin: product table, modal thêm/sửa, confirm xóa
- **[FE]** Staff: product grid, search, filter theo category

### M3 — Order Module · Tuần 3
- **[DB]** Entity: `orders`, `order_items`
- **[BE]** OrderController: tạo đơn, validate stock, tính total
- **[BE]** Order status flow: `PENDING → APPROVED → DELIVERED`
- **[BE]** Trừ stock khi order APPROVED
- **[FE]** Staff: Cart drawer, chọn sản phẩm, submit order
- **[FE]** Staff: Xem lịch sử đơn `/api/orders/my`
- **[FE]** Admin: order list, filter theo status, xem chi tiết
- **[FE]** OrderStatusBadge + update status action

### M4 — Polish & Deploy · Tuần 4
- **[FE]** Pagination, search, sort cho product & order list
- **[FE]** Admin dashboard: cards thống kê, low stock warning (Recharts)
- **[FE]** Loading state, empty state, error handling toàn bộ FE
- **[OPS]** Deploy BE lên Railway/Render, FE lên Vercel
- **[OPS]** GitHub Actions CI: build + test khi push/PR
- **[OPS]** README: setup guide, screenshots, Postman collection

---

## Order Status Flow

```
PENDING ──→ APPROVED ──→ DELIVERED
   │
   └──→ CANCELLED  (Staff tự huỷ khi còn PENDING)
```

---

## GitHub Strategy

```
StoreOps/          ← monorepo
├── backend/
├── frontend/
├── docs/
├── docker-compose.yml
└── README.md
```

| Branch | Mục đích |
|---|---|
| `main` | Production-ready, protected — chỉ merge qua PR |
| `develop` | Integration branch — merge feature vào đây trước |
| `feature/auth-jwt` | Mỗi tính năng 1 nhánh |
| `fix/order-status` | Hotfix, merge thẳng vào develop |

---

## Bonus Features (nếu còn thời gian)

| Feature | Mô tả |
|---|---|
| Admin Dashboard | Cards: tổng đơn hôm nay, sản phẩm sắp hết, doanh số tuần |
| Low Stock Badge | Badge cảnh báo khi `quantity < threshold` |
| Product Categories | Beverages, Snacks, Frozen, Personal Care |
| Postman Collection | Export sẵn để demo |
