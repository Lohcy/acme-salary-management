const express = require('express');
const { getEmployees } = require('../controllers/employeeController');
const { validatePagination } = require('../middlewares/validator');

const router = express.Router();

router.get('/', validatePagination, getEmployees);

module.exports = router;