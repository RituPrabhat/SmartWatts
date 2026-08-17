# SmartWatts

Most electricity bills only tell you the total amount due, not where the money actually went. You don't find out that the AC or geyser is the real culprit until the bill has already arrived — and by then it's too late to do anything about it.

SmartWatts fixes that by working backwards from your appliances instead of forwards from your bill. You log what you own and how you use it — a fridge running all day, an AC for four hours a night, a washing machine twice a week — and SmartWatts turns that into an estimated bill using real slab-based tariff rates, shows you which appliances are driving the cost, and lets an AI assistant explain the numbers and suggest concrete ways to cut them, before the actual bill shows up.

Live demo: https://smart-watts-psi.vercel.app

## Example: how it plays out for a real household

Say you set a monthly budget of ₹2,500 and add your appliances — a 1.5-ton AC, a refrigerator, a washing machine, a few lights and fans. Each week you log roughly how long each one ran. SmartWatts:

1. Converts that usage into units (kWh) per appliance and in total.
2. Runs the total through a slab-based tariff calculator (the same tiered-pricing structure electricity boards actually use) to estimate your bill so far.
3. Shows on the dashboard that, say, the AC alone accounts for 60% of your projected bill, well before the meter reading happens.
4. Flags that you're on track to cross your ₹2,500 budget by the third week of the month.
5. Lets you ask the AI assistant "how do I bring this down?" and get a specific answer, like "reduce AC usage by 1 hour a day to save around ₹300 this month," rather than a generic tip.

That loop — log usage, see the projected cost broken down by appliance, get budget warnings and AI advice before the bill arrives — is the core idea behind SmartWatts.

## Features

- **Appliance tracking** — add appliances with their wattage, usage hours per day, and days per week; mark them active or on standby.
- **Usage logging** — log weekly usage per appliance and see units consumed and cost, including weekly trend charts.
- **Bill estimation** — slab-based tariff calculation engine (modeled on Delhi electricity tariffs) that estimates your monthly and weekly bill from actual usage, with month-length-aware projections.
- **Subsidy toggle** — mark whether your electricity connection is opted into the government subsidy scheme, and your bill is recalculated accordingly (100% off up to 200 units, 50% off up to 400 units, capped at ₹800/month).
- **Dashboard & analytics** — aggregated stats, appliance breakdown, and consumption charts.
- **Budget tracking** — set a monthly budget and monitor spend against it.
- **AI assistant (Google Gemini)** — chat with an assistant about your usage, get automated insights, monthly reports, alerts, and personalized budget advice.
- **Authentication** — email/password signup and login secured with JWT and bcrypt-hashed passwords.

## Tech Stack

**Frontend**
- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4
- Zustand for state management
- Recharts for data visualization
- shadcn/ui components with lucide-react icons

**Backend**
- Node.js with Express 5
- MongoDB with Mongoose
- JWT-based authentication with bcrypt password hashing
- Google Generative AI (Gemini) for the AI features

## Project Structure

```
SmartWatts/
├── frontend/           Next.js application
│   ├── app/            Routes: (app)/dashboard, analytics, devices, savings, settings, support, login, signup
│   ├── components/     UI, dashboard, and AI-widget components
│   ├── hooks/          Shared React hooks
│   └── lib/            API client, auth, state stores, types
└── backend/            Express REST API
    ├── config/         Database connection
    ├── models/         User, Appliance, UsageLog
    ├── routes/         auth, appliance, usage, dashboard, ai
    ├── controllers/    Route handlers
    ├── services/       Tariff calculation and AI service logic
    ├── middleware/      Auth guard and error handling
    └── validators/      Request validation
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (e.g. MongoDB Atlas)
- A Google Gemini API key (for the AI features)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Optionally set the backend URL (defaults to `http://localhost:5000`):

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Other Frontend Scripts

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # lint the codebase
```

## API Overview

All backend routes are prefixed with `/api`:

- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` — authentication
- `PUT /api/auth/subsidy` — toggle whether the user's connection has the government subsidy applied
- `GET|POST|PUT|DELETE /api/appliances` — manage appliances
- `POST /api/usage`, `GET /api/usage/weekly-trend` — usage logging and trends
- `GET /api/dashboard` — aggregated dashboard stats
- `POST /api/ai/chat`, `GET /api/ai/insights`, `GET /api/ai/monthly-report`, `GET /api/ai/alerts`, `POST /api/ai/budget-advice` — AI-powered features

## Contributing

Contributions are welcome. Please open an issue or pull request describing the change you'd like to make.
