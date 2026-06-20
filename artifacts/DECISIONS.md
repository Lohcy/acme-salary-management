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