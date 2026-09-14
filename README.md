<div align="center">

# ⚒️ LinkForge

**High-Performance URL Shortener & Link Analytics Platform**

Built with FastAPI · React 19 · PostgreSQL · Docker

[![Live Demo](https://img.shields.io/badge/Live-linkforge--backend-q6n1.onrender.com-0A2E23?style=for-the-badge&logo=render&logoColor=white)](https://linkforge-backend-q6n1.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-pratham6306%2Furl__shortner-181717?style=for-the-badge&logo=github)](https://github.com/pratham6306/url_shortner)
[![License](https://img.shields.io/badge/License-MIT-2D6A4F?style=for-the-badge)](LICENSE)

<br />

<img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.141-009688?style=flat-square&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Render-Blueprint-46E3B7?style=flat-square&logo=render&logoColor=black" />

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Base62 Short Code Engine](#-base62-short-code-engine)
- [Deployment](#-deployment)
- [Database Migrations](#-database-migrations)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**LinkForge** is a production-grade URL shortener that transforms long, complex URLs into concise, analytics-enabled short links. Unlike traditional URL shorteners that use random string generation, LinkForge employs a **deterministic Base62 encoding algorithm** powered by Knuth's multiplicative hashing — producing collision-free, non-sequential short codes with zero retry overhead.

Every shortened link is attributed to an authenticated user, enabling a full-featured **per-user analytics dashboard** with click tracking, link expiration management, and instant QR code generation.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔗 **Deterministic Short Codes** | Base62-encoded IDs via Knuth multiplicative hashing — 50B+ unique codes, zero collisions |
| 🔐 **JWT Authentication** | Secure registration & login with Argon2id password hashing and bearer token auth |
| 📊 **Per-User Analytics** | Track total links created, cumulative redirect clicks, and active (non-expired) links |
| ⏰ **Link Expiration** | Optional expiry timestamps with automatic `410 Gone` enforcement on redirect |
| 📱 **Instant QR Codes** | Generate high-resolution SVG QR codes for any short link with one click |
| 🎨 **Editorial Design System** | Custom sage/forest green (`#0A2E23`, `#2D6A4F`) + off-white (`#F6F4EE`) theme |
| 🐳 **Docker-Ready** | Multi-stage Docker builds with Docker Compose for one-command local development |
| ☁️ **Cloud-Native Deployment** | Render Blueprint (`render.yaml`) for automated provisioning of DB + backend + frontend |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Client Browser                               │
│                                                                     │
│  ┌──────────────────────┐        ┌────────────────────────────────┐ │
│  │  React 19 SPA (Vite) │───────▶│  Nginx Reverse Proxy (:80)    │ │
│  │  • AuthForm          │        │  • Serves /usr/share/nginx/html│ │
│  │  • Dashboard         │        │  • Proxies /api/* → Backend    │ │
│  │  • QR Modal          │        └──────────┬─────────────────────┘ │
│  └──────────────────────┘                   │                       │
└─────────────────────────────────────────────┼───────────────────────┘
                                              │ HTTPS
┌─────────────────────────────────────────────┼───────────────────────┐
│                      Backend Server         │                       │
│                                             ▼                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              FastAPI Application (Uvicorn)                   │   │
│  │                                                              │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐   │   │
│  │  │  Auth API    │  │  URLs API   │  │  Redirect Engine   │   │   │
│  │  │  /api/v1/auth│  │  /api/v1/urls│  │  GET /{short_code} │   │   │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────┬──────────┘   │   │
│  │         │                │                    │              │   │
│  │  ┌──────▼────────────────▼────────────────────▼──────────┐   │   │
│  │  │              Service Layer                             │   │   │
│  │  │  AuthService (JWT + Argon2) │ URLService (Base62)      │   │   │
│  │  └──────────────────┬─────────────────────────────────────┘   │   │
│  │                     │                                         │   │
│  │  ┌──────────────────▼─────────────────────────────────────┐   │   │
│  │  │              Repository Layer                           │   │   │
│  │  │  UserRepository          │  URLRepository               │   │   │
│  │  └──────────────────┬─────────────────────────────────────┘   │   │
│  │                     │  asyncpg                                │   │
│  └─────────────────────┼────────────────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────────┐
│                    PostgreSQL 16                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │   users table   │  │   urls table   │  │  urls_id_seq sequence  │ │
│  │  id, email,     │◀─│  id, user_id,  │  │  (Base62 source)       │ │
│  │  password_hash, │  │  original_url, │  └────────────────────────┘ │
│  │  created_at     │  │  short_code,   │                             │
│  └────────────────┘  │  click_count,  │                             │
│                      │  created_at,   │                             │
│                      │  expires_at    │                             │
│                      └────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **[FastAPI](https://fastapi.tiangolo.com/)** | Async Python web framework with OpenAPI docs |
| **[SQLAlchemy 2.0](https://www.sqlalchemy.org/)** | Async ORM with mapped column declarations |
| **[asyncpg](https://github.com/MagicStack/asyncpg)** | High-performance async PostgreSQL driver |
| **[Alembic](https://alembic.sqlalchemy.org/)** | Database schema migration management |
| **[Pydantic v2](https://docs.pydantic.dev/)** | Request/response validation with `EmailStr` |
| **[PyJWT](https://pyjwt.readthedocs.io/)** | JSON Web Token generation & verification |
| **[pwdlib](https://github.com/frankie567/pwdlib)** (Argon2) | Modern password hashing (Argon2id) |
| **[Uvicorn](https://www.uvicorn.org/)** | Lightning-fast ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **[React 19](https://react.dev/)** | Component-based UI library |
| **[Vite 6](https://vitejs.dev/)** | Next-generation build tool & dev server |
| **[Lucide React](https://lucide.dev/)** | Modern icon library |
| **[qrcode.react](https://github.com/zpao/qrcode.react)** | SVG QR code generation |

### Infrastructure
| Technology | Purpose |
|---|---|
| **[Docker](https://www.docker.com/)** | Multi-stage containerization |
| **[Docker Compose](https://docs.docker.com/compose/)** | Multi-container orchestration |
| **[Nginx](https://nginx.org/)** | Static file serving & reverse proxy |
| **[Render](https://render.com/)** | Cloud deployment (Blueprint IaC) |
| **[PostgreSQL 16](https://www.postgresql.org/)** | Production relational database |

---

## 📁 Project Structure

```
url_shortner/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py              # Auth endpoints (register, login, JWT middleware)
│   │   │   └── urls.py              # URL CRUD endpoints & redirect engine
│   │   ├── models/
│   │   │   ├── url.py               # URL ORM model (urls table)
│   │   │   └── user.py              # User ORM model (users table)
│   │   ├── repositories/
│   │   │   ├── url_repository.py    # URL data access layer
│   │   │   └── user_repository.py   # User data access layer
│   │   ├── schemas/
│   │   │   ├── auth.py              # Auth Pydantic schemas
│   │   │   └── url.py               # URL Pydantic schemas
│   │   ├── services/
│   │   │   ├── auth_services.py     # Auth business logic (Argon2 + JWT)
│   │   │   └── url_service.py       # URL shortening business logic
│   │   ├── utils/
│   │   │   └── base62.py            # Base62 encoder + Knuth hash obfuscator
│   │   ├── database.py              # Async engine, session factory, Base
│   │   └── main.py                  # FastAPI app entrypoint
│   ├── alembic/
│   │   ├── versions/                # Sequential migration scripts
│   │   └── env.py                   # Async migration runner
│   ├── alembic.ini                  # Alembic configuration
│   ├── Dockerfile                   # Python 3.11-slim production image
│   └── requirements.txt             # Pinned Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthForm.jsx         # Split-screen auth view
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── QrModal.jsx          # QR code modal dialog
│   │   │   ├── StatsOverview.jsx    # Analytics KPI cards
│   │   │   ├── UrlCard.jsx          # Link card with copy & QR
│   │   │   └── UrlShortenerForm.jsx # URL creation form
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state (React Context)
│   │   ├── services/
│   │   │   └── api.js               # HTTP client (fetch wrapper)
│   │   ├── App.jsx                  # Main dashboard layout
│   │   ├── index.css                # Design tokens & global styles
│   │   └── main.jsx                 # React DOM mount point
│   ├── public/
│   │   └── _redirects               # SPA redirect rules
│   ├── Dockerfile                   # Multi-stage Node + Nginx image
│   ├── nginx.conf                   # Nginx reverse proxy config
│   └── package.json                 # Node.js dependencies
├── docker-compose.yaml              # Local multi-container orchestration
├── render.yaml                      # Render Blueprint IaC
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (recommended) — or:
- **Python 3.11+** and **Node.js 20+** for manual setup
- **PostgreSQL 16** (local or cloud instance)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/pratham6306/url_shortner.git
cd url_shortner

# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv env
env\Scripts\activate          # Windows
# source env/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
echo DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/url_shortener > .env
echo SECRET_KEY=your-secret-key-here >> .env

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Access at http://localhost:5173
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Create a new user account | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate and receive JWT token | ❌ |

### URL Management

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/urls` | Create a new short URL | 🔒 Bearer |
| `GET` | `/api/v1/urls/my-urls` | Retrieve all URLs for current user | 🔒 Bearer |
| `GET` | `/{short_code}` | Redirect to original URL (public) | ❌ |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health check |

### Example: Create Short URL

```bash
# Register
curl -X POST https://your-domain.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'

# Login
TOKEN=$(curl -s -X POST https://your-domain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}' | jq -r '.access_token')

# Shorten a URL
curl -X POST https://your-domain.com/api/v1/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"original_url": "https://example.com/very/long/url", "expires_at": "2027-01-01T00:00:00Z"}'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "original_url": "https://example.com/very/long/url",
  "short_code": "4vnCZo",
  "short_url": "https://your-domain.com/4vnCZo",
  "click_count": 0,
  "created_at": "2026-09-13T16:30:00Z",
  "expires_at": "2027-01-01T00:00:00Z"
}
```

> 📖 **Interactive API documentation** is available at `/docs` (Swagger UI) and `/redoc` (ReDoc).

---

## 🧮 Base62 Short Code Engine

LinkForge uses a **deterministic, collision-free** short code generation algorithm instead of random strings:

```
Database Sequence ID  →  Knuth Multiplicative Hash  →  Base62 Encode  →  Short Code
        1             →       2920541925             →    "2xPQk9"     →   ✅ Unique
        2             →       1280573399             →    "1dN6Ln"     →   ✅ Unique
        3             →       3935606873             →    "4vnCZo"     →   ✅ Unique
```

### How It Works

1. **PostgreSQL Sequence** (`urls_id_seq`) provides a monotonically increasing integer
2. **Knuth's Multiplicative Hashing** scrambles the ID into a non-sequential 32-bit integer:
   ```python
   val = ((id + 100000) * 2654435769) & 0xFFFFFFFF
   val ^= (val >> 16)
   ```
3. **Base62 Encoding** converts the scrambled integer to a compact alphanumeric string using `[0-9a-zA-Z]`

### Why This Approach?

| Property | Random Generation | LinkForge (Base62) |
|---|---|---|
| Collision Risk | Requires retry loops | **Zero** — bijective mapping |
| DB Lookups | Check-before-insert | **None** — guaranteed unique |
| Reversibility | One-way | **Fully reversible** |
| Code Space | ~56B (6 chars) | **~50B+** (5–6 chars) |
| Latency | Variable (retries) | **O(1) constant time** |

---

## ☁️ Deployment

### Render (Blueprint — Recommended)

The project includes a `render.yaml` Blueprint that provisions all infrastructure automatically:

1. **Fork/Clone** this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Blueprint**
3. Connect your repository (`pratham6306/url_shortner`)
4. Click **Apply** — Render will automatically provision:
   - 🗄️ **PostgreSQL Database** (free tier)
   - ⚙️ **Backend Web Service** (Docker, free tier)
   - 🎨 **Frontend Web Service** (Docker, free tier)

### Docker Hub Images

Pre-built images are available on Docker Hub:

```bash
docker pull pratham6306/linkforge-backend:latest
docker pull pratham6306/linkforge-frontend:latest
```

---

## 🗃 Database Migrations

Migrations are managed with Alembic and run automatically on container startup:

| Revision | Description |
|---|---|
| `31ab83979b98` | Create `urls` table with short code and click tracking |
| `e8c736802de0` | Add `created_at` and `expires_at` timestamps |
| `cdafc0f830b2` | Create `users` table with email and Argon2 password hash |
| `443251802067` | Add `user_id` foreign key to `urls` with cascade delete |

```bash
# Run migrations manually
cd backend
alembic upgrade head

# Create a new migration
alembic revision --autogenerate -m "description"

# View migration history
alembic history
```

---

## 🔐 Environment Variables

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | `postgresql+asyncpg://postgres:postgres@localhost:5433/url_shortener` | PostgreSQL connection string |
| `SECRET_KEY` | ✅ | `secret-key-for-jwt-authentication-url-shortener` | JWT signing secret |
| `BASE_URL` | ❌ | Auto-detected from request headers | Base URL for generated short links |

### Frontend

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | ❌ | `http://localhost:8000` (dev) | Backend API base URL |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Pratham](https://github.com/pratham6306)**

<sub>⚒️ Forge Smarter Links. Deterministic Speed.</sub>

</div>
