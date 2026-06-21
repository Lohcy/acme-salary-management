# 🏗️ System Architecture

This document outlines the high-level architecture and data flow for the ACME Salary Management Dashboard. The system is designed with a clear separation of concerns, utilizing containerization to isolate the frontend client, the backend API, and the data layer.

## High-Level Data Flow

The following diagram illustrates the lifecycle of a user request, from the React UI down to the SQLite database and back.

```mermaid
graph TD
    %% Custom Styling Classes
    classDef actor fill:#ececff,stroke:#9370db,stroke-width:2px;
    classDef frontend fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef data fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef ops fill:#fafafa,stroke:#9e9e9e,stroke-width:2px,stroke-dasharray: 5 5;

    User((HR Manager)):::actor

    subgraph "Operations & Security"
        EnvFiles[.env Configuration<br/>Secret Injection]:::ops
        QA[Automated Test Suite<br/>Vitest & Jest]:::ops
    end

    subgraph "Production Deployment (Docker Compose)"
        
        subgraph "UI Presentation Layer (Nginx :80)"
            Nginx[Nginx Web Server]:::frontend
            UI[React 18 + Tailwind v4]:::frontend
            Hooks[Custom Hooks<br/>useViewportSizing]:::frontend
            Axios[Axios Client]:::frontend
            
            Nginx -.->|Serves Static Build| UI
            UI <-->|State Management| Hooks
            Hooks -->|Trigger Fetches| Axios
        end

        subgraph "API Service Layer (Node.js :5001)"
            Express[Express Router]:::backend
            Security[Global Middleware<br/>CORS, Error Handler]:::backend
            Validator[Fail-Fast Validator<br/>Pagination & Types]:::backend
            Controller[Data Controllers]:::backend
            
            Express --> Security
            Security --> Validator
            Validator -->|Sanitized Payload| Controller
        end

        subgraph "Persistence Layer"
            SQLite[(SQLite3 Database)]:::data
            Seed[Seed Script<br/>10,000 Records]:::data
            
            Seed -.->|Initializes| SQLite
        end
    end

    %% Network Connections
    User -->|Interacts via Browser| UI
    Axios -->|HTTP GET JSON| Express
    Controller <-->|Offset/Limit SQL Queries| SQLite

    %% Operations Injection
    EnvFiles -.->|Build-time Injection| UI
    EnvFiles -.->|Runtime Injection| Express
    QA -.->|Validates DOM| UI
    QA -.->|Validates Endpoints| Express