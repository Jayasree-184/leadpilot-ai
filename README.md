# LeadPilot AI

> **Turn raw leads into your next best action.**

LeadPilot AI is an enterprise-grade B2B sales intelligence platform designed to replace subjective lead scoring with **explainable AI qualification**, **algorithmic prioritization**, and **hyper-personalized executive outreach**.

---
## 🔗 Live Demo

- **App:** [leadpilot-ai-green.vercel.app](https://leadpilot-ai-green.vercel.app)
- **API Health:** [leadpilot-api-st69.onrender.com/api/health](https://leadpilot-api-st69.onrender.com/api/health)

## 1. Executive Summary & Problem

Modern revenue and sales engineering teams are flooded with raw inbound leads and unstructured company databases. Traditional CRMs provide static, arbitrary point systems that fail to answer the four vital questions every sales rep has:

1. **Is this lead valuable?** (0–100 ICP Score + HOT / WARM / COLD classification)
2. **Why?** (Auditable 6-factor dimension breakdown)
3. **Who should I contact?** (Recommended decision maker and designation)
4. **What should I say?** (Next best sales action + tailored executive outreach angle)

LeadPilot AI solves this by transforming lead data into immediate, explainable revenue actions in under 10 seconds.

```
RAW LEAD
   ↓
AI ANALYSIS & ICP EVALUATION
   ↓
LEAD SCORE (0–100)
   ↓
CLASSIFICATION: HOT / WARM / COLD
   ↓
EXPLAINABLE DIMENSION BREAKDOWN (Why?)
   ↓
RECOMMENDED DECISION MAKER (Who to contact?)
   ↓
NEXT BEST ACTION & OUTREACH ANGLE (What to say?)
   ↓
ACTIONABLE 1-CLICK OUTREACH GENERATION
```

---

## 2. Key Features

- **Executive Intelligence Dashboard**: Real-time KPI cards (Total Leads, Hot, Warm, Cold, Average Score), dynamic SVG segmented priority visualization, and top opportunity cards.
- **Explainable 6-Factor AI Scoring (100 pts Rubric)**:
  - *Industry Fit (25 pts)*: SaaS, AI/Cybersecurity, Fintech, HealthTech, etc.
  - *Company Size (20 pts)*: Headcount scaling tier.
  - *Revenue Potential (20 pts)*: Annual recurring revenue volume.
  - *Technology Fit (15 pts)*: Cloud-native & modern microservices stack.
  - *Location Fit (10 pts)*: Tier-1 technology ecosystems.
  - *Growth & Operational Signals (10 pts)*: Expansion indicators.
- **Hero Lead Details Workspace**:
  - Smooth animated semi-circular score gauge with confidence ratings.
  - "Why this lead?" visual dimension progress bars.
  - "Why it matters" bulleted qualification checklist.
  - Verified decision maker card with one-click email copying.
  - Prominent *Next Best Action* and *Best Outreach Angle* strategy cards.
  - Progressive multi-step AI outreach generator with clipboard integration.
- **Main Leads Table & Intelligence Engine**:
  - Live debounced multi-field search (Company, Industry, Location, Contact) with `/` shortcut.
  - Instant filter pills by Score (80+, 60+, 40+, <40) and Category (HOT, WARM, COLD).
  - Column sorting and quick actions (Re-analyze, View, Delete).
- **4-Step CSV Import Wizard**:
  - Drag-and-drop CSV upload with downloadable sample template.
  - Automatic validation with invalid row alerts.
  - Live table preview with row detection counters.
  - Batch import with automated AI qualification toggle.
- **Filter-Aware CSV Export**:
  - Export leads to CSV directly respecting active filters and search criteria.
- **Dual-Mode AI Engine**:
  - Live mode: Powered by Google GenAI SDK (`gemini-3.7-flash`).
  - Demo mode: 100% deterministic, instant heuristic engine requiring zero API keys.
- **Zero-Friction Dual Database Support**:
  - Connects to external MongoDB (`MONGODB_URI`) when provided, or automatically boots an embedded in-memory database (`mongodb-memory-server`) for instant execution.

---

## 3. Tech Stack & Architecture

```
[ Frontend: React 19 + Vite + Tailwind CSS + Lucide Icons ]
                            │
                      REST API (JSON)
                            │
      [ Backend: Node.js + Express 4.x (ESM) ]
          │                           │
  [ Mongoose ODM ]          [ AI Service Layer ]
          │                   │             │
[ MongoDB / In-Memory ]  [ Gemini 3.7 Flash ] [ Deterministic Engine ]
```

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (Dark-first enterprise theme)
- **Icons**: Lucide React
- **Micro-Interactions**: CSS transitions, SVG stroke dash animations, canvas-confetti

### Backend
- **Runtime**: Node.js v20+ (ES Modules)
- **Framework**: Express 4.x
- **Database ODM**: Mongoose 8.x
- **Database Engine**: MongoDB / Embedded MongoMemoryServer fallback
- **AI SDK**: `@google/genai` (Official Google GenAI SDK)

---

## 4. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, database connection, AI engine mode |
| `GET` | `/api/leads` | Search, filter by category/score/location, sort, pagination |
| `GET` | `/api/leads/:id` | Fetch single lead document with full breakdown |
| `POST` | `/api/leads` | Create new lead with optional automatic AI analysis |
| `PUT` | `/api/leads/:id` | Update lead record |
| `DELETE`| `/api/leads/:id` | Delete lead by ID |
| `POST` | `/api/leads/:id/analyze` | AI qualification (utilizes cached result if already analyzed) |
| `POST` | `/api/leads/:id/reanalyze` | Force live AI re-qualification (bypasses cache) |
| `POST` | `/api/leads/import` | Bulk ingest leads from CSV preview or JSON payload |
| `GET` | `/api/leads/export` | Download CSV matching active query filters |
| `POST` | `/api/seed/reset` | Reset database to default 32 B2B demo leads |

---

## 5. Quickstart & Setup Guide

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Configure Environment

```bash
cd leadpilot-ai
cp .env.example .env
```

`.env` configuration:
```env
PORT=5000
MONGODB_URI=          # Leave blank to use embedded in-memory MongoDB
AI_API_KEY=           # Optional: Gemini API key
DEMO_MODE=true        # true = deterministic offline engine, false = live Gemini API
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Run Application

In terminal 1 (Backend):
```bash
cd server
npm start
# Server boots at http://localhost:5000
```

In terminal 2 (Frontend):
```bash
cd client
npm run dev
# App opens at http://localhost:3000
```

---

## 6. AI Scoring & Decision Framework

| Category | Score Range | Priority | Action Strategy |
| :--- | :--- | :--- | :--- |
| **HOT** | **85 – 100** | High Priority | Immediate executive outreach to CTO/CISO; focus on engineering velocity and infrastructure scaling. |
| **WARM** | **70 – 84** | Medium Priority | Engage VP Engineering / Head of Product with operational risk mitigation and peer benchmarks. |
| **COLD** | **0 – 69** | Low Priority | Automated nurture sequence; self-service product tours and educational resources. |

---

## 7. Assessment Rationale & Key Design Decisions

1. **Explainability Over Black Boxes**: B2B sales reps distrust arbitrary AI numbers. LeadPilot provides exact 6-factor points, clear "Why it matters" checklists, and distinct outreach angles.
2. **Deterministic Fallback (Demo Mode)**: Guarantees 100% test reliability even in air-gapped environments or without API keys.
3. **Zero-Friction In-Memory DB**: Automatically spins up an embedded Mongo instance if no MongoDB service is running locally.
4. **Subtle Micro-Interactions**: Smooth gauge animation, non-intrusive toasts, and progressive generation states communicate responsiveness and quality.
