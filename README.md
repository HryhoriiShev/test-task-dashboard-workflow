# OvaSight - Business Intelligence Platform

A modern full-stack application for business management and daily reporting, featuring a Diaspora Dashboard for business oversight and a Business Owner Portal for performance tracking.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Scalability & Production Readiness](#-scalability--production-readiness)

## ✨ Features

### 1️⃣ Diaspora User Dashboard (Web)

- **Add Business**: Register new businesses with comprehensive details
  - Business Name, Owner Name, Owner Phone
  - Category and City
- **View Businesses**: Paginated list with infinite scroll
- **Modern UI**: Gradient-based design with smooth animations
- **Search & Filter**: Easy navigation through business listings

### 2️⃣ Business Owner Reporting Page (Mobile-Friendly)

- **Submit Daily Reports**: Track daily business performance
  - Sales, Expenses, Customer Count
  - Notes for additional context
  - Photo upload (required)
  - Video upload (optional)
- **View Past Reports**: Infinite scroll through historical data
- **Multi-Business Filter**: Filter reports by multiple businesses
- **Analytics Dashboard**: Real-time metrics (total sales, expenses, profit)
- **Responsive Design**: Optimized for mobile devices

### 3️⃣ Backend (Node + Express + PostgreSQL)

- **RESTful API**: Clean, well-structured endpoints
- **AWS S3 Integration**: Secure media file storage
- **Type-Safe**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod schema validation
- **Error Handling**: Comprehensive error management
- **Health Checks**: Monitor service status

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9
- **UI Library**: React 19
- **Styling**: TailwindCSS + ShadCN UI
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

### Backend

- **Runtime**: Node.js 22
- **Framework**: Express 5
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL 17
- **ORM**: Prisma 6.19
- **File Upload**: Multer + Multer-S3
- **Storage**: AWS S3
- **Validation**: Zod
- **Security**: Helmet, CORS

### DevOps & Tools

- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **Database Management**: Docker Compose
- **Development**: ts-node-dev, hot reload
- **Code Quality**: ESLint, Prettier

## 🏗 Architecture

### Monorepo Structure

```
ovasight/
├── client/          # Next.js frontend application
├── server/          # Express backend API
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### Design Patterns

#### Frontend

- **Component-Based Architecture**: Reusable UI components
- **Service Layer**: API calls abstracted into services
- **Type Safety**: Shared TypeScript interfaces
- **Optimistic Updates**: Immediate UI feedback
- **Infinite Scroll**: Efficient data loading
- **Form Validation**: Client-side with Zod schemas

#### Backend

- **MVC Pattern**: Separation of concerns
  - Controllers: Request handling
  - Services: Business logic (future)
  - Models: Data access (Prisma)
- **Middleware Pattern**: Reusable request processing
- **Repository Pattern**: Database abstraction via Prisma
- **Type-Safe Validation**: Zod schemas for runtime validation

### Database Schema

```prisma
model Business {
  id          Int      @id @default(autoincrement())
  name        String
  ownerName   String
  ownerPhone  String
  category    String
  city        String
  reports     Report[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Report {
  id            Int      @id @default(autoincrement())
  sales         Decimal
  expenses      Decimal
  customerCount Int
  notes         String?
  imageUrl      String
  videoUrl      String?
  businessId    Int
  business      Business @relation(fields: [businessId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())

  @@index([businessId])
  @@index([createdAt])
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ ([Download](https://nodejs.org/))
- pnpm 10+ (Install: `npm install -g pnpm`)
- Docker & Docker Compose ([Download](https://www.docker.com/))
- AWS Account (for S3 storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd test-task
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   **Root `.env` (for Docker):**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=ovasight_db
   ```

   **Server `.env`:**

   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `server/.env`:

   ```env
   # Database
   DATABASE_URL="postgresql://admin:admin@localhost:5432/ovasight_db?schema=public"

   # AWS S3
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_BUCKET_NAME=your_bucket_name

   # Server
   PORT=4000
   NODE_ENV=development
   ```

   **Client `.env.local`:**

   ```bash
   cd ../client
   cp .env.example .env.local
   ```

   Edit `client/.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Start PostgreSQL with Docker**

   ```bash
   # From root directory
   docker-compose up -d
   ```

5. **Set up the database**

   ```bash
   cd server
   pnpm db:generate  # Generate Prisma Client
   pnpm db:migrate   # Run migrations
   ```

6. **Start the development servers**

   Open two terminal windows:

   **Terminal 1 - Backend:**

   ```bash
   cd server
   pnpm dev
   ```

   **Terminal 2 - Frontend:**

   ```bash
   cd client
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/health

## 📡 API Documentation

### Base URL

```
http://localhost:4000/api
```

### Endpoints

#### Businesses

**Create Business**

```http
POST /api/businesses
Content-Type: application/json

{
  "name": "Tech Startup Inc",
  "ownerName": "John Doe",
  "ownerPhone": "+1234567890",
  "category": "Technology",
  "city": "San Francisco"
}

Response: 201 Created
{
  "id": 1,
  "name": "Tech Startup Inc",
  "ownerName": "John Doe",
  "ownerPhone": "+1234567890",
  "category": "Technology",
  "city": "San Francisco",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**List Businesses**

```http
GET /api/businesses?page=1&limit=10

Response: 200 OK
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Reports

**Submit Report**

```http
POST /api/reports
Content-Type: multipart/form-data

FormData:
- businessId: 1
- sales: 1500.50
- expenses: 800.25
- customerCount: 45
- notes: "Great day!" (optional)
- image: [file]
- video: [file] (optional)

Response: 201 Created
{
  "id": 1,
  "sales": "1500.50",
  "expenses": "800.25",
  "customerCount": 45,
  "notes": "Great day!",
  "imageUrl": "https://s3.amazonaws.com/...",
  "videoUrl": "https://s3.amazonaws.com/...",
  "businessId": 1,
  "business": {...},
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**List All Reports**

```http
GET /api/reports?page=1&limit=12

Response: 200 OK
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "totalPages": 9
  }
}
```

**List Reports by Business**

```http
GET /api/reports/business/:businessId?page=1&limit=12

Response: 200 OK
{
  "data": [...],
  "meta": {...}
}
```

### Error Responses

```json
{
  "error": "Error message",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["fieldName"],
      "message": "Expected string, received number"
    }
  ]
}
```

## 📁 Project Structure

```
test-task/
├── client/                          # Frontend Application
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Diaspora Dashboard
│   │   ├── reports/
│   │   │   └── page.tsx            # Business Owner Portal
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ui/                     # ShadCN UI components
│   │   ├── add-business-dialog.tsx
│   │   ├── business-list.tsx
│   │   ├── reports-list-all.tsx
│   │   └── submit-report-dialog.tsx
│   ├── services/
│   │   ├── business.service.ts     # Business API calls
│   │   └── report.service.ts       # Report API calls
│   ├── types/
│   │   ├── api.ts                  # API response types
│   │   ├── business.ts             # Business types
│   │   └── report.ts               # Report types
│   ├── lib/
│   │   ├── axios.ts                # Axios configuration
│   │   ├── providers.tsx           # React Query provider
│   │   └── utils.ts                # Utility functions
│   └── package.json
│
├── server/                          # Backend Application
│   ├── prisma/
│   │   └── schema.prisma           # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts              # Environment validation
│   │   ├── controllers/
│   │   │   ├── business.controller.ts
│   │   │   └── report.controller.ts
│   │   ├── middlewares/
│   │   │   └── upload.ts           # S3 upload configuration
│   │   ├── routes/
│   │   │   ├── business.routes.ts
│   │   │   └── report.routes.ts
│   │   ├── lib/
│   │   │   └── prisma.ts           # Prisma client singleton
│   │   ├── types/
│   │   │   └── multer-s3.d.ts      # TypeScript definitions
│   │   └── index.ts                # Express server entry
│   └── package.json
│
├── docker-compose.yml               # PostgreSQL setup
├── pnpm-workspace.yaml              # Monorepo configuration
└── README.md                        # This file
```

## 🔐 Environment Variables

### Root `.env`

```env
# PostgreSQL Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=ovasight_db
```

### Server `.env`

```env
# Database
DATABASE_URL="postgresql://admin:admin@localhost:5432/ovasight_db?schema=public"

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_BUCKET_NAME=your_bucket_name_here

# Server Configuration
PORT=4000
NODE_ENV=development
```

### Client `.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📈 Scalability & Production Readiness

### Current Implementation

#### ✅ Strengths

1. **Type Safety**: Full TypeScript across frontend and backend
2. **Modern Architecture**: React Query for state management, Prisma for database
3. **AWS S3 Integration**: Scalable file storage solution
4. **Optimistic Updates**: Excellent UX with instant feedback
5. **Responsive Design**: Mobile-first, modern UI
6. **Database Indexing**: Optimized queries with proper indexes
7. **Error Handling**: Comprehensive error management
8. **Clean Code**: Well-organized, maintainable codebase

#### 🚀 Scalability Path to MVP

**1. Authentication & Authorization**

- Implement JWT-based authentication
- Role-based access control (Diaspora Admin, Business Owner)
- Secure API endpoints with middleware
- Session management

**2. Multi-Tenancy**

- Tenant isolation in database
- Organization/workspace concept
- User invitations and permissions

**3. Advanced Features**

- Real-time notifications (Socket.io/Pusher)
- Email notifications (SendGrid/AWS SES)
- Report analytics and charts (Chart.js/Recharts)
- Export functionality (PDF/Excel)
- Advanced filtering and search (Elasticsearch)

**4. Performance Optimization**

- Redis caching layer
- CDN for static assets (Cloudflare/CloudFront)
- Database query optimization
- API response compression
- Image optimization (Next.js Image)

**5. Infrastructure**

- Containerization (Docker)
- CI/CD pipeline (GitHub Actions)
- Kubernetes orchestration
- Load balancing
- Auto-scaling

**6. Monitoring & Logging**

- Application monitoring (Sentry)
- Performance monitoring (New Relic/Datadog)
- Structured logging
- Error tracking

**7. Security Enhancements**

- Rate limiting (per user/tenant)
- API key management
- Input sanitization
- SQL injection prevention (Prisma already handles this)
- XSS protection
- CSRF tokens

**8. Data Management**

- Automated backups
- Data retention policies
- GDPR compliance
- Data export/import

### Deployment Strategy

#### Development → Staging → Production

**Development** (Current)

- Local PostgreSQL (Docker)
- Local S3 (MinIO) or dev S3 bucket
- Hot reload enabled

**Staging**

- AWS RDS PostgreSQL
- Separate S3 bucket
- Vercel/Railway deployment
- Production-like environment

**Production**

- AWS RDS (Multi-AZ)
- CloudFront CDN
- Auto-scaling EC2/ECS
- Redis cluster
- Monitoring enabled
- Automated backups

### Tech Debt & Future Improvements

1. **Testing**: Add unit tests (Jest/Vitest), E2E tests (Playwright)
2. **API Documentation**: Swagger/OpenAPI specification
3. **Internationalization**: i18n support
4. **Accessibility**: WCAG compliance
5. **Analytics**: User behavior tracking
6. **Rate Limiting**: Implement per-user/tenant limits
7. **Webhooks**: Event-driven integrations
8. **Batch Operations**: Bulk import/export

## 🎨 UI/UX Features

- **Modern Gradient Design**: Premium AI SaaS aesthetic
- **Smooth Animations**: Transitions and hover effects
- **Infinite Scroll**: Seamless data loading
- **Optimistic Updates**: Instant feedback
- **Responsive Layout**: Mobile-first design
- **Loading States**: Skeleton screens and spinners
- **Empty States**: Helpful guidance when no data
- **Error States**: Clear error messages
- **Toast Notifications**: User feedback (can be added)
- **Dark Mode Ready**: Design system prepared (can be implemented)

## 🔧 Available Scripts

### Root Commands

```bash
pnpm dev          # Start both client and server
pnpm build        # Build both projects
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
pnpm clean        # Clean all node_modules
pnpm docker:up    # Start Docker services
```

### Server Commands

```bash
cd server
pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
```

### Client Commands

```bash
cd client
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Find and kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database Connection Failed**

```bash
# Check Docker is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

**Prisma Client Out of Sync**

```bash
cd server
pnpm db:generate
```

**S3 Upload Failed**

- Verify AWS credentials in `.env`
- Check S3 bucket permissions
- Ensure bucket exists and is in correct region

## 📝 License

This project is created for evaluation purposes.

## 👥 Contact

For questions or feedback, please reach out to the project maintainer.

---

**Built with ❤️ using Next.js, Express, TypeScript, and PostgreSQL**
