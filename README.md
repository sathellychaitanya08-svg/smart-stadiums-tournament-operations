# ArenaOps: Smart Stadiums & Tournament Operations Platform

ArenaOps is an enterprise-grade high-availability operations center designed for modern stadium facilities and tournament coordination. Built with an optimized full-stack architecture combining a robust **Express** backend and **React + Vite** frontend, ArenaOps is engineered to run in high-performance containers with zero cold-start latency.

---

## 🏗️ System Architecture & Modularity

The application is structured around a **Micro-Operations Center** design:

1. **Client-Side SPA (React 19, Tailwind v4, Motion, Lucide Icons)**: High-performance dashboard utilizing desktop-first layout precision and responsive fluid grids.
2. **Full-Stack Express Server (Node.js CJS Bundle)**: Handles sensory integrations, auth checks, match scheduling collision validation, and server-side API proxying.
3. **Gemini AI Operations Assistant (GoogleGenAI SDK)**: A server-side conversational and predictive brain feeding on real-time stadium states to suggest active crowding reroutes, safety guides, and energy grid optimizations.
4. **Mock DB Layer (Memory Persistence Engine)**: Seeded with rich mock datasets, supporting real-time ticks, state updates, and CRUD.

---

## 🗄️ Database Schema Representation

While the platform runs a highly performant stateful mock database in production-readiness, below are the database schemas matching our data structures:

### 1. Conceptual SQL Schema (PostgreSQL)

```sql
-- Enums
CREATE TYPE match_status_enum AS ENUM ('scheduled', 'live', 'completed', 'delayed');
CREATE TYPE match_priority_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE zone_type_enum AS ENUM ('gate', 'concession', 'restroom', 'seating');
CREATE TYPE zone_status_enum AS ENUM ('normal', 'congested', 'critical');
CREATE TYPE incident_category_enum AS ENUM ('medical', 'security', 'facility', 'fire', 'crowd');
CREATE TYPE incident_severity_enum AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status_enum AS ENUM ('reported', 'investigating', 'dispatched', 'resolved');

-- Matches Table
CREATE TABLE matches (
    id VARCHAR(50) PRIMARY KEY,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    status match_status_enum DEFAULT 'scheduled',
    datetime TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 90,
    priority match_priority_enum DEFAULT 'medium',
    demand_score INTEGER DEFAULT 50,
    ticket_sales INTEGER DEFAULT 0,
    capacity INTEGER DEFAULT 55000,
    crowd_forecast INTEGER NOT NULL,
    weather_forecast VARCHAR(50) DEFAULT 'sunny',
    stadium_id VARCHAR(50) DEFAULT 'apex-coliseum',
    rest_days_home INTEGER DEFAULT 4,
    rest_days_away INTEGER DEFAULT 4,
    referee VARCHAR(100) NOT NULL
);

-- Zones Table
CREATE TABLE zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type zone_type_enum NOT NULL,
    occupancy_rate INTEGER DEFAULT 0,
    current_queue_time INTEGER DEFAULT 0,
    capacity INTEGER NOT NULL,
    current_count INTEGER DEFAULT 0,
    status zone_status_enum DEFAULT 'normal',
    alert_message TEXT
);

-- Incidents Table
CREATE TABLE incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category incident_category_enum NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    severity incident_severity_enum NOT NULL,
    status incident_status_enum DEFAULT 'reported',
    responder_allocated VARCHAR(100)
);

-- Staff Resources Table
CREATE TABLE resources (
    id VARCHAR(50) PRIMARY KEY,
    role VARCHAR(50) NOT NULL UNIQUE,
    total_staff INTEGER NOT NULL,
    allocated INTEGER NOT NULL,
    on_duty INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'optimal'
);
```

### 2. Prisma Schema ORM Declarations

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Match {
  id              String   @id @default(uuid())
  homeTeam        String
  awayTeam        String
  status          String   @default("scheduled") // scheduled, live, completed
  datetime        DateTime
  durationMinutes Int      @default(90)
  priority        String   @default("medium")
  demandScore     Int      @default(50)
  ticketSales     Int      @default(0)
  capacity        Int      @default(55000)
  crowdForecast   Int
  weatherForecast String   @default("sunny")
  stadiumId       String   @default("apex-coliseum")
  restDaysHome    Int      @default(4)
  restDaysAway    Int      @default(4)
  referee         String
}

model Zone {
  id               String  @id
  name             String
  type             String  // gate, concession, restroom, seating
  occupancyRate    Int     @default(0)
  currentQueueTime Int     @default(0)
  capacity         Int
  currentCount     Int     @default(0)
  status           String  @default("normal")
  alertMessage     String?
}

model Incident {
  id                 String   @id @default(uuid())
  title              String
  category           String
  description        String?
  location           String
  timestamp          DateTime @default(now())
  severity           String
  status             String   @default("reported")
  responderAllocated String?
}
```

---

## ⚡ API Endpoint Routing Mapping

The Express backend implements the following clean JSON REST APIs:

### Authentication
* `POST /api/auth/login`: Verifies user credentials and issues JWT token info.
* `GET /api/auth/me`: Validates authorization headers and returns operator profiles.

### Tournament Scheduling
* `GET /api/matches`: Fetches the array of booked tournament fixtures.
* `POST /api/matches`: Adds a new match slot. It triggers athlete fatigue rules (rest days >= 3) and stadium double-booking overlaps.
* `POST /api/matches/validate`: Checks scheduling constraints prior to booking.
* `POST /api/matches/ai-optimize`: Reschedules weather/demand conflicts automatically based on AI rules.

### Crowd Intelligence
* `GET /api/zones`: Evaluates real-time occupancy and wait times for concourses/gates.
* `PUT /api/zones/:id`: Simulates active sensor inputs or overrides gate capacities manually.
* `POST /api/stadium/simulate-tick`: Mimics active IoT sensory streams, fluctuating queues, and entry rates dynamically.

### Security Monitoring
* `GET /api/incidents`: Evaluates all reported facility and crowd safety dispatches.
* `POST /api/incidents`: Creates a new emergency ticket (dispatching active patrols).
* `PUT /api/incidents/:id`: Resolves or updates incidents.
* `POST /api/security/ai-risk-prediction`: Dynamically queries **Gemini AI** to calculate security threat ratings (0-100) and draft tactical protocols.

### Resource & Grid Control
* `GET /api/resources`: Audits active personnel limits and allocations on the floor.
* `PUT /api/resources/:role`: Reallocates security chiefs, medics, and stewards to critical zones.
* `POST /api/utility/saving-mode`: Engages or disengages stadium **Eco-Savings Mode** (saving energy and pressure).

---

## 🤖 Gemini AI Capabilities Integrated
* **Co-Pilot Operations Assistant**: Reads the current operational state from the memory model and answers conversational queries natively, suggesting dynamic crowd bypass channels.
* **Security Threat Risk Predictions**: Evaluates high-intensity supporter friction, active alerts, and weather anomalies, compiling them into a tactical response guide.
* **Responder Guideline Generation**: Formulates tailored, concise checklists for first-responders based on logged medical/facility hazards.
* **AI Executive Summary Core**: Generates deep operations, security, sustainability, and resource summaries natively based on active metrics.

---

## ♿ WCAG 2.1 AA Accessibility Compliance
ArenaOps features full client-side accessibility overrides mapped to WCAG 2.1 AA requirements:
* **High Contrast Contrast Mode**: Dynamically changes background-to-text contrast ratios to meet strict visual compliance (> 4.5:1 ratio).
* **Dynamic Font Scaling**: Offers live client-side text scaling from 100% up to 150% without breaking fluid responsive layout margins.
* **Visible Focus Indicators**: Enhances active tab-focus indicators using bold high-contrast outlines for keyboard-only operators.
* **Voice Narration Hub & Screen Reader Simulation**: Synthesizes and logs custom text announcements for critical alerts and match events, allowing a visual simulated feedback ticker of assistive speech output.

---

## 🔒 Enterprise Security & Audit Logging
* **Dynamic Access Health Auditing**: Real-time REST endpoints (`GET /api/security/audit-logs`) expose a secure record of all administrative activities (resource dispatches, scheduling updates, eco toggles).
* **Checklist Enforcement Verification**: Displays automated checklists verifying RBAC enforcement, IP rate capping, and AES-256 GCM telemetry encryption.
* **Real-time Live Logs Console**: Integrates a dynamic live streaming console feeding from mutations so operations supervisors retain immediate operational security transparency.

---

## 🧪 Testing Coverage Outcomes
A comprehensive test suite is compiled and run inside `/src/tests/arenaops.test.ts`. All assertions pass cleanly:
* ✅ **Team Rest Fatigue Check**: Rejects Red Wings vs Blue Eagles when rest days = 1.
* ✅ **Overlapping Buffer Check**: Rejects Cavalier vs Saber due to overlapping times with Live Match.
* ✅ **IoT Sensory Ticks Check**: Verifies simulation changes occupancy percentages without altering core layout structures.
* ✅ **Eco-Savings Grid Check**: Assures power limit boundaries adapt cleanly.
* ✅ **AI Optimizer Check**: Verifies severe thunderstorms re-arrange matches safely.
