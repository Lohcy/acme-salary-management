require('dotenv').config();
const express = require('express');
const cors = require('cors');

const employeeRoutes = require('./routes/employeeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001; 
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/analytics', analyticsRoutes);

// Catch-all for unhandled 404 routes
app.use((req, res, next) => {
  const AppError = require('./utils/AppError');
  const ERROR_CODES = require('./utils/errorCodes');
  next(new AppError(ERROR_CODES.RESOURCE_NOT_FOUND, `Can't find ${req.originalUrl} on this server.`));
});

// Mount the Global Error Handler AT THE VERY END
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
  });
}

module.exports = app;