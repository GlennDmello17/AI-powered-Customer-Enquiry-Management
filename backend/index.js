import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
import {categorizeEnquiry} from './awsBedrock.js';
const app = express();

const pool = mysql.createPool({
  host: process.env.MY_SQL_HOST,   
  user: process.env.MY_SQL_USER,       
  password: process.env.MY_SQL_PASSWORD,   
  database: process.env.MY_SQL_DATABASE,   
  waitForConnections: true,
  connectionLimit: 10,
});
app.use(express.json());
app.post('/submit-enquiry', async (req, res) => {
  const { username, email, message } = req.body;
  const { category, priority } = await categorizeEnquiry(message);
  console.log('Categorized as:', category, priority);
  try {
    const [result] = await pool.query(
      'INSERT INTO cem (username, email, message, category, priority) VALUES (?, ?, ?, ?, ?)',
      [username, email, message, category, priority]
    );
    console.log("Enquiry saved in db with ID:", result.insertId);
    res.json({ message: 'Enquiry saved', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});