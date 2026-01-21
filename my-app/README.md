# Todo List Application

Aplikasi todo list full-stack dengan autentikasi dan fitur CRUD lengkap, dibangun sebagai skill test untuk posisi Fullstack Web Developer.

## 📋 Overview

Aplikasi todo list yang memungkinkan user untuk mengelola tugas mereka dengan kategori, prioritas, dan tanggal jatuh tempo. Dibangun dengan Next.js 16 (App Router) dan PostgreSQL.

## ✨ Fitur Utama

### Authentication

- Registrasi user dengan password hashing (bcrypt)
- Session-based authentication dengan NextAuth.js v5
- Protected routes dengan middleware
- Login dan logout

### Todo Management (CRUD)

- **Create**: Halaman terpisah untuk membuat todo (`/todos/create`)
- **Read**: Halaman detail untuk melihat todo (`/todos/[id]`)
- **Update**: Halaman edit dengan reusable component (`/todos/[id]/edit`)
- **Delete**: Dialog konfirmasi sebelum delete
- Toggle status complete/incomplete
- Priority levels (Low, Medium, High)
- Due date tracking
- Kategorisasi todos

### Todo List Features

- Menggunakan **TanStack Query** untuk data fetching
- Menggunakan **TanStack Table** untuk tampilan list
- **Pagination**: 10 items per page
- **Page Navigation**: Previous/Next
- **Filtering**: Search by title, filter by priority, status, dan category

### Category System

- Create dan manage categories
- View todo count per category

### Dashboard

- Statistik (total, completed, pending todos)
- Recent activity
- Quick navigation

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React

### State Management

- **Client State**: Zustand v5.0
- **Server State**: TanStack Query (React Query) v5.90
- **Form State**: React Hook Form v7.71

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma v7.2
- **Authentication**: NextAuth.js v5
- **Validation**: Zod v4.3

### Data Tables

- **TanStack Table v8.21** untuk fitur table lengkap

## 📦 Installation

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (local atau cloud seperti Neon, Supabase, dll)
- npm atau bun package manager

### Setup Steps

1. **Clone repository dan install dependencies**

```bash
git clone <repository-url>
cd my-app
npm install
```

2. **Configure environment variables**

Buat file `.env` di root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
AUTH_SECRET="your-super-secret-key-change-this-in-production"
```

> **Note**: `AUTH_SECRET` wajib untuk NextAuth v5. Generate dengan: `openssl rand -base64 32`

3. **Setup database**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Seed dengan sample data (60 todos)
npm run seed
```

4. **Jalankan development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Docker Setup (Opsional)

Untuk menjalankan aplikasi menggunakan Docker:

```bash
# Jalankan semua services (app + database)
docker compose up -d

# Jalankan migration dan seed (pertama kali)
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run seed

# Lihat logs
docker compose logs -f

# Stop semua services
docker compose down
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 🧪 Test Credentials

Setelah menjalankan seed script, login dengan salah satu akun berikut:

| Email             | Password    | Description                            |
| ----------------- | ----------- | -------------------------------------- |
| john@example.com  | password123 | User dengan Work & Personal categories |
| jane@example.com  | password123 | User dengan Shopping category          |
| bob@example.com   | password123 | User dengan Health category            |
| alice@example.com | password123 | User dengan Learning category          |

## 🏗️ Arsitektur Aplikasi

### Project Structure

```
my-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   └── data/                  # JSON seed data files
├── src/
│   ├── app/
│   │   ├── (auth)/            # Public auth pages (login, register)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── todos/         # Todo management
│   │   │   │   ├── page.tsx           # List dengan TanStack Table
│   │   │   │   ├── create/page.tsx    # Create page
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Detail view page
│   │   │   │       └── edit/page.tsx  # Edit page (reuse TodoForm)
│   │   │   └── categories/    # Category management
│   │   └── api/               # API Routes
│   │       ├── auth/          # Authentication endpoints
│   │       ├── todos/         # Todo CRUD endpoints
│   │       └── categories/    # Category endpoints
│   ├── components/
│   │   ├── forms/             # Form components (TodoForm - reusable)
│   │   ├── tables/            # Table components (TanStack Table)
│   │   ├── layout/            # Layout components (Sidebar, Navbar)
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/                 # Custom TanStack Query hooks
│   ├── services/              # API client functions
│   ├── store/                 # Zustand store
│   ├── types/                 # TypeScript type definitions
│   ├── validators/            # Zod validation schemas
│   ├── utils/                 # Utility functions (bcrypt)
│   ├── lib/                   # Library configurations (Prisma, Auth)
│   ├── providers/             # React providers (Auth, Query)
│   └── proxy.ts               # Route protection (Next.js 16 Proxy)
├── .env                       # Environment variables
├── package.json
└── README.md
```

### Separation of Concerns

| Layer             | Responsibility              | Location      |
| ----------------- | --------------------------- | ------------- |
| **UI Components** | Render dan user interaction | `components/` |
| **Services**      | API calls ke backend        | `services/`   |
| **Hooks**         | TanStack Query wrappers     | `hooks/`      |
| **Store**         | Client state management     | `store/`      |
| **Validators**    | Input validation (Zod)      | `validators/` |
| **API Routes**    | Backend logic               | `app/api/`    |

## 🔑 State Management - Kenapa Zustand?

### Alasan Pemilihan Zustand

Project ini menggunakan **Zustand** untuk client state management dengan pertimbangan:

#### 1. **Simplicity & Minimal Boilerplate**

```typescript
// Zustand - Simple dan langsung pakai
const useTodoStore = create((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
}));

// Bandingkan dengan Redux yang butuh: store, slice, actions, reducers, Provider
```

#### 2. **No Provider Wrapper Needed**

- Langsung import dan gunakan di mana saja
- Tidak perlu wrap aplikasi dengan Provider
- Lebih clean dan straightforward

#### 3. **Performant**

- Re-render hanya komponen yang subscribe ke state tertentu
- Built-in selector support
- Tiny bundle size (~1KB)

#### 4. **TypeScript-Friendly**

- First-class TypeScript support
- Type inference yang baik

### Strategi State Management (Hybrid Approach)

| Tipe State       | Tool            | Contoh Penggunaan                       |
| ---------------- | --------------- | --------------------------------------- |
| **Client State** | Zustand         | Selected todo untuk cache saat navigasi |
| **Server State** | TanStack Query  | List todos, categories (auto-cache)     |
| **Form State**   | React Hook Form | Input values, validation errors         |
| **UI State**     | useState        | Modal open/close, local filters         |
| **Auth State**   | NextAuth        | User session                            |

### Kenapa Tidak Redux/Context API?

| Alternative       | Alasan Tidak Dipilih                                       |
| ----------------- | ---------------------------------------------------------- |
| **Redux Toolkit** | Overkill untuk project ini, terlalu banyak boilerplate     |
| **Context API**   | Perlu manual optimization, prone to unnecessary re-renders |
| **Jotai/Recoil**  | Bagus tapi Zustand lebih established dan straightforward   |

### Implementasi di Project

```typescript
// store/todoStore.ts
export const useTodoStore = create<TodoStore>((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
}));

// Digunakan untuk:
// 1. Cache todo saat navigasi dari list ke edit page (avoid refetch)
// 2. Centralized state untuk selected todo
```

## 🔒 Security

- **Password Hashing**: bcrypt dengan 10 salt rounds
- **Session Management**: NextAuth.js v5 dengan JWT
- **Route Protection**: Proxy (Next.js 16) melindungi semua dashboard routes
- **API Protection**: Auth check di setiap API endpoint
- **Data Isolation**: User hanya bisa akses data miliknya sendiri
- **Input Validation**: Zod schema di client dan server

## 🎯 Cara Kerja Aplikasi

### Authentication Flow

```
Register → Password di-hash (bcrypt) → User created
    ↓
Login → Credentials verified → Session created (JWT)
    ↓
Protected routes → Proxy validates session → Access granted/denied
    ↓
Logout → Session cleared → Redirect ke login
```

### Todo CRUD Flow

1. **Create**: `/todos/create` → Isi TodoForm → Submit → Redirect ke list
2. **Read**: Klik View → `/todos/[id]` → Server component fetch data
3. **Update**: Klik Edit → Zustand cache todo → `/todos/[id]/edit` → Reuse TodoForm → Submit
4. **Delete**: Klik Delete → Dialog konfirmasi → Confirm → TanStack Query invalidate
5. **List**: TanStack Table dengan pagination & filtering

### Reusable Component

`TodoForm` component digunakan untuk:

- **Create Todo** (`/todos/create`) - tanpa initialData
- **Update Todo** (`/todos/[id]/edit`) - dengan initialData dari Zustand/fetch

## 📝 API Endpoints

### Authentication

| Method | Endpoint                  | Description                                |
| ------ | ------------------------- | ------------------------------------------ |
| POST   | `/api/auth/register`      | Register user baru                         |
| POST   | `/api/auth/[...nextauth]` | NextAuth handlers (login, logout, session) |

### Todos

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | `/api/todos`      | Get all user todos |
| POST   | `/api/todos`      | Create new todo    |
| GET    | `/api/todos/[id]` | Get single todo    |
| PUT    | `/api/todos/[id]` | Update todo        |
| PATCH  | `/api/todos/[id]` | Toggle completion  |
| DELETE | `/api/todos/[id]` | Delete todo        |

### Categories

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/api/categories`      | Get all categories  |
| POST   | `/api/categories`      | Create new category |
| PUT    | `/api/categories/[id]` | Update category     |
| DELETE | `/api/categories/[id]` | Delete category     |

## 🚀 Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build untuk production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database dengan 60 sample todos
```

## 📊 Database Schema

```prisma
model User {
  id         String     @id @default(uuid())
  email      String     @unique
  name       String
  password   String     // Hashed dengan bcrypt
  categories Category[]
  todos      Todo[]
}

model Category {
  id     String @id @default(uuid())
  name   String
  userId String
  user   User   @relation(...)
  todos  Todo[]
}

model Todo {
  id          String    @id @default(uuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(high) // enum: low, medium, high
  dueDate     DateTime?
  userId      String
  categoryId  String?
  user        User      @relation(...)
  category    Category? @relation(...)
}
```

## 🌐 Environment Variables

| Variable       | Description                  | Required |
| -------------- | ---------------------------- | -------- |
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes   |
| `AUTH_SECRET`  | Secret key untuk NextAuth.js | ✅ Yes   |

## 📚 Key Technical Decisions

1. **Next.js 16 App Router**: Server components untuk better performance, streaming, dan SEO
2. **Prisma ORM**: Type-safe database queries, easy migrations, auto-completion
3. **Zustand + TanStack Query**: Zustand untuk simple client state, TanStack Query untuk server state dengan caching
4. **React Hook Form + Zod**: Performance-optimized forms dengan runtime type validation
5. **Shadcn UI**: Accessible, customizable, copy-paste components (not a dependency)
6. **Proxy Protection**: Route-level auth check sebelum render (Next.js 16 menggunakan Proxy menggantikan Middleware)

---

**Author**: Created as a skill test for Fullstack Web Developer position at PT. Sumatera TimberIndo Industry

**Tech Stack Summary**: Next.js 16 • React 19 • TypeScript • PostgreSQL • Prisma • NextAuth v5 • TanStack Query • TanStack Table • Zustand • Shadcn UI • Tailwind CSS
