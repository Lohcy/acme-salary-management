const { db } = require('../config/db');
const AppError = require('../utils/AppError');
const ERROR_CODES = require('../utils/errorCodes');

const getEmployees = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const { country, department } = req.query;

  let baseQuery = 'FROM employees WHERE 1=1';
  const params = [];

  if (country) {
    baseQuery += ' AND country = ?';
    params.push(country);
  }
  if (department) {
    baseQuery += ' AND department = ?';
    params.push(department);
  }

  const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
  const dataQuery = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;

  db.get(countQuery, params, (err, countRow) => {
    if (err) {
        return next(new AppError(ERROR_CODES.DATABASE_ERROR, 'Failed to count employee records.'));
    }

    const total = countRow.total;
    db.all(dataQuery, [...params, limit, offset], (err, rows) => {
      if (err) {
        return next(new AppError(ERROR_CODES.DATABASE_ERROR, 'Failed to fetch employee records.'));
      }

      res.json({
        success: true,
        data: rows,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    });
  });
};

module.exports = { getEmployees };