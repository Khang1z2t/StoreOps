# StoreOps — Design System

## Overview
- **Project**: StoreOps — Convenience Store Order Management System
- **Client**: 7-Eleven Vietnam (Interview Project)
- **Stack**: Next.js 14 App Router + shadcn/ui + Tailwind CSS
- **Theme**: Dark mode only (`<html className="dark">`)
- **Style**: Modern dashboard — cards, charts, colored badges
- **Accent (Public pages)**: Amber
- **Accent (Dashboard pages)**: Emerald
- **Base**: shadcn/ui Zinc dark

---

## Color System

### CSS Variables (globals.css)
```css
.dark {
  --background: 240 10% 3.9%;         /* zinc-950 — page background */
  --foreground: 0 0% 98%;             /* white — primary text */
  --card: 240 10% 5.9%;               /* zinc-900 — card background */
  --card-foreground: 0 0% 98%;
  --primary: 43 96% 56%;              /* amber-500 — public buttons, links, focus */
  --primary-foreground: 0 0% 100%;
  --secondary: 240 3.7% 15.9%;        /* zinc-800 — secondary buttons */
  --muted: 240 3.7% 15.9%;            /* zinc-800 — muted backgrounds */
  --muted-foreground: 240 5% 64.9%;   /* zinc-400 — placeholder, helper text */
  --accent: 43 96% 56%;               /* amber-500 (public) */
  --accent-foreground: 0 0% 100%;
  --border: 240 3.7% 15.9%;           /* zinc-800 — borders */
  --ring: 43 96% 56%;                 /* amber — focus ring for public */
  --destructive: 0 84% 60%;           /* red-500 — delete, error */
}
```

### Tailwind Color Usage
```
Page background   → bg-zinc-950
Sidebar           → bg-zinc-900
Card              → bg-zinc-900 border border-zinc-800
Table header      → bg-zinc-900
Table row         → bg-zinc-950 hover:bg-zinc-800/50
Input             → bg-zinc-800 border-zinc-700
Primary button (Public)    → bg-amber-500 hover:bg-amber-600 text-white
Primary button (Dashboard) → bg-emerald-500 hover:bg-emerald-600 text-white
Secondary button  → bg-zinc-800 hover:bg-zinc-700 text-zinc-100
Danger button     → bg-red-500/10 hover:bg-red-500/20 text-red-400
Primary text      → text-zinc-100
Secondary text    → text-zinc-400
Muted text        → text-zinc-500
Border            → border-zinc-800
Divider           → divide-zinc-800
```

---

## Order Status Badges

Always use these exact classes — never deviate:

```tsx
PENDING:   bg-yellow-500/15 text-yellow-400 border border-yellow-500/30
APPROVED:  bg-blue-500/15   text-blue-400   border border-blue-500/30
DELIVERED: bg-green-500/15  text-green-400  border border-green-500/30
CANCELLED: bg-red-500/15    text-red-400    border border-red-500/30
```

Badge shape: `rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center`

Label text (Vietnamese):
```
PENDING   → "Chờ duyệt"
APPROVED  → "Đã duyệt"
DELIVERED → "Đã giao"
CANCELLED → "Đã hủy"
```

---

## Typography

```
Font: system font stack via Tailwind (no custom font import needed)

Page title (h1):      text-2xl font-bold text-zinc-100
Section title (h2):   text-lg font-semibold text-zinc-100
Card title:           text-base font-semibold text-zinc-100
Table header:         text-xs font-medium text-zinc-400 uppercase tracking-wider
Body text:            text-sm text-zinc-300
Helper / muted:       text-xs text-zinc-500
Label:                text-sm font-medium text-zinc-300
```

---

## Layout

### Root Layout
```
<html className="dark">
  <body className="bg-zinc-950 text-zinc-100 antialiased">
    <Sidebar />
    <main className="ml-64 min-h-screen p-8">
      {children}
    </main>
  </body>
```

### Sidebar (Dashboard)
```
Width:        w-64 fixed left-0 top-0 h-screen
Background:   bg-zinc-900 border-r border-zinc-800
Logo area:    h-16 flex items-center px-6 border-b border-zinc-800
Nav item:     px-3 py-2 rounded-lg text-sm
  default:    text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100
  active:     bg-emerald-500/10 text-emerald-400 font-medium
Nav icon:     w-4 h-4 mr-3
```

### Page Wrapper
```
Header row:   flex items-center justify-between mb-6
Page title:   text-2xl font-bold text-zinc-100
Action btn:   Primary button top-right
Content:      space-y-6
```

### Cards (Dashboard stats)
```
bg-zinc-900 border border-zinc-800 rounded-xl p-6
Icon:         w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400
Value:        text-2xl font-bold text-zinc-100 mt-3
Label:        text-sm text-zinc-400 mt-1
```

### Data Tables
```
Wrapper:   bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden
Header:    bg-zinc-900 border-b border-zinc-800
  th:      px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider
Body:
  tr:      border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors
  td:      px-4 py-3 text-sm text-zinc-300
Empty:     py-12 text-center text-zinc-500
```

---

## Components

### ProductCard (Staff view — grid layout)
```
bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden
hover:border-zinc-700 transition-colors cursor-pointer

Image:       aspect-square object-cover w-full bg-zinc-800
Body:        p-4
  Name:      text-sm font-semibold text-zinc-100 line-clamp-2
  Category:  text-xs text-zinc-500 mt-1
  Price:     text-base font-bold text-amber-400 mt-2
  Unit:      text-xs text-zinc-500
  Footer:    flex justify-between items-center mt-4
    Stock:   text-xs text-zinc-400
    Button:  small amber button "Thêm vào giỏ"
```

Low stock warning (quantity < 10):
```
text-xs text-red-400  →  "Sắp hết hàng"
```

### ProductForm (Admin — modal dialog)
```
Dialog width: max-w-lg
Fields:
  - Tên sản phẩm    → text input
  - Danh mục        → select dropdown
  - Mô tả           → textarea rows=3
  - Giá (VNĐ)       → number input
  - Số lượng        → number input
  - Đơn vị          → text input (hộp, gói, chai...)
  - Hình ảnh URL    → text input (optional, auto-fetch Unsplash nếu trống)
Footer: Cancel (zinc) + Submit (emerald)
```

### CartDrawer (Staff)
```
Sheet slide-in from right, width: w-96
Header: "Giỏ hàng" + item count badge
Body: list các sản phẩm đã chọn
  Item: image + name + quantity control + subtotal
  Quantity: - / number / + buttons
Footer:
  Total: text-lg font-bold text-amber-400
  Submit button: full-width amber "Tạo đơn hàng"
Empty state: icon + "Chưa có sản phẩm nào"
```

### OrderDetailDialog (Admin)
```
Dialog width: max-w-2xl
Header: Order ID (truncated) + StatusBadge
Info grid: Người đặt / Ngày tạo / Tổng tiền
Table: sản phẩm trong đơn (tên, số lượng, đơn giá, thành tiền)
Footer: status select + Cập nhật button (chỉ hiện khi status chưa DELIVERED/CANCELLED)
```

---

## Forms

### Input fields
```
bg-zinc-800 border border-zinc-700 rounded-lg
text-sm text-zinc-100 placeholder:text-zinc-500
Public form:    focus:border-amber-500 focus:ring-1 focus:ring-amber-500
Dashboard form: focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
h-10 px-3
```

### Error messages
```
text-xs text-red-400 mt-1
```

### Form labels
```
text-sm font-medium text-zinc-300 mb-1.5 block
```

---

## Icons

Use `lucide-react` exclusively. Common icons:

```
Package         → sản phẩm
ShoppingCart    → giỏ hàng / đơn hàng
LayoutDashboard → dashboard
Plus            → thêm mới
Pencil          → sửa
Trash2          → xóa
ChevronDown     → dropdown
Search          → tìm kiếm
Filter          → lọc
X               → đóng / xóa khỏi cart
CheckCircle     → approved / delivered
Clock           → pending
XCircle         → cancelled
AlertTriangle   → warning / low stock
LogOut          → đăng xuất
User            → thông tin user
```

Icon size defaults:
```
Sidebar nav:    w-4 h-4
Button icon:    w-4 h-4
Card icon:      w-5 h-5
Empty state:    w-12 h-12 text-zinc-600
```

---

## Loading & Empty States

### Loading
```tsx
// Full page
<div className="flex items-center justify-center py-24">
  <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
</div>

// Table skeleton
<div className="space-y-3">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="h-12 bg-zinc-800 rounded-lg animate-pulse" />
  ))}
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <Package className="w-12 h-12 text-zinc-600 mb-4" />
  <p className="text-sm font-medium text-zinc-400">Chưa có dữ liệu</p>
  <p className="text-xs text-zinc-600 mt-1">Thêm mới để bắt đầu</p>
</div>
```

### Error State
```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <AlertTriangle className="w-12 h-12 text-red-500/50 mb-4" />
  <p className="text-sm font-medium text-zinc-400">Đã có lỗi xảy ra</p>
  <button className="text-xs text-amber-400 mt-2 hover:underline">Thử lại</button>
</div>
```

---

## Number Formatting

Always format price in Vietnamese Dong:
```ts
// utils.ts
export const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);

// Output: 35.000 ₫
```

Date formatting:
```ts
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

// Output: 28/05/2025, 14:30
```

---

## Responsive

This is an internal tool — desktop first, tablet supported:
```
Sidebar:        hidden on mobile (md:block), hamburger menu optional
Product grid:   grid-cols-2 md:grid-cols-3 lg:grid-cols-4
Dashboard cards: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
Tables:         overflow-x-auto wrapper on mobile
```

---

## Do's and Don'ts

### DO
- Use `zinc` scale for neutrals
- Public pages use `amber-500` as primary accent
- Dashboard pages use `emerald-500` as primary accent
- Keep badge colors consistent with the status config above
- Use `rounded-xl` for cards, `rounded-lg` for inputs and buttons
- Use `border-zinc-800` for all borders
- Format all prices with `formatPrice()` utility
- Show loading/empty/error state for every data-fetching component

### DON'T
- Don't use light mode anywhere
- Don't use random primary accent colors outside the chosen pair (amber for public, emerald for dashboard)
- Don't use `rounded-full` for cards or buttons (only badges)
- Don't hardcode price strings — always use `formatPrice()`
- Don't use arbitrary Tailwind values unless absolutely necessary
- Don't mix `px-` values inconsistently — stick to p-4 / p-6 for cards