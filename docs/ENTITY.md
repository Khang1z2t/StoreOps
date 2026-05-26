# StoreOps — Entity Diagram

> Schema: `storeops` · PostgreSQL via Supabase

---

## Entity Relationship Diagram

```
┌─────────────────────────────┐
│           users             │
├─────────────────────────────┤
│ id          BIGSERIAL PK    │
│ email       VARCHAR(255) UQ │
│ password    VARCHAR(255)    │
│ full_name   VARCHAR(255)    │
│ role        ENUM            │  ← ADMIN | STAFF
│ active      BOOLEAN         │
│ created_at  TIMESTAMP       │
│ updated_at  TIMESTAMP       │
└──────────────┬──────────────┘
               │ 1
               │ created_by
               │ N
┌──────────────▼──────────────┐        ┌────────────────────────────┐
│           orders            │        │         categories         │
├─────────────────────────────┤        ├────────────────────────────┤
│ id          BIGSERIAL PK    │        │ id       BIGSERIAL PK      │
│ user_id     BIGINT FK       │        │ name     VARCHAR(100) UQ   │
│ status      ENUM            │        │ slug     VARCHAR(100) UQ   │
│ note        TEXT            │        └──────────────┬─────────────┘
│ total_price DECIMAL(12,2)   │                       │ 1
│ created_at  TIMESTAMP       │                       │
│ updated_at  TIMESTAMP       │                       │ N
└──────────────┬──────────────┘        ┌──────────────▼─────────────┐
               │ 1                     │          products           │
               │                       ├────────────────────────────┤
               │ N                     │ id          BIGSERIAL PK   │
┌──────────────▼──────────────┐        │ category_id BIGINT FK      │
│         order_items         │        │ name        VARCHAR(255)   │
├─────────────────────────────┤        │ description TEXT           │
│ id          BIGSERIAL PK    │        │ price       DECIMAL(12,2)  │
│ order_id    BIGINT FK  ─────┤        │ quantity    INT            │
│ product_id  BIGINT FK  ──── ┼───────▶│ unit        VARCHAR(50)    │
│ quantity    INT             │        │ image_url   VARCHAR(500)   │
│ unit_price  DECIMAL(12,2)   │        │ active      BOOLEAN        │
│ subtotal    DECIMAL(12,2)   │        │ created_at  TIMESTAMP      │
└─────────────────────────────┘        │ updated_at  TIMESTAMP      │
                                       └────────────────────────────┘
```

---

## Chi tiết từng Entity

### users
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGSERIAL | PK | Auto increment |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Dùng để login |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed |
| full_name | VARCHAR(255) | NOT NULL | |
| role | VARCHAR(20) | NOT NULL | `ADMIN` hoặc `STAFF` |
| active | BOOLEAN | DEFAULT true | Soft disable user |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

### categories
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Beverages, Snacks... |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | beverages, snacks... |

> Seed data: `Beverages`, `Snacks`, `Frozen`, `Personal Care`, `Others`

### products
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| category_id | BIGINT | FK → categories.id | |
| name | VARCHAR(255) | NOT NULL | |
| description | TEXT | | |
| price | DECIMAL(12,2) | NOT NULL | Giá nhập |
| quantity | INT | NOT NULL, DEFAULT 0 | Số lượng tồn kho |
| unit | VARCHAR(50) | | cái, thùng, hộp... |
| image_url | VARCHAR(500) | | |
| active | BOOLEAN | DEFAULT true | Soft delete |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

### orders
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| user_id | BIGINT | FK → users.id | Staff tạo đơn |
| status | VARCHAR(20) | NOT NULL | Xem bên dưới |
| note | TEXT | | Ghi chú của Staff |
| total_price | DECIMAL(12,2) | NOT NULL | Tổng tiền |
| created_at | TIMESTAMP | DEFAULT now() | |
| updated_at | TIMESTAMP | DEFAULT now() | |

**Order Status Enum:**
```
PENDING    → Mới tạo, chờ Admin duyệt
APPROVED   → Admin duyệt, trừ stock
DELIVERED  → Đã giao hàng
CANCELLED  → Bị huỷ (Staff tự huỷ khi PENDING)
```

### order_items
| Column | Type | Constraint | Note |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| order_id | BIGINT | FK → orders.id | |
| product_id | BIGINT | FK → products.id | |
| quantity | INT | NOT NULL | Số lượng đặt |
| unit_price | DECIMAL(12,2) | NOT NULL | Giá tại thời điểm đặt |
| subtotal | DECIMAL(12,2) | NOT NULL | quantity × unit_price |

> `unit_price` lưu snapshot giá lúc đặt hàng — tránh bị ảnh hưởng khi giá sản phẩm thay đổi sau.

---

## Relationships

```
users       1 ──── N  orders
orders      1 ──── N  order_items
products    1 ──── N  order_items
categories  1 ──── N  products
```

---

## Java Enum (tham khảo)

```java
// Role
public enum Role {
    ADMIN, STAFF
}

// OrderStatus
public enum OrderStatus {
    PENDING, APPROVED, DELIVERED, CANCELLED
}
```
