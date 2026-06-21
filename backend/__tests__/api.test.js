const request = require('supertest');
const app = require('../index');
const { db } = require('../config/db');

// Mock the SQLite database
jest.mock('../config/db', () => ({
  db: {
    get: jest.fn(),
    all: jest.fn(),
  },
}));

describe('ACME Salary Management API - Enterprise Test Suite', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/employees (Data Grid Endpoint)', () => {
    
    // --- HAPPY PATHS ---
    it('should successfully return paginated employee data', async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(null, { total: 10000 }); 
      });
      db.all.mockImplementation((query, params, callback) => {
        callback(null, [{ id: 1, first_name: 'John', department: 'Engineering' }]); 
      });

      const response = await request(app).get('/api/employees?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.meta.total).toBe(10000);
    });

    // --- FILTERING LOGIC ---
    it('should handle zero-result filter queries gracefully (Empty State)', async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(null, { total: 0 }); // No users found
      });
      db.all.mockImplementation((query, params, callback) => {
        callback(null, []); // Empty array returned from DB
      });

      const response = await request(app).get('/api/employees?department=GhostDepartment');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]); // Should be an empty array, not undefined
      expect(response.body.meta.total).toBe(0);
      expect(response.body.meta.totalPages).toBe(0);
    });

    // --- FAIL-FAST VALIDATION (DEFENSIVE PROGRAMMING) ---
    it('should return 400 Bad Request if limit exceeds the 100 maximum ceiling', async () => {
      const response = await request(app).get('/api/employees?limit=150');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ERR_VALIDATION_FAILED');
      expect(db.get).not.toHaveBeenCalled(); // Prove the DB was protected
    });

    it('should return 400 Bad Request if pagination parameters are malicious strings', async () => {
      // Testing against SQL Injection / Type confusion attempts
      const response = await request(app).get('/api/employees?page=DROP_TABLE&limit=ALL');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(db.get).not.toHaveBeenCalled();
    });

    it('should return 400 Bad Request for negative page numbers', async () => {
      const response = await request(app).get('/api/employees?page=-5');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    // --- FATAL ERROR HANDLING ---
    it('should return 500 Internal Server Error if the database connection dies', async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(new Error('Simulated SQLite thread lock'), null);
      });

      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ERR_DATABASE_OPERATION');
    });
  });

  describe('GET /api/analytics (Dashboard Endpoint)', () => {
    
    it('should successfully return organizational metrics', async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(null, { totalEmployees: 10000, totalPayroll: 1500000, averageSalary: 150 });
      });

      const response = await request(app).get('/api/analytics');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalEmployees).toBe(10000);
    });

    it('should handle analytics calculations safely when the database is completely empty', async () => {
      db.get.mockImplementation((query, params, callback) => {
        // SQLite might return null for SUM() and AVG() if table is empty
        callback(null, { totalEmployees: 0, totalPayroll: null, averageSalary: null });
      });

      const response = await request(app).get('/api/analytics');

      expect(response.status).toBe(200);
      expect(response.body.data.totalEmployees).toBe(0);
      // Ensure your backend converts those nulls to 0 so the frontend doesn't crash formatting currency
      expect(response.body.data.totalPayroll).toBeDefined(); 
    });
  });

  describe('Global Express Error Handler', () => {
    
    it('should trap unhandled routes and return a strict 404 JSON contract', async () => {
      const response = await request(app).get('/api/v2/fake-endpoint');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ERR_RESOURCE_NOT_FOUND');
    });
  });
});