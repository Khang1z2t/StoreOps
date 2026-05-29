# StoreOps — Convenience Store Order Management System

> Interview Project · 7-Eleven Vietnam  
> Full-stack order management system for convenience stores with admin dashboard and employee order tracking.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributors](#contributors)

---

## 🎯 Overview

**StoreOps** is a comprehensive order management system designed for convenience store operations. It enables:

- **Admins** to manage products, categories, and view all orders + statistics
- **Employees** to create orders, track their own orders, and cancel pending orders
- **JWT-based authentication** with role-based access control
- **Real-time order status tracking** (PENDING → APPROVED → DELIVERED)
- **Stock management** with automatic deduction on order approval

---

## 🛠️ Tech Stack

### Backend

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Spring Boot 4.x                       |
| Security  | Spring Security 6 + JWT (JJWT 0.12.x) |
| Database  | PostgreSQL via Supabase               |
| Migration | Flyway                                |
| API Docs  | Springdoc OpenAPI 3.x + Swagger UI    |
| Build     | Maven 3.9, Java 21                    |
| Container | Docker (distroless Java 21)           |
| CI/CD     | GitHub Actions                        |

### Frontend

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 14 (App Router)                    |
| Language      | TypeScript                                 |
| Styling       | Tailwind CSS                               |
| UI Components | shadcn/ui + Radix UI                       |
| State         | Zustand (client) + TanStack Query (server) |
| Forms         | React Hook Form + Zod                      |
| Deploy        | Vercel                                     |

### DevOps

| Component       | Technology        |
| --------------- | ----------------- |
| Local Dev       | Docker Compose    |
| Backend Deploy  | Koyeb / Render    |
| Frontend Deploy | Vercel            |
| CI/CD           | GitHub Actions    |
| VCS             | GitHub (monorepo) |

---

## 📁 Project Structure

```
StoreOps/
├── backend/
│   ├── src/main/java/com/yunok/storeops/
│   │   ├── config/           # Spring Security, CORS, JPA config
│   │   ├── controller/        # REST endpoints
│   │   ├── service/           # Business logic (interface + impl)
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── security/          # JWT filter, JWT utilities
│   │   ├── dto/               # Data transfer objects
│   │   ├── exception/         # Exception handlers
│   │   └── constants/         # API paths constants
│   ├── src/main/resources/
│   │   ├── application.yml    # Spring Boot config
│   │   └── db/migration/      # Flyway migrations
│   ├── Dockerfile             # Multi-stage build (distroless)
│   ├── .dockerignore          # Docker build context
│   ├── pom.xml                # Maven dependencies
│   └── mvnw                   # Maven wrapper
│
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js app router
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client
│   │   ├── stores/            # Zustand stores
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── next.config.js
│
├── docs/
│   ├── API.md                 # API endpoints documentation
│   ├── PLAN.md                # Project plan & milestones
│   └── ENTITY.md              # Database schema docs
│
├── .github/
│   └── workflows/
│       └── backend-deploy.yml # GitHub Actions CI/CD
│
├── docker-compose.yml         # Local dev environment
└── README.md                  # This file
```

---

## 🚀 Backend Setup

### Prerequisites

- Java 21 or higher
- Maven 3.9+ (or use `mvnw` wrapper)
- PostgreSQL 14+ (via Supabase or local)
- Docker (optional, for containerized dev)

### Local Development

#### 1. Clone & Install Dependencies

```bash
cd StoreOps/backend
./mvnw clean install
```

#### 2. Configure Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database
DB_URL=jdbc:postgresql://localhost:5432/storeops
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_SCHEMA=storeops

# JWT
JWT_SECRET=your-secret-key-min-32-chars

# Server
PORT=8080

# Optional
SWAGGER_ENABLED=true
```

Or copy from template:

```bash
cp backend/.env.example backend/.env
```

#### 3. Run Locally

**Using Maven:**

```bash
cd backend
./mvnw spring-boot:run
```

**Using Docker:**

```bash
# Build image
docker build -t storeops-backend ./backend

# Run container
docker run --rm -p 8080:8080 \
  --env-file backend/.env \
  storeops-backend
```

#### 4. Access Swagger UI

Open browser: `http://localhost:8080/swagger-ui.html`

---

### Database Schema

**Tables:**

- `users` — User accounts with roles (ADMIN, USER)
- `categories` — Product categories (Beverages, Snacks, etc.)
- `products` — Products with stock and pricing
- `orders` — Order headers with status tracking
- `order_items` — Order line items with quantity/price

**Automatic setup:**

- Flyway handles migrations automatically on startup
- JPA validates schema with `ddl-auto: validate`
- Database seed data can be added via `@PostConstruct` methods

---

### Key Features

✅ **Authentication & Authorization**

- JWT token-based auth (access + refresh tokens)
- Role-based access control (ADMIN, USER)
- Secure password hashing

✅ **Product Management**

- CRUD operations (Admin only)
- Search and pagination support
- Category classification

✅ **Order Lifecycle**

- Create orders with multiple items
- Stock validation and automatic deduction
- Order status tracking: PENDING → APPROVED → DELIVERED
- User can cancel PENDING orders
- Admin can approve/reject orders

✅ **Dashboard Analytics** (Admin only)

- Total orders count
- Pending orders count
- Delivered orders count
- Total revenue (DELIVERED orders only)
- Low stock product alerts

✅ **API Documentation**

- Swagger UI for interactive testing
- OpenAPI 3.0 specification
- Full endpoint documentation in `/docs/API.md`

---

### Environment-Specific Configuration

**Local Development:**

```yaml
spring.jpa.hibernate.ddl-auto: validate
spring.datasource.hikari.maximum-pool-size: 3
swagger.enabled: true
```

**Production (Koyeb/Render):**

```
SWAGGER_ENABLED=true (or false for security)
DB_URL=<production-db-url>
JWT_SECRET=<strong-secret>
PORT=8080
```

---

## 🎨 Frontend Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

#### 1. Install dependencies

```bash
cd frontend
npm install
```

#### 2. Configure environment

Create `.env.local` in `frontend/`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> If backend is deployed, replace with your deployed API base URL.

#### 3. Run development server

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

#### 4. Build & lint

```bash
cd frontend
npm run lint
npm run build
```

### Frontend Features (Current)

✅ **Public area**
- Login/Register
- Product listing + search
- Cart drawer and order creation
- My orders page

✅ **Admin area (`/dashboard`)**
- Shared admin layout with protected routing
- Dashboard overview (stats + recent orders)
- Product management page:
  - create/edit product dialog with validation
  - soft delete behavior (`active=false`)
  - pagination, search, sort, category filter
  - Sonner notifications for success/error
- Orders management page:
  - status tabs (All / Pending / Approved / Delivered)
  - pending badge count
  - search + date-range filters (All / Today / 7 days / 30 days)
  - action buttons by status:
    - Pending → Approve
    - Approved → Deliver

✅ **Auth/session behavior**
- Zustand persisted auth store
- Axios interceptor with refresh-token flow on 401
- automatic retry after token refresh

### Swagger shortcut (Admin Sidebar)

Admin sidebar has **API Docs** button that opens Swagger URL from env:

`{NEXT_PUBLIC_API_URL without /api}/swagger-ui/index.html`

Example:
- `NEXT_PUBLIC_API_URL=http://localhost:8080/api`
- opens `http://localhost:8080/swagger-ui/index.html`

### Important Routes

- `/` — public home
- `/auth/login`
- `/auth/register`
- `/orders` — my orders (user)
- `/dashboard` — admin overview
- `/dashboard/products` — admin products
- `/dashboard/orders` — admin orders

### Notes

- Theme follows dark zinc system; public accent is amber, admin accent is emerald.
- For admin actions, backend role must be `ADMIN`.
- Ensure backend CORS allows frontend origin during local and production runs.

---

### Frontend Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── auth/
│   │   │   ├── orders/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── products/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   ├── types/
│   └── utils/
├── public/
├── package.json
└── tsconfig.json
```

- `app/(public)`: user-facing pages (auth, product browsing, user orders)
- `app/(admin)`: admin pages (dashboard, products, orders)
- `components/ui`: shared UI components and dialogs
- `lib`: API client and integration helpers
- `store`: Zustand state stores (auth/cart)
- `types`: shared TypeScript domain types
- `utils`: formatting and helper utilities

---

### Next FE Milestones

- Add order detail modal and richer state transitions UX
- Add integration tests for critical admin flows
- Expand settings/admin tools section

---

**Frontend Status:** ✅ Active development with core admin flows implemented

---

## 🌐 Deployment

### Backend Deployment

#### Option 1: Koyeb (Free-tier optimized)

1. Connect GitHub repo to Koyeb
2. Configure environment variables in Koyeb dashboard
3. Deploy from `master` branch
4. GitHub Actions auto-builds and pushes Docker image to Docker Hub

#### Option 2: Render

1. Create new Web Service on Render
2. Connect GitHub repo
3. Set build command: `./mvnw clean package`
4. Set start command: `java -jar target/*.jar`
5. Add environment variables

#### Option 3: Railway

1. Connect GitHub repo
2. Railway auto-detects Spring Boot app
3. Add PostgreSQL plugin
4. Deploy

### GitHub Actions CI/CD

**Workflow:** `.github/workflows/backend-deploy.yml`

Triggers on:

- `push` to `master` branch
- Changes in `backend/` folder

Actions:

1. Checkout code
2. Build Docker image (multi-stage: Maven build → distroless runtime)
3. Push to Docker Hub (`khang1z2t/storeops-backend:latest`)
4. Manual redeploy on Koyeb/Render

### Docker Hub Setup

1. Create Docker Hub account
2. Generate Personal Access Token (read + write)
3. Add to GitHub repo secrets:
   - `DOCKER_USERNAME`
   - `DOCKER_TOKEN`

---

## 📚 API Documentation

Full API documentation available in `/docs/API.md`

**Quick Reference:**

| Endpoint                  | Method | Role   | Description          |
| ------------------------- | ------ | ------ | -------------------- |
| `/api/auth/login`         | POST   | PUBLIC | Login                |
| `/api/auth/register`      | POST   | PUBLIC | Register             |
| `/api/auth/refresh`       | POST   | PUBLIC | Refresh token        |
| `/api/auth/me`            | GET    | USER   | Get current user     |
| `/api/products`           | GET    | PUBLIC | List products        |
| `/api/products`           | POST   | ADMIN  | Create product       |
| `/api/orders`             | POST   | USER   | Create order         |
| `/api/orders/my`          | GET    | USER   | Get my orders        |
| `/api/orders`             | GET    | ADMIN  | Get all orders       |
| `/api/orders/{id}/status` | PUT    | ADMIN  | Update order status  |
| `/api/dashboard/stats`    | GET    | ADMIN  | Dashboard statistics |

**Live Swagger UI:** `https://beautiful-vittoria-yunok-e4f8b150.koyeb.app/`

---

## 🔑 Environment Variables Reference

### Database

```
DB_URL=jdbc:postgresql://host:5432/storeops
DB_USERNAME=postgres
DB_PASSWORD=password
DB_SCHEMA=storeops
```

### Security

```
JWT_SECRET=your-secret-key-min-32-chars
```

### Server

```
PORT=8080
SWAGGER_ENABLED=true
```

---

## 🧪 Testing

### Local Test with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"password"}'

# Get products
curl http://localhost:8080/api/products

# Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Using Swagger UI

1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Click "Authorize" and paste JWT token
3. Test endpoints directly from UI

---

## 📖 Documentation

- **API Docs:** `/docs/API.md` — Complete endpoint reference
- **Entity Docs:** `/docs/ENTITY.md` — Database schema details
- **Project Plan:** `/docs/PLAN.md` — Milestones and requirements

---

## 📞 Contact & Support

- **Project:** StoreOps (Interview Project)
- **Author:** Khang Bảo
- **Portfolio:** https://portfolio.khangyuno.id.vn
- **Email:** khangbao3008@gmail.com

---

## 📄 License

This project is created for educational and interview purposes.

---

**Last Updated:** 2026-05-29  
**Backend Status:** ✅ Complete & Deployed  
**Frontend Status:** ✅ Complete & Deployed 

---

## 🌐 Deployment

### Backend Deployment

#### Option 1: Koyeb (Free-tier optimized)

1. Connect GitHub repo to Koyeb
2. Configure environment variables in Koyeb dashboard
3. Deploy from `master` branch
4. GitHub Actions auto-builds and pushes Docker image to Docker Hub

#### Option 2: Render

1. Create new Web Service on Render
2. Connect GitHub repo
3. Set build command: `./mvnw clean package`
4. Set start command: `java -jar target/*.jar`
5. Add environment variables

#### Option 3: Railway

1. Connect GitHub repo
2. Railway auto-detects Spring Boot app
3. Add PostgreSQL plugin
4. Deploy

### GitHub Actions CI/CD

**Workflow:** `.github/workflows/backend-deploy.yml`

Triggers on:

- `push` to `master` branch
- Changes in `backend/` folder

Actions:

1. Checkout code
2. Build Docker image (multi-stage: Maven build → distroless runtime)
3. Push to Docker Hub (`khang1z2t/storeops-backend:latest`)
4. Manual redeploy on Koyeb/Render

### Docker Hub Setup

1. Create Docker Hub account
2. Generate Personal Access Token (read + write)
3. Add to GitHub repo secrets:
   - `DOCKER_USERNAME`
   - `DOCKER_TOKEN`

---

## 📚 API Documentation

Full API documentation available in `/docs/API.md`

**Quick Reference:**

| Endpoint                  | Method | Role   | Description          |
| ------------------------- | ------ | ------ | -------------------- |
| `/api/auth/login`         | POST   | PUBLIC | Login                |
| `/api/auth/register`      | POST   | PUBLIC | Register             |
| `/api/auth/refresh`       | POST   | PUBLIC | Refresh token        |
| `/api/auth/me`            | GET    | USER   | Get current user     |
| `/api/products`           | GET    | PUBLIC | List products        |
| `/api/products`           | POST   | ADMIN  | Create product       |
| `/api/orders`             | POST   | USER   | Create order         |
| `/api/orders/my`          | GET    | USER   | Get my orders        |
| `/api/orders`             | GET    | ADMIN  | Get all orders       |
| `/api/orders/{id}/status` | PUT    | ADMIN  | Update order status  |
| `/api/dashboard/stats`    | GET    | ADMIN  | Dashboard statistics |

**Live Swagger UI:** `https://beautiful-vittoria-yunok-e4f8b150.koyeb.app/`

---

## 🔑 Environment Variables Reference

### Database

```
DB_URL=jdbc:postgresql://host:5432/storeops
DB_USERNAME=postgres
DB_PASSWORD=password
DB_SCHEMA=storeops
```

### Security

```
JWT_SECRET=your-secret-key-min-32-chars
```

### Server

```
PORT=8080
SWAGGER_ENABLED=true
```

---

## 🧪 Testing

### Local Test with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"password"}'

# Get products
curl http://localhost:8080/api/products

# Create order
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Using Swagger UI

1. Navigate to `http://localhost:8080/swagger-ui.html`
2. Click "Authorize" and paste JWT token
3. Test endpoints directly from UI

---

## 📖 Documentation

- **API Docs:** `/docs/API.md` — Complete endpoint reference
- **Entity Docs:** `/docs/ENTITY.md` — Database schema details
- **Project Plan:** `/docs/PLAN.md` — Milestones and requirements

---

## 📞 Contact & Support

- **Project:** StoreOps (Interview Project)
- **Author:** Khang Bảo
- **Portfolio:** https://portfolio.khangyuno.id.vn
- **Email:** khangbao3008@gmail.com

---

## 📄 License

This project is created for educational and interview purposes.

---

**Last Updated:** 2026-05-28  
**Backend Status:** ✅ Complete & Deployed  
**Frontend Status:** 🚧 In Development
