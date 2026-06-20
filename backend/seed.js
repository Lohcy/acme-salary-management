// backend/seed.js
const { db, initDB } = require('./db');
const { faker } = require('@faker-js/faker');

const SEED_COUNT = 10000;

const seedDatabase = async () => {
  console.log('Initializing database schema...');
  await initDB();

  console.log(`Generating ${SEED_COUNT} employee records. This may take a moment...`);
  
  db.serialize(() => {
    // Wrapping the inserts in a transaction is critical for SQLite performance
    db.run('BEGIN TRANSACTION');

    const stmt = db.prepare(`
      INSERT INTO employees (first_name, last_name, job_title, department, country, salary)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < SEED_COUNT; i++) {
      stmt.run(
        faker.person.firstName(),
        faker.person.lastName(),
        faker.person.jobTitle(),
        faker.commerce.department(),
        faker.location.country(),
        faker.number.int({ min: 30000, max: 250000 })
      );
    }

    stmt.finalize();

    db.run('COMMIT', (err) => {
      if (err) {
        console.error('Seeding failed:', err);
      } else {
        console.log(`Successfully seeded ${SEED_COUNT} employees into the database.`);
      }
      db.close();
    });
  });
};

seedDatabase();