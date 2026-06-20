# ACME Salary Management System

This repository contains an end-to-end web application designed to help ACME's HR team manage and analyze salary data for 10,000 global employees. The solution prioritizes high-performance data retrieval and clear architectural boundaries using a Node.js and React stack.

## 🚀 Readiness Links
* **Live Deployment:** [Insert Vercel/Render Link Here]
* **Video Walkthrough:** [Insert Loom/YouTube Link Here]

---

## 📂 Required Artifacts
All planning, architectural decisions, and AI usage logs required by the assessment are located in the `/artifacts` directory.
* [Product Requirements Document (PRD)](./artifacts/PRD.md)
* [Architecture & Engineering Decisions](./artifacts/DECISIONS.md)
* [AI Usage & Prompt Log](./artifacts/AI_USAGE_LOG.md)

---

## 🛠️ Technical Stack
* **Frontend:** ReactJS (Vite) for rapid, component-driven UI development.
* **Backend:** Node.js with Express for lightweight API routing.
* **Database:** SQLite with optimized bulk seeding and B-Tree indexing.
* **Testing:** Jest and Supertest for deterministic API validation.

---

## 💻 Local Setup Instructions

**Prerequisites:** Node.js (v18+) and npm installed on your machine.

**Backend Setup & Seeding:**
The backend uses a local SQLite file. You must run the seed script first to generate the 10,000 employee records.

\`\`\`bash
cd backend
npm install
npm run seed
npm run dev
\`\`\`
The backend will start on http://localhost:5000.

**Frontend Setup:**
In a separate terminal window, initialize the React client.

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## 🧪 Testing
Unit tests are configured to validate core analytical functions and API responses. 

\`\`\`bash
cd backend
npm run test
\`\`\`