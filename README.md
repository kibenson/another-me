# Another Me / 另一个我

> **Find your behavioral twin. 寻找你的行为双胞胎。**

A full-stack Next.js application where users record daily activities using preset tags, and after accumulating 20 records, the system matches them with users who have similar behavioral profiles using cosine similarity. Matched users can send pen pal requests; once accepted, they exchange emails.

---

## Features / 功能

- 🏷️ **15 Activity Tags** — Reading, Music, Gaming, Travel, Sports, Work, Cooking, Movies, Art, Coding, Fitness, Meditation, Photography, Learning, Socializing
- 🔍 **Smart Matching** — Cosine similarity algorithm on activity frequency vectors
- ✉️ **Pen Pal System** — Send/accept requests; exchange emails once connected
- 🌏 **Bilingual** — Full English + Chinese (i18n with next-intl)
- 💳 **Stripe Payments** — Premium subscription tier
- 🔐 **Auth** — Email/password with NextAuth.js v5 + bcrypt
- 📱 **Mobile-first** — Responsive Tailwind CSS design

---

## Tech Stack / 技术栈

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| Payments | Stripe Checkout + Webhooks |
| i18n | next-intl |
| Validation | Zod |

---

## Getting Started / 快速开始

### Prerequisites / 前置要求

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### 1. Clone & Install / 克隆安装

```bash
git clone <repo-url>
cd another-me
npm install
```

### 2. Environment Variables / 环境变量

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/another_me"
AUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_PRICE_ID="price_..."
```

### 3. Database Setup / 数据库设置

```bash
# Push schema to database
npm run db:push

# Seed the 15 activity tags
npm run db:seed
```

### 4. Run Development Server / 启动开发服务器

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure / 项目结构

```
another-me/
├── app/
│   ├── [locale]/               # i18n locale routes
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Register page
│   │   ├── dashboard/          # User dashboard
│   │   ├── daily/              # Daily activity logging
│   │   ├── records/            # Activity history
│   │   ├── matches/            # Matching results
│   │   ├── profile/            # Profile settings
│   │   └── pricing/            # Pricing page
│   └── api/
│       ├── auth/               # NextAuth + register
│       ├── records/            # Activity records CRUD
│       ├── matches/            # Matching API
│       ├── requests/           # Pen pal requests
│       ├── stripe/             # Checkout + webhooks
│       └── profile/            # Profile API
├── components/                 # Reusable UI components
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma singleton
│   ├── stripe.ts               # Stripe client
│   ├── matching.ts             # Cosine similarity algorithm
│   ├── tags.ts                 # Tag definitions
│   └── utils.ts                # Utilities
├── messages/
│   ├── en.json                 # English translations
│   └── zh.json                 # Chinese translations
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed
├── i18n.ts                     # next-intl config
└── middleware.ts               # i18n routing middleware
```

---

## How Matching Works / 匹配算法

1. Each user's activity records are converted to a **frequency vector** (one dimension per tag)
2. **Cosine similarity** is computed between the current user and all other eligible users (≥20 records)
3. Users with similarity ≥ 0.2 (20%) are shown as matches, sorted by similarity descending
4. Shared activity tags are highlighted to explain the match

---

## API Reference / API 参考

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `GET` | `/api/records` | Get user's records |
| `POST` | `/api/records` | Create record (5/day limit) |
| `GET` | `/api/matches` | Get cosine similarity matches |
| `GET` | `/api/requests` | Get pen pal requests |
| `POST` | `/api/requests` | Send pen pal request (3/day limit) |
| `PATCH` | `/api/requests/[id]` | Accept/reject request |
| `GET` | `/api/profile` | Get user profile |
| `PATCH` | `/api/profile` | Update profile |
| `POST` | `/api/stripe/checkout` | Create Stripe checkout session |
| `POST` | `/api/stripe/webhook` | Handle Stripe events |

---

## Deployment / 部署

### Vercel

```bash
vercel deploy
```

Set environment variables in Vercel dashboard.

### Stripe Webhook

Configure webhook endpoint: `https://your-domain.com/api/stripe/webhook`

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.deleted`

---

## License

MIT
another-me
