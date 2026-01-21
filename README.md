# Subly - Privacy-First Subscription Manager

**Open Core** subscription tracking app with conversational AI and intelligent recurrence logic.

## 🎯 Features

### Free (Open Source)
- 💬 **Conversational Logging** - Add subscriptions via natural language chat
- 📊 **Dashboard** - Visualize spending with charts and analytics
- 🔒 **Privacy Mode** - Mask subscription names for screenshots
- ⏰ **Smart Recurrence** - Automatic payment date calculations
- 🎨 **Dark Mode** - Premium, privacy-first design

### Pro (SaaS - $3/month)
- 📧 **Email Receipt Sync** - Auto-import from forwarded receipts
- 💰 **Price Change Alerts** - Get notified of price increases/promos
- ✂️ **One-Click Cancel** - Pre-filled cancellation templates

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- PHP 8.2+ & Composer (for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/subly.git
cd subly
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Local Development (Without Docker)

#### Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
subly/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Console/Commands/     # Cron jobs
│   │   ├── Http/Controllers/     # API controllers
│   │   ├── Models/               # Database models
│   │   └── Services/             # Business logic
│   └── database/migrations/      # Database schema
├── frontend/         # Next.js UI
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities & API client
│   └── styles/       # CSS files
└── docker-compose.yml
```

## 🗄️ Database Schema

### Core Tables
- `subscriptions` - User subscriptions with billing info
- `categories` - Subscription categories (Entertainment, Utilities, etc.)
- `payment_history` - Historical payment records

## 🤖 NLP Processing

The chat interface uses:
1. **OpenAI API** (GPT-3.5) for entity extraction
2. **Regex fallback** for common patterns when API is unavailable

Example input: *"Just subbed to Netflix for 599 pesos every month"*

Extracted entities:
- Provider: Netflix
- Amount: 599
- Currency: PHP
- Cycle: Monthly

## ⚙️ Recurrence Engine

A Laravel cron job runs daily to:
1. Check for upcoming payments (next 24 hours)
2. Send notifications
3. Update `next_payment_date` after payment passes

Supports: Monthly, Yearly, Weekly, Quarterly, Bi-annual cycles.

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
npm run test
```

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 💡 Why Subly?

- **No Bank Linking** - Privacy-first, manual tracking
- **Open Source** - Self-host for free
- **Smart Automation** - NLP + cron jobs handle the complexity
- **Beautiful UI** - Premium design with dark mode

## 🔗 Links

- [Documentation](https://docs.subly.com)
- [SaaS Version](https://subly.com)
- [Report Issues](https://github.com/yourusername/subly/issues)

---

Built with ❤️ for people who value privacy and hate zombie subscriptions.
