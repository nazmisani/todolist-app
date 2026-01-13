# Todo List Application

> A full-stack todo management system built with modern web technologies

This is a take-home project demonstrating a complete CRUD application with authentication, state management, and a clean architecture.

## 📋 Overview

A production-ready todo list application that allows users to manage their tasks with categories, priorities, and due dates. Built with Next.js 16 (App Router) and PostgreSQL.

**Live Demo**: _[Not deployed yet]_

## ✨ Key Features

### Authentication & Authorization

- User registration with password hashing (bcrypt)
- JWT-based authentication using HTTP-only cookies
- Protected routes with middleware
- Session persistence

### Todo Management

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete with one click
- ✅ Set priority levels (Low, Medium, High) with color indicators
- ✅ Optional due date tracking
- ✅ Organize todos by categories

### Category System

- Create and manage custom categories
- View todo count per category
- Link todos to categories

### Dashboard

- Real-time statistics (total, completed, pending todos)
- Recent activity feed
- Quick navigation to main features

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.1.1 (App Router with Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React

### State Management

- **Client State**: Redux Toolkit 2.11
- **Server State**: TanStack Query (React Query) 5.90
- **Form State**: React Hook Form 7.71

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 7.2 with Postgres adapter
- **Authentication**: jose (JWT)
- **Validation**: Zod 4.3

### Data Tables

- **TanStack Table 8.21** for advanced table features

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

After running the seed script, you can login with any of these accounts:

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
5. **Shadcn UI**: Accessible, customizable components without the bloat of a full UI library

### Architecture Patterns

- **Separation of Concerns**: Services layer abstracts API calls, hooks layer manages server state
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Security**: JWT in HTTP-only cookies, protected routes via middleware, password hashing
- **Code Reusability**: Shared form components, table components, and hooks

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🔒 Security Considerations

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens stored in HTTP-only cookies
- Token expiration set to 1 hour
- Middleware protects all dashboard routes
- User data isolation (each user sees only their own data)
- Input validation on both client and server

## 🎯 Features Demonstration

### Authentication Flow

1. Register new account → Password hashed → JWT issued
2. Login → Credentials verified → Session created
3. Protected routes → Middleware validates JWT → Access granted/denied
4. Logout → Cookie cleared → Redirected to login

### Todo Management Flow

1. Create todo with title, description, priority, due date, category
2. View todos in table with sortable columns
3. Toggle completion status with checkbox
4. Edit todo details in modal form
5. Delete with confirmation

### State Management

- **Auth state** (Redux): User info, authentication status
- **Server state** (React Query): Todos, categories with automatic cache updates
- **Form state** (React Hook Form): Form inputs, validation errors

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Clear session

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

## 🐛 Known Issues / Future Improvements

- [ ] Add pagination for todos list
- [ ] Implement search/filter functionality
- [ ] Add sorting by different columns
- [ ] Email verification for registration
- [ ] Password reset functionality
- [ ] Export todos to CSV
- [ ] Dark mode support
- [ ] Mobile responsive improvements
- [ ] Add unit and integration tests

## 📄 License

This is a project for educational/interview purposes.

---

**Note**: This project was built as a take-home assignment to demonstrate full-stack development skills with modern web technologies.
