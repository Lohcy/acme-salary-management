# Product Requirements Document: ACME Salary Management

## 1. Goal
Build a robust web application that enables the ACME organization's HR team to efficiently manage and analyze salary data for 10,000 global employees, replacing tedious Excel workflows.

## 2. User Persona
* **Primary User:** HR Manager at ACME Org.
* **User Needs:** Quick access to large datasets, intuitive filtering, and immediate high-level insights without relying on manual spreadsheet manipulation.

## 3. Scope & Core Features
* **Paginated Data Grid:** A high-performance table rendering 10,000 records utilizing server-side pagination.
* **Advanced Filtering:** Filter employees by attributes such as Country and Department.
* **Salary Analytics Dashboard:** A summary view providing immediate answers to HR questions (e.g., Average salary by country/department).
* **Seeding Mechanism:** Automated script to populate the database with 10,000 mock records upon initialization.

## 4. Technical Stack
* **Frontend:** ReactJS (Vite)
* **Backend:** Node.js (Express)
* **Database:** SQLite

## 5. Deliberately Left Out
* **Write/Update Operations (CRUD):** A read-heavy dashboard solves the core pain point of data retrieval. Adding full CRUD capabilities bloats the scope.
* **Authentication/Authorization:** Auth distracts from the core technical challenge of efficiently handling and querying a 10,000-record dataset.
* **Tax/Payroll Calculations:** The goal is data management, not calculating net pay across different international tax jurisdictions.