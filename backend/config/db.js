const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize a local SQLite file database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDB = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create the core employees table
      db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          job_title TEXT NOT NULL,
          department TEXT NOT NULL,
          country TEXT NOT NULL,
          salary REAL NOT NULL
        )
      `, (err) => {
        if (err) return reject(err);
      });

      // Create indexes for efficient querying and filtering
      db.run('CREATE INDEX IF NOT EXISTS idx_department ON employees(department)');
      db.run('CREATE INDEX IF NOT EXISTS idx_country ON employees(country)', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};

module.exports = { db, initDB };