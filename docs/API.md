# StoreOps Backend API Documentation

> Convenience Store Order Management System API
> Base URL: `https://your-service.koyeb.app` (or `http://localhost:8080` for local)

---

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Categories](#categories)
- [Orders](#orders)
- [Dashboard](#dashboard)
- [Error Handling](#error-handling)

---

## Authentication

### POST `/api/auth/login`
Login with username/email and password.

**Request:**
```json
{
  "identifier": "username or email",
  "password": "password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

**Headers for subsequent requests:**
```
Authorization: Bearer {accessToken}
```

---

### POST `/api/auth/register`
Create new user account.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Register successful",
  "data": null,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Request:**
```
Authorization: Bearer {refreshToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "new_jwt_token_here",
    "refreshToken": "same_refresh_token"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### POST `/api/auth/logout`
Logout (invalidate token).

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### GET `/api/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Get authenticated user successful",
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "USER"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

## Products

### GET `/api/products`
Get all products with pagination and search.

**Query Parameters:**
- `page` (int, default=0) — page number (0-indexed)
- `size` (int, default=20) — items per page
- `name` (string, optional) — search by product name

**Response (200):**
```json
{
  "success": true,
  "message": "Products fetched",
  "data": {
    "content": [
      {
        "id": "uuid",
        "name": "Coca Cola",
        "description": "Soft drink",
        "price": 15000,
        "quantity": 100,
        "active": true,
        "category": {
          "id": "uuid",
          "name": "Beverages"
        }
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### GET `/api/products/{id}`
Get product by ID.

**Response (200):**
```json
{
  "success": true,
  "message": "Product fetched",
  "data": {
    "id": "uuid",
    "name": "Coca Cola",
    "description": "Soft drink",
    "price": 15000,
    "quantity": 100,
    "active": true,
    "category": {
      "id": "uuid",
      "name": "Beverages"
    }
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### POST `/api/products`
Create new product (ADMIN only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Fanta Orange",
  "description": "Orange flavored soft drink",
  "price": 12000,
  "quantity": 200,
  "categoryId": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created",
  "data": {
    "id": "uuid",
    "name": "Fanta Orange",
    "description": "Orange flavored soft drink",
    "price": 12000,
    "quantity": 200,
    "active": true,
    "category": {
      "id": "uuid",
      "name": "Beverages"
    }
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### PUT `/api/products/{id}`
Update product (ADMIN only).

**Request:**
```json
{
  "name": "Fanta Orange",
  "description": "Updated description",
  "price": 13000,
  "quantity": 150,
  "categoryId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated",
  "data": { ... }
}
```

---

### DELETE `/api/products/{id}`
Delete product (ADMIN only).

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted",
  "data": null,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

## Categories

### GET `/api/categories`
Get all categories.

**Response (200):**
```json
{
  "success": true,
  "message": "Categories fetched",
  "data": [
    {
      "id": "uuid",
      "name": "Beverages"
    },
    {
      "id": "uuid",
      "name": "Snacks"
    }
  ],
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### GET `/api/categories/{id}`
Get category by ID.

**Response (200):**
```json
{
  "success": true,
  "message": "Category fetched",
  "data": {
    "id": "uuid",
    "name": "Beverages"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### POST `/api/categories`
Create new category (ADMIN only).

**Request:**
```json
{
  "name": "Frozen Foods"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created",
  "data": {
    "id": "uuid",
    "name": "Frozen Foods"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### PUT `/api/categories/{id}`
Update category (ADMIN only).

**Request:**
```json
{
  "name": "Frozen Items"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated",
  "data": { ... }
}
```

---

### DELETE `/api/categories/{id}`
Delete category (ADMIN only).

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted",
  "data": null,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

## Orders

### GET `/api/orders`
Get all orders (ADMIN only).

**Query Parameters:**
- `page` (int, default=0)
- `size` (int, default=20)
- `status` (string, optional) — filter by status: PENDING, APPROVED, DELIVERED, CANCELLED

**Response (200):**
```json
{
  "success": true,
  "message": "Orders fetched",
  "data": {
    "content": [
      {
        "id": "uuid",
        "userId": "uuid",
        "status": "PENDING",
        "totalPrice": 50000,
        "note": "Please deliver to reception",
        "createdAt": "2026-05-28T10:00:00Z",
        "items": [
          {
            "productId": "uuid",
            "productName": "Coca Cola",
            "quantity": 5,
            "price": 10000,
            "subtotal": 50000
          }
        ]
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### GET `/api/orders/my`
Get current user's orders.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders fetched",
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 10,
    "totalPages": 1
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### GET `/api/orders/{id}`
Get order by ID (ADMIN only).

**Response (200):**
```json
{
  "success": true,
  "message": "Order fetched",
  "data": { ... }
}
```

---

### POST `/api/orders`
Create new order.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 5
    },
    {
      "productId": "uuid",
      "quantity": 3
    }
  ],
  "note": "Please deliver to reception (max 2000 chars)"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "status": "PENDING",
    "totalPrice": 100000,
    "note": "Please deliver to reception",
    "createdAt": "2026-05-28T10:00:00Z",
    "items": [ ... ]
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### PUT `/api/orders/{id}/status`
Update order status (ADMIN only).

**Request:**
```json
{
  "status": "APPROVED"
}
```

**Valid status transitions:**
- `PENDING` → `APPROVED` (approve order, deduct stock)
- `PENDING` → `CANCELLED` (reject order)
- `APPROVED` → `DELIVERED` (complete order)

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": {
    "id": "uuid",
    "status": "APPROVED",
    "items": [ ... ]
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

### PATCH `/api/orders/{id}/cancel`
Cancel order (USER can cancel own PENDING orders).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled",
  "data": {
    "id": "uuid",
    "status": "CANCELLED"
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

## Dashboard

### GET `/api/dashboard/stats`
Get dashboard statistics (ADMIN only).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "totalOrders": 150,
    "pendingOrders": 20,
    "deliveredOrders": 120,
    "totalRevenue": 5000000,
    "lowStockProducts": 5
  },
  "timestamp": "2026-05-28T10:30:00Z"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

**Common Status Codes:**

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Environment Variables

```bash
DB_URL=jdbc:postgresql://host:5432/storeops
DB_USERNAME=postgres
DB_PASSWORD=password
DB_SCHEMA=storeops
JWT_SECRET=your-secret-key
PORT=8080
SWAGGER_ENABLED=true
```

---

## Testing with Swagger UI

Visit: `http://localhost:8080/swagger-ui.html` (or your deployed URL)

All endpoints are documented and testable directly from Swagger UI.

---

Generated: 2026-05-28
