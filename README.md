# Kerith Cakes - Separated Architecture (Frontend & Backend)

A decoupled fullstack cake order & customized bakery platform with a dedicated **Next.js Frontend** and a standalone **Node.js Express + MySQL Backend**.

---

## 📁 Architecture Overview

```
kerith-cakess/
├── backend/                       # Standalone Node.js & Express API Backend
│   ├── src/
│   │   ├── config/db.ts           # MySQL connection pool & automatic table migrations
│   │   ├── controllers/           # Auth, Product, Upload, Images & Analytics Controllers
│   │   ├── routes/                # Express API routes (/api/*)
│   │   ├── data/                  # Initial products data seeder
│   │   └── server.ts              # Express Server entrypoint (Port 5000)
│   ├── .env                       # Backend database & port credentials
│   ├── package.json               # Backend dependencies & build scripts
│   └── tsconfig.json              # Backend TypeScript configuration
│
├── src/                           # Next.js Frontend (React 19 & Tailwind CSS)
│   ├── app/                       # App Router UI (Pages, Layouts, Dashboard, Gallery, Menu)
│   ├── components/                # Modular UI components
│   ├── context/                   # ProductsContext & CartContext
│   ├── config/api.ts              # Frontend API client communicating with Backend
│   └── data/                      # Client fallbacks & constants
│
├── public/                        # Static assets & cake images
├── next.config.ts                 # Next.js config with API proxy rewrites to Backend
└── package.json                   # Root scripts for running Frontend & Backend
```

---

## 🚀 Getting Started

### 1. Run Backend (Node.js)

```bash
# In project root:
npm run dev:be

# Or navigate directly to backend directory:
cd backend
npm run dev
```
> The Node.js Express server starts on **http://localhost:5000**.

### 2. Run Frontend (Next.js)

```bash
# In project root:
npm run dev:fe
# or
npm run dev
```
> Next.js runs on **http://localhost:3000** and automatically proxies requests (`/api/*`) to the Node.js backend.

---

## 🔌 API Endpoints (Node.js Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status & endpoint directory |
| `GET` | `/api/products` | Fetch all products from MySQL (auto-seeds defaults) |
| `POST` | `/api/products` | Create a new cake product |
| `PUT` | `/api/products` | Update an existing product |
| `DELETE` | `/api/products?id={id}` | Delete a product |
| `POST` | `/api/users/login` | Admin authentication |
| `GET` | `/api/users` | List admin users |
| `POST` | `/api/users` | Add new admin account (up to 3) |
| `POST` | `/api/upload` | Upload cake photos via multer to `/images/cakes/` |
| `DELETE` | `/api/upload?imageUrl=...` | Delete uploaded cake photo |
| `GET` | `/api/analytics/realtime` | Google Analytics 4 Realtime report |
| `GET` | `/api/init-db` | Verify MySQL connection & stats |
