# LearnAI Frontend

**AI-Powered Learning Difficulty Classification and Personalized Learning Recommendation System**

A production-grade React + TypeScript frontend for an intelligent educational platform that assesses students across five cognitive domains, classifies learning difficulty profiles using ML, and delivers personalized learning recommendations.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| React Router DOM v6 | Routing |
| Zustand | State management |
| Axios | HTTP client |
| TanStack Query | Server state |
| Recharts | Data visualizations |
| Lucide React | Icons |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or extract the project
cd learnai-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Demo Accounts

Use these credentials on the Login page to explore each role:

| Role | Email | Password |
|---|---|---|
| Student | alex@student.edu | demo |
| Teacher | swilliams@school.edu | demo |
| Admin | admin@learnai.edu | demo |

---

## Project Structure

```
src/
├── api/              # Axios client and API services
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Card, Badge…)
│   └── shared/       # Sidebar, Navbar
├── layouts/          # DashboardLayout, PublicLayout
├── lib/              # Utilities (cn, formatters…)
├── mock/             # Mock data for development
├── pages/
│   ├── public/       # Landing, Login, Register, About…
│   ├── student/      # Dashboard, Assessment, Results, Recommendations…
│   ├── teacher/      # Dashboard, Students, Analytics, Reports…
│   └── admin/        # Dashboard, Users, System, Logs…
├── routes/           # React Router setup + ProtectedRoute
├── store/            # Zustand stores (auth, assessment, ui)
├── styles/           # Global CSS + Tailwind base
└── types/            # TypeScript type definitions
```

---

## Key Features

### Assessment Engine
- Multi-domain timed assessment (Mathematics, Grammar, Reading, Memory, Reasoning)
- Per-question countdown timer
- Pause/resume functionality
- Progress tracking across domains
- AI analysis loading state

### AI Classification Results
- Difficulty profile classification (6 categories)
- Confidence scoring
- Risk level indicators
- Radar chart cognitive profile
- Domain accuracy bar charts
- Strengths and weaknesses breakdown

### Recommendation Engine
- Personalised material cards with match scores
- Format icons (video, worksheet, interactive, etc.)
- Bookmarking, progress tracking
- Domain and format filtering
- Search

### Role-Based Access
- **Student**: Assessments, results, recommendations, progress, library
- **Teacher**: Student monitoring, class analytics, reports
- **Admin**: User management, platform analytics, system monitoring, audit logs

### Accessibility
- Dyslexia-friendly font mode
- High contrast mode
- Adjustable font sizes (SM/MD/LG/XL)
- Reduced motion support
- ARIA labels throughout
- Keyboard navigable

### Dark Mode
- Light / Dark / System preference

---

## Backend Integration

The frontend is configured to connect to a backend API at:

```
http://localhost:5000/api
```

Update `VITE_API_URL` in a `.env` file to change this:

```env
VITE_API_URL=http://your-backend-url/api
```

All API calls use **mock data** by default while the backend is not running.

---

## Build for Production

```bash
npm run build
npm run preview
```

---

## Research Context

This platform is the frontend implementation for an academic research project studying AI-powered learning difficulty classification among school-age students (8–16) in Ghana. The assessment instrument is grounded in five validated public datasets:

- **ARC** — Reasoning (Clark et al., 2018)
- **CoLA** — Grammar (Warstadt et al., 2019)
- **RACE** — Reading Comprehension (Lai et al., 2017)
- **TIMSS** — Mathematics (IEA)
- **Cambridge Brain Sciences** — Memory

The classification engine uses Logistic Regression, Random Forest, SVM, and XGBoost models.
