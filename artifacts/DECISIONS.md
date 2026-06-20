# Architecture & Engineering Decisions

This document outlines the core technical trade-offs made to ensure scalability, maintainability, and a frictionless reviewer experience.

### Database Selection: SQLite vs. PostgreSQL
**Problem:** Storing and querying 10,000 records requires a reliable relational database.
**Decision:** SQLite was chosen over a dedicated server like PostgreSQL.
**Rationale:** While PostgreSQL is standard for enterprise HR software, SQLite perfectly satisfies the assessment constraints while eliminating external dependency overhead. It allows the software to be run instantly upon cloning without Docker or local server provisioning.

### Performance Bottleneck: 10,000 Record Initialization
**Problem:** Inserting 10,000 records one-by-one during the seeding phase is prohibitively slow in SQLite.
**Decision:** Implemented Database Transactions (`BEGIN TRANSACTION` / `COMMIT`) in the Node.js seed script.
**Rationale:** Wrapping the bulk insert in a single transaction reduces disk I/O operations, dropping the seed execution time from several seconds to milliseconds. 

### Query Optimization: Data Filtering
**Problem:** Filtering 10,000 rows on the frontend causes memory spikes, and full table scans on the backend degrade API response times.
**Decision:** Implemented Server-Side Pagination and B-Tree database indexing.
**Rationale:** Indexes were specifically added to the `country` and `department` columns during initialization. This ensures that the HR Manager's analytical queries execute in logarithmic time, keeping the Express API highly responsive.

### Architectural Pattern: Centralized Error Handling
**Problem:** Hardcoding HTTP status codes and error messages within controllers leads to inconsistent API responses and code duplication.
**Decision:** Implemented a centralized error handling architecture featuring a global error dictionary, a custom `AppError` class, and a global Express error-handling middleware.
**Rationale:** This guarantees a standardized, predictable JSON error contract for the frontend (e.g., `{ success: false, error: { code, message } }`). It also segregates operational errors from unhandled exceptions and conditionally masks stack traces in production, satisfying enterprise security and scalability standards.

### Defensive Programming: Request Parameter Validation
**Problem:** API endpoints are vulnerable to malformed inputs (e.g., strings instead of numbers) and malicious payload sizes. Passing these directly to the database layer can cause unhandled exceptions.
**Decision:** Implemented a dedicated validation middleware layer (`validator.js`) that sits between the Express router and the controller. 
**Rationale:** This establishes a **Fail-Fast architecture**. By strictly type-checking and bounding all incoming query parameters at the routing level, the application rejects invalid requests *before* they consume database connections. It guarantees the frontend receives a deterministic 400 Bad Request error via the centralized `AppError` handler, enforcing a strict API contract.

### Pagination Strategy & Defensive API Design
**Problem:** Serving 10,000 employee records to a React frontend requires a strategy that balances database query performance, Node.js memory allocation, and user experience (UX) within the data grid.
**Options Considered:** Client-Side Pagination (Rejected: browser freezing) vs. Cursor-Based Pagination (Rejected: prevents jumping to specific pages) vs. Offset-Based Pagination.
**Decision:** Implemented **Server-Side Offset Pagination** paired with a hard ceiling (`MAX_LIMIT = 100`).
**Rationale:** Modern React data grids require random-access page navigation. For a strictly indexed 10,000-row SQLite database, the `OFFSET` execution remains in the sub-millisecond range. The UX benefit of allowing the HR Manager to jump directly to any page outweighs the theoretical performance gain of a cursor. Furthermore, strictly capping the limit prevents intentional Denial-of-Service (DoS) queries from pulling the entire dataset into the Node.js memory heap.

### Frontend Architecture: Centralized API Service Layer
**Problem:** Making raw `axios` calls directly inside React components (`useEffect` hooks) leads to code duplication, scattered error handling, and components that are tightly coupled to network implementation details.
**Decision:** Implemented a dedicated API service layer (`frontend/src/services/api.js`) using an Axios instance.
**Rationale:** This creates a strict boundary between data fetching and UI rendering. It allows all network requests to be configured with a single `baseURL` and unified header configurations. Furthermore, if the backend routing changes or we need to implement auth-token interceptors in the future, the modifications are isolated to a single file rather than touching dozens of React components.

### Frontend Resiliency: Strict State & Mount Management
**Problem:** Asynchronous data fetching in React can lead to memory leaks if a component unmounts before the Promise resolves. Furthermore, assuming backend data is always perfectly shaped leads to silent frontend crashes (`Cannot read properties of undefined`).
**Decision:** Implemented `isMounted` tracking within `useEffect` cleanup blocks and added strict payload validation (`response?.success && response?.data`) before updating React state. 
**Rationale:** This fulfills the fail-safe UI requirement. It guarantees the application will not attempt to mutate the state of unmounted components, and it gracefully traps malformed API responses into localized Error States rather than unmounting the entire DOM tree via a raw JS exception. Used standard `Intl.NumberFormat` instead of fragile string manipulation for internationalized currency display.