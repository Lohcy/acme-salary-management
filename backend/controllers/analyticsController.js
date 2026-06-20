const { db } = require('../config/db');
const AppError = require('../utils/AppError');
const ERROR_CODES = require('../utils/errorCodes');

const getAnalytics = (req, res, next) => {
  const query = `
    SELECT 
      COUNT(*) as totalEmployees,
      SUM(salary) as totalPayroll,
      AVG(salary) as averageSalary
    FROM employees
  `;
  
  db.get(query, [], (err, row) => {
    if (err) {
      return next(new AppError(ERROR_CODES.DATABASE_ERROR, 'Failed to calculate payroll analytics.'));
    }
    
    res.json({
      success: true,
      data: row
    });
  });
};

module.exports = { getAnalytics };