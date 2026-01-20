# Todo List Application

Aplikasi todo list full-stack dengan autentikasi dan fitur CRUD lengkap.

## 📋 Overview

Aplikasi todo list yang memungkinkan user untuk mengelola tugas mereka dengan kategori, prioritas, dan tanggal jatuh tempo. Dibangun dengan Next.js 16 (App Router) dan PostgreSQL.

## ✨ Fitur Utama

### Authentication

- Registrasi user dengan password hashing (bcrypt)
- Session-based authentication dengan NextAuth.js
- Protected routes dengan middleware
- Login dan logout

### Todo Management

- Create, read, update, dan delete todos
- Halaman terpisah untuk create, view detail, dan edit
- Toggle status complete/incomplete
- Priority levels (Low, Medium, High)
- Due date tracking
- Kategorisasi todos
- Pagination (10 items per page)
- Filtering (search, priority, status, category)

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

- **Client State**: Zustand
- **Server State**: TanStack Query (React Query) 5.90
- **Form State**: React Hook Form 7.71

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 7.2
- **Authentication**: NextAuth.js 5
- **Validation**: Zod 4.3

### Data Tables

- **TanStack Table 8.21** untuk fitur table

## 📦 Installation

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database (local or remote)
- npm or bun package manager

### Setup Steps

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd my-app
npm install
```

2. **Configure environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

3. **Setup database**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npm run seed
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Test Credentials

After running the seed script, you can login with any of these accounts (21 sample todos included):

| Email             | Password    | Description                          |
| ----------------- | ----------- | ------------------------------------ |
| john@example.com  | password123 | User with Work & Personal categories |
| jane@example.com  | password123 | User with Shopping category          |
| bob@example.com   | password123 | User with Health category            |
| alice@example.com | password123 | User with Learning category          |

## 📁 Project Structure

```
my-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── (auth)/            # Public auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── todos/
│   │   │   │   ├── page.tsx           # Todos list with pagination & filters
│   │   │   │   ├── create/page.tsx    # Create todo page
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx       # Todo detail view page
│   │   │   │       └── edit/page.tsx  # Edit todo page
│   │   │   └── categories/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── todos/         # Todo CRUD endpoints
│   │   │   └── categories/    # Category CRUD endpoints
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── forms/             # Form components (React Hook Form)
│   │   ├── tables/            # Table components (TanStack Table)
│   │   ├── layout/            # Layout components (Sidebar, Navbar)
│   │   └── ui/                # Shadcn UI components
│   ├── hooks/                 # Custom React Query hooks
│   ├── services/              # API client functions
│   ├── store/                 # Redux store & slices
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions (JWT, etc)
│   ├── validators/            # Zod schemas
│   └── lib/                   # Library configurations (Prisma)
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🔑 Key Technical Decisions

### Why These Technologies?

1. **Next.js App Router**: Latest routing paradigm with server components and better performance
2. **Prisma with PostgreSQL**: Type-safe database queries and easy schema management
3. **Redux Toolkit + TanStack Query**: Redux for auth state, React Query for server state (cache invalidation, optimistic updates)
4. **React Hook Form + Zod**: Performance-optimized forms with runtime validation
5. **Shadcn UI**: Accessible, customizable components

### Architecture

- **Separation of Concerns**: Services untuk API calls, hooks untuk server state
- **Type Safety**: TypeScript + Zod validation
- **Security**: Protected routes via middleware, password hashing
- **Code Reusability**: Shared form components (TodoForm untuk create & edit)

### State Management Strategy

**Kenapa Zustand + TanStack Query?**

Project ini menggunakan pendekatan hybrid untuk state management:

#### Zustand (Client State)

- **Kegunaan**: Menyimpan detail todo yang sedang dilihat/edit
- **Kenapa dipilih**:
  - **Simple dan lightweight** - Tidak butuh banyak boilerplate seperti Redux
  - **Mudah dipahami** - API yang straightforward, cocok untuk project skala kecil-menengah
  - **Performant** - Re-render hanya komponen yang subscribe ke state tertentu
  - **No Provider needed** - Bisa langsung import dan pakai
  - **Persist support** - Mudah untuk persist state jika diperlukan

Contoh penggunaan di project ini:

```typescript
// store/todoStore.ts
const useTodoStore = create((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
}));

// Dipakai untuk cache todo saat navigasi dari list ke edit page
// Supaya tidak perlu fetch ulang dari server
```

#### TanStack Query (Server State)

- **Kegunaan**: Handle semua data dari server (todos, categories)
- **Fitur yang dipakai**:
  - Automatic cache invalidation setelah mutasi
  - Background refetching
  - Loading dan error states built-in

#### Kapan pakai yang mana?

| Tipe State         | Tool            | Contoh                    |
| ------------------ | --------------- | ------------------------- |
| Todo Detail Cache  | Zustand         | Selected todo untuk edit  |
| Server Data (CRUD) | TanStack Query  | List todos, categories    |
| Form State         | React Hook Form | Input values, validation  |
| UI State (local)   | useState        | Modal open/close, filters |

**Alternatif yang dipertimbangkan:**

- **Redux Toolkit**: Terlalu overkill untuk project ini, butuh banyak boilerplate
- **Context API**: Perlu manual optimization untuk hindari re-render
- **Jotai/Recoil**: Bagus tapi Zustand lebih familiar dan straightforward

## 🚀 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database dengan sample data
```

## 🔒 Security

- Password di-hash dengan bcrypt (10 rounds)
- Session dengan NextAuth.js
- Middleware protect semua dashboard routes
- User data isolation (setiap user hanya lihat data sendiri)
- Input validation di client dan server

## 🎯 Cara Kerja Aplikasi

### Authentication Flow

1. Register → Password di-hash → User created
2. Login → Credentials verified → Session created
3. Protected routes → Middleware validates session → Access granted/denied
4. Logout → Session cleared → Redirect ke login

### Todo Management Flow

1. **Create**: Navigate ke `/todos/create` → Isi form → Submit → Redirect ke list
2. **View**: Klik View button → Navigate ke `/todos/[id]` → Lihat detail
3. **Edit**: Klik Edit button → Navigate ke `/todos/[id]/edit` → Update form → Submit
4. **List**: View paginated table (10 per page) dengan filters dan search
5. **Toggle**: Check/uncheck completion langsung di table
6. **Delete**: Klik delete → Confirmation dialog → Confirm

### Table Features

- **Pagination**: 10 items per page dengan Previous/Next navigation
- **Search**: Filter todos by title
- **Filter by Priority**: Low, Medium, High
- **Filter by Status**: Completed atau Pending
- **Filter by Category**: Dynamic list dari user's categories

### State Management Flow

- **Auth state** (NextAuth): User session
- **Client state** (Zustand): Todo detail cache untuk navigasi
- **Server state** (TanStack Query): Todos, categories dengan automatic cache
- **Form state** (React Hook Form): Form inputs, validation

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- NextAuth handles login/logout via `/api/auth/[...nextauth]`

### Todos

- `GET /api/todos` - Get all user todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/[id]` - Get single todo
- `PUT /api/todos/[id]` - Update todo
- `PATCH /api/todos/[id]` - Toggle completion
- `DELETE /api/todos/[id]` - Delete todo

### Categories

- `GET /api/categories` - Get all user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Public auth pages (login, register)
│   ├── (dashboard)/      # Protected pages (dashboard, todos, categories)
│   └── api/              # API Routes
├── components/
│   ├── forms/            # Form components (TodoForm reusable)
│   ├── tables/           # Table components (TanStack Table)
│   ├── layout/           # Sidebar, Navbar
│   └── ui/               # Shadcn UI components
├── hooks/                # Custom React Query hooks
├── services/             # API client functions
├── store/                # Zustand store
├── types/                # TypeScript types
├── validators/           # Zod schemas
└── lib/                  # Library configs (Prisma, Auth)
```

---

Project ini dibuat sebagai skill test untuk posisi Fullstack Web Developer.

**Note**: This project was built as a take-home assignment to demonstrate full-stack development skills with modern web technologies.
