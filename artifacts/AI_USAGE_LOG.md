# AI Usage & Prompt Log

This document tracks the intentional use of AI tools to accelerate boilerplate generation while enforcing strict architectural standards and code quality.

### Task 1: Database Scaffolding & Seed Optimization
**Date:** June 20, 2026
**Tool:** Gemini
**Prompt Used:** "Design a SQLite database schema for an employee salary management system. I need a Node.js script using faker.js to generate and insert 10,000 mock records. Focus on how to do this efficiently."

**Engineering Modifications & Judgment:**
The raw AI output generated a standard `INSERT` loop which performed poorly. I refactored the script to utilize a database transaction block for bulk inserting. Additionally, I manually appended `CREATE INDEX` statements for the `country` and `department` fields to guarantee fast read queries for the analytical dashboard.