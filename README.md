# OvaSight - Business Reporting Platform

A modern full-stack application for business management and daily reporting with AWS S3 media storage.

## 🏗️ Project Structure

```
test-task/
├── server/          # Backend API (Express + Prisma + TypeScript)
├── client/          # Frontend (Coming soon)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL 15
- **ORM**: Prisma 6
- **Validation**: Zod
- **File Storage**: AWS S3 (via multer-s3)
- **Security**: Helmet, CORS, Rate Limiting
- **Package Manager**: pnpm (workspace)

## 📋 Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose
- AWS S3 bucket with credentials

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd test-task

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
# Required: DATABASE_URL, AWS credentials, etc.
```

**Required Environment Variables:**

- `DATABASE_URL` - PostgreSQL connection string
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_BUCKET_NAME` - S3 bucket name
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)

### 3. Start Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Verify database is running
docker ps
```

### 4. Run Database Migrations

```bash
cd server

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Open Prisma Studio to view data
pnpm db:studio
```

### 5. Start Development Server

```bash
# From server directory
pnpm dev

# Server will run on http://localhost:4000
```

## 📚 API Documentation

### Health Check

```
GET /health
```

Returns server and database health status.

### Business Endpoints

#### Create Business

```
POST /api/businesses
Content-Type: application/json

{
  "name": "string",
  "ownerName": "string",
  "ownerPhone": "string",
  "category": "string",
  "city": "string"
}
```

#### List Businesses (with pagination)

```
GET /api/businesses?page=1&limit=10
```

### Report Endpoints

#### Create Report (with file upload)

```
POST /api/reports
Content-Type: multipart/form-data

Fields:
- image: file (required)
- video: file (optional)
- sales: number
- expenses: number
- customerCount: number
- notes: string (optional)
- businessId: number
```

#### List Reports by Business

```
GET /api/reports/business/:businessId?page=1&limit=10
```

## 🔒 Security Features

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**:
  - General API: 100 requests/15min
  - Uploads: 10 requests/15min
  - Business creation: 5 requests/hour
- **Input Validation**: Zod schemas
- **File Type Validation**: Images and videos only
- **File Size Limit**: 50MB max
- **Request Size Limit**: 10MB JSON payload

## 🗄️ Database Schema

### Business Model

- `id`: Auto-increment integer
- `name`: String
- `ownerName`: String
- `ownerPhone`: String
- `category`: String
- `city`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Report Model

- `id`: Auto-increment integer
- `sales`: Decimal(10,2)
- `expenses`: Decimal(10,2)
- `customerCount`: Integer
- `notes`: String (optional)
- `imageUrl`: String (S3 URL)
- `videoUrl`: String (S3 URL, optional)
- `businessId`: Foreign key to Business
- `createdAt`: Timestamp

**Relationships**: One Business → Many Reports (cascade delete)

**Indexes**:

- `businessId` (for fast queries)
- `createdAt` (for sorting)

## 🛠️ Available Scripts

### Server Package

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:generate  # Generate Prisma Client
pnpm db:push      # Push schema to database
```

## 📁 Project Architecture

```
server/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment validation
│   ├── controllers/
│   │   ├── business.controller.ts
│   │   └── report.controller.ts
│   ├── lib/
│   │   └── prisma.ts           # Prisma singleton
│   ├── middlewares/
│   │   ├── rate-limit.ts       # Rate limiting config
│   │   └── upload.ts           # S3 upload config
│   ├── routes/
│   │   ├── business.routes.ts
│   │   └── report.routes.ts
│   ├── types/
│   │   └── multer-s3.d.ts     # S3 file types
│   └── index.ts                # App entry point
├── prisma/
│   └── schema.prisma           # Database schema
└── tsconfig.json               # TypeScript config
```

## 🎯 TypeScript Configuration

This project uses **strict TypeScript** settings:

- `strict: true` - All strict type checking
- `exactOptionalPropertyTypes: true` - Strict optional handling
- `noUncheckedIndexedAccess: true` - Array access safety
- `isolatedModules: true` - Better for build tools

## 🐳 Docker Services

### PostgreSQL

- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: Persistent data storage
- **Health Check**: Built-in

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker ps

# View database logs
docker logs ovasight_db

# Restart database
docker-compose restart postgres
```

### Prisma Issues

```bash
# Reset database (⚠️ deletes all data)
pnpm db:push --force-reset

# Regenerate Prisma Client
pnpm db:generate
```

### Port Already in Use

```bash
# Change PORT in .env file
PORT=5000
```

## 📝 Development Notes

### Code Quality

- All controllers use explicit return types
- Proper error handling with typed catch blocks
- Singleton Prisma client to avoid connection pool exhaustion
- Environment variables validated at startup
- No `any` types in production code

### Best Practices Implemented

✅ Database connection pooling  
✅ Graceful shutdown handling  
✅ Health check endpoint  
✅ Request size limits  
✅ Rate limiting per endpoint  
✅ Cascade delete for data integrity  
✅ Database indexes for performance  
✅ Type-safe environment variables

## 🚧 Roadmap

- [ ] Add authentication (JWT)
- [ ] Add authorization (RBAC)
- [ ] Add unit tests (Jest/Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add logging service (Winston/Pino)
- [ ] Build frontend client
- [ ] Add CI/CD pipeline

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Made with ❤️ using TypeScript, Express, and Prisma**
