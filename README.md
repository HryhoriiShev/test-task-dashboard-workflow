# OvaSight - Business Intelligence Platform

A modern full-stack application for business management and daily reporting with real-time analytics and media uploads.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript) ![Node.js](https://img.shields.io/badge/Node.js-22-green?logo=node.js) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?logo=postgresql)

## ✨ Features

### 1️⃣ Diaspora Dashboard

- **Business Management**
  - Add new businesses with validation
  - View all businesses in modern card layout
  - Infinite scroll pagination
  - Search and filtering capabilities
  - Real-time business count statistics
- **Modern UI**
  - Gradient-based design with smooth animations
  - Responsive grid layout (1-3 columns)
  - Glassmorphic header with sticky navigation
  - Loading states and empty states
  - Optimistic updates (instant feedback)

### 2️⃣ Business Owner Portal

- **Daily Report Submission**
  - Multi-step form with validation
  - Required fields: Sales, Expenses, Customer Count
  - Optional notes field
  - Required photo upload (max 5MB)
  - Optional video upload (max 50MB)
  - File preview before submission
  - Real-time form validation
- **Reports Management**
  - View all reports with infinite scroll
  - Multi-select business filtering (select multiple businesses)
  - Real-time analytics dashboard:
    - Total Sales
    - Total Expenses
    - Net Profit with margin percentage
  - Profit/loss calculation per report
  - Color-coded metrics
- **Media Viewer**
  - In-app photo/video viewer (no external tabs)
  - Full-screen immersive experience
  - Zoom and pan for images
  - Video player with controls
  - Download functionality
  - Dark theme with glassmorphism

### 3️⃣ Backend API

- **Business Endpoints**
  - Create business with validation
  - List businesses with pagination
  - Type-safe request/response handling
- **Report Endpoints**
  - Submit report with file uploads
  - List all reports with pagination
  - List reports by business ID
  - Returns business relations
- **File Management**
  - AWS S3 integration for scalable storage
  - Secure file uploads with validation
  - Image and video support
  - Automatic URL generation

- **Database**
  - PostgreSQL with Prisma ORM
  - Optimized indexes for performance
  - Cascade deletes for data integrity
  - Type-safe queries

## 🛠 Tech Stack

### Frontend

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **Next.js 15**      | React framework with App Router   |
| **TypeScript 5.9**  | Type safety                       |
| **TailwindCSS**     | Utility-first styling             |
| **ShadCN UI**       | Premium component library         |
| **TanStack Query**  | Server state management & caching |
| **Axios**           | HTTP client                       |
| **React Hook Form** | Form management                   |
| **Zod**             | Schema validation                 |
| **Lucide React**    | Icon library                      |

### Backend

| Technology             | Purpose                       |
| ---------------------- | ----------------------------- |
| **Node.js 22**         | Runtime environment           |
| **Express 5**          | Web framework                 |
| **TypeScript 5.9**     | Type safety                   |
| **PostgreSQL 17**      | Relational database           |
| **Prisma 6.19**        | Type-safe ORM                 |
| **Zod**                | Runtime validation            |
| **Multer + Multer-S3** | File upload handling          |
| **AWS S3**             | Cloud file storage            |
| **Helmet**             | Security headers              |
| **CORS**               | Cross-origin resource sharing |
| **Morgan**             | Request logging               |

### Development Tools

| Tool               | Purpose                     |
| ------------------ | --------------------------- |
| **pnpm**           | Fast package manager        |
| **Monorepo**       | Workspace management        |
| **Docker Compose** | PostgreSQL containerization |
| **ts-node-dev**    | TypeScript hot reload       |
| **Prettier**       | Code formatting             |
| **ESLint**         | Code linting                |

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- Docker & Docker Compose
- AWS Account (for S3)

### Quick Start

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd test-task
   pnpm install
   ```

2. **Environment Setup**

   Create `.env` in root:

   ```env
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=admin
   POSTGRES_DB=ovasight_db
   ```

   Create `server/.env`:

   ```env
   DATABASE_URL="postgresql://admin:admin@localhost:5432/ovasight_db?schema=public"
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_BUCKET_NAME=your_bucket
   PORT=4000
   NODE_ENV=development
   ```

   Create `client/.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. **Start Database**

   ```bash
   docker-compose up -d
   ```

4. **Initialize Database**

   ```bash
   cd server
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Run Development Servers**

   Terminal 1 - Backend:

   ```bash
   cd server
   pnpm dev
   ```

   Terminal 2 - Frontend:

   ```bash
   cd client
   pnpm dev
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:4000
   - Health: http://localhost:4000/health

## 📡 API Endpoints

### Businesses

```http
POST   /api/businesses              # Create business
GET    /api/businesses?page=1&limit=10  # List businesses
```

### Reports

```http
POST   /api/reports                 # Submit report (multipart/form-data)
GET    /api/reports?page=1&limit=12      # List all reports
GET    /api/reports/business/:id?page=1  # List by business
```

### Request Examples

**Create Business:**

```json
POST /api/businesses
{
  "name": "Tech Startup Inc",
  "ownerName": "John Doe",
  "ownerPhone": "+1234567890",
  "category": "Technology",
  "city": "San Francisco"
}
```

**Submit Report:**

```
POST /api/reports (multipart/form-data)
FormData:
- businessId: 1
- sales: 1500.50
- expenses: 800.25
- customerCount: 45
- notes: "Great day!" (optional)
- image: [file]
- video: [file] (optional)
```

## 📁 Project Structure

```
test-task/
├── client/                 # Next.js Frontend
│   ├── app/               # App Router pages
│   │   ├── dashboard/     # Diaspora dashboard
│   │   └── reports/       # Business owner portal
│   ├── components/        # React components
│   │   ├── ui/           # ShadCN components
│   │   └── *.tsx         # Feature components
│   ├── services/         # API client services
│   ├── types/            # TypeScript types
│   └── lib/              # Utilities & config
│
├── server/                # Express Backend
│   ├── prisma/           # Database schema
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Express middleware
│   │   ├── config/       # Environment config
│   │   └── lib/          # Database client
│   └── package.json
│
└── docker-compose.yml    # PostgreSQL setup
```

## 🎨 Key Features Explained

### Optimistic Updates

- Instant UI feedback when creating businesses/reports
- Data appears immediately without waiting for server
- Automatic rollback on errors
- Seamless user experience

### Infinite Scroll

- No pagination buttons
- Automatic loading as you scroll
- Loading indicators
- "All loaded" message at end

### Multi-Select Filtering

- Click business chips to toggle filters
- Filter by multiple businesses simultaneously
- Combined and sorted results
- Clear all filters option

### Media Management

- AWS S3 cloud storage
- Secure file uploads
- In-app media viewer with zoom/pan
- Download functionality
- Support for images and videos

### Form Validation

- Client-side validation with Zod
- Server-side validation with Zod
- Real-time error messages
- File size validation
- Type-safe throughout

### Responsive Design

- Mobile-first approach
- Adaptive layouts (1-3 columns)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🎯 Database Schema

```prisma
model Business {
  id         Int      @id @default(autoincrement())
  name       String
  ownerName  String
  ownerPhone String
  category   String
  city       String
  reports    Report[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
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

## 🔒 Security Features

- Helmet.js for HTTP security headers
- CORS configuration
- Input validation on client and server
- Type-safe database queries (prevents SQL injection)
- File type and size validation
- Environment variable validation
- Error handling without exposing internals

## 🎨 Design System

- **Color Palette**: Slate, Blue, Cyan, Emerald, Teal, Rose, Purple
- **Gradients**: Modern multi-color gradients throughout
- **Shadows**: Layered shadows with color tints
- **Typography**: Inter font, gradient text effects
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions, hover effects, pulse animations
- **Glassmorphism**: Backdrop blur effects for modern aesthetics

## 📦 Available Commands

```bash
# Root commands
pnpm dev          # Start both client and server
pnpm build        # Build for production
pnpm format       # Format code with Prettier

# Server commands
cd server
pnpm dev          # Start backend dev server
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio

# Client commands
cd client
pnpm dev          # Start frontend dev server
pnpm build        # Build for production
```

## 🐛 Common Issues

**Port in use:** `lsof -ti:4000 | xargs kill -9` (or 3000 for frontend)

**Database connection failed:** `docker-compose restart postgres`

**Prisma out of sync:** `cd server && pnpm db:generate`

## 📝 Notes

This project demonstrates:

- ✅ Full-stack TypeScript application
- ✅ Modern React patterns (Server Components, Hooks)
- ✅ Type-safe API with validation
- ✅ Cloud storage integration (AWS S3)
- ✅ Professional UI/UX design
- ✅ Responsive, mobile-friendly design
- ✅ Real-time data updates
- ✅ Optimized performance (infinite scroll, caching)

---

**Built with ❤️ using Next.js, Express, TypeScript, and PostgreSQL**
