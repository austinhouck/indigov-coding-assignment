import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 8080;

interface PostgresError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
}

// PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/', (req, res) => {
  res.json({ message: 'Express + TypeScript Server is running' });
});

app.get('/api/representatives', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM representatives');
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/constituents/add', async (req: Request, res: Response): Promise<void> => {
  try {
    const { first_name, last_name, age, phone, email, street_address, city, state, zip, district } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !age || !email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if a constituent with the same name and age already exists
    const existingCheck = await pool.query(
      'SELECT * FROM constituents WHERE first_name = $1 AND last_name = $2 AND age = $3',
      [first_name, last_name, age]
    );

    if (existingCheck.rows.length > 0) {
      res.status(409).json({
        error: 'Duplicate constituent',
        detail: 'A constituent with this name and age already exists'
      });
      return;
    }

    // Insert constituent into database
    const result = await pool.query(
      'INSERT INTO constituents (first_name, last_name, age, phone, email, street_address, city, state, zip, district) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [first_name, last_name, age, phone, email, street_address, city, state, zip, district]
    );

    // Return the created constituent
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating constituent:', err);

    // Error handling for database constraints
    const pgError = err as PostgresError;

    if (pgError.code === '23505') {
      // Check which unique constraint was violated
      if (pgError.constraint === 'constituents_email_key') {
        res.status(409).json({
          error: 'Email already exists',
          detail: 'A constituent with this email already exists in the database.'
        });
      } else if (pgError.constraint === 'unique_name_age') {
        res.status(409).json({
          error: 'Duplicate constituent',
          detail: 'A constituent with this name and age already exists in the database.'
        });
      } else {
        // Generic unique constraint violation
        res.status(409).json({
          error: 'Duplicate record',
          detail: pgError.detail || 'This record already exists in the database.'
        });
      }
      return;
    }

    // For validation constraints
    if (pgError.code === '23514') {
      res.status(400).json({
        error: 'Validation failed',
        detail: pgError.detail || 'The provided data failed validation rules.'
      });
      return;
    }

    // Default error response
    res.status(500).json({
      error: 'Database error',
      message: 'An unexpected error occurred while creating the constituent.'
    });
  }
});

app.get('/api/constituents', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM constituents ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/constituents/csv', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM constituents ORDER BY created_at DESC');

    // Set headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=constituents.csv');

    // Create CSV header row
    const headers = [
      'id',
      'first_name',
      'last_name',
      'age',
      'phone',
      'email',
      'street_address',
      'city',
      'state',
      'zip',
      'district',
      'status',
      'created_at',
      'updated_at'
    ].join(',');

    // Convert each row to CSV format
    const rows = result.rows.map(row => {
      return [
        row.id,
        `"${row.first_name}"`,
        `"${row.last_name}"`,
        row.age,
        `"${row.phone}"`,
        `"${row.email}"`,
        `"${row.street_address}"`,
        `"${row.city}"`,
        `"${row.state}"`,
        `"${row.zip}"`,
        `"${row.district || ''}"`,
        `"${row.status}"`,
        `"${row.created_at}"`,
        `"${row.updated_at}"`
      ].join(',');
    });

    // Combine header and rows
    const csv = [headers, ...rows].join('\r\n');

    // Send the CSV data
    res.send(csv);
  } catch (err) {
    console.error('Database query error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
