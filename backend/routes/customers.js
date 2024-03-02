const express = require("express");
const pool = require("../db");

const router = express.Router();

// Function to execute SQL queries and handle errors
const runQuery = async (query, params = []) => {
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    await client.release();
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

// Get all customers with search, sort, and pagination
router.get("/", async (req, res) => {
  try {
    const page = Math.max(0, parseInt(req.query.page) - 1) || 0; // Ensure page is not negative
    const limit = Math.max(1, parseInt(req.query.limit) || 20); // Ensure limit is at least 1
    const search = req.query.search || "";
    let sort = req.query.sort || "created_at"; 
    let sortField = 'created_at';

    const searchParams = [`%${search}%`]; 
   

    if (sort === 'date') {
      sortField = 'DATE(created_at)';
    } else if (sort === 'time') {
      sortField = 'created_at::timestamp::time';
    }
    const sortParams = [sortField];

   

    const total = await runQuery(
      `SELECT COUNT(*) FROM customer_data 
      WHERE customer_name ILIKE $1 OR location ILIKE $1`,
      searchParams
    );

    const offset = page * limit;
    const customers = await runQuery(
      `SELECT * FROM customer_data
      WHERE customer_name ILIKE $1 OR location ILIKE $1
      ORDER BY ${sortParams.join(", ")}
      OFFSET $2 LIMIT $3`,
      [...searchParams, offset, limit]
    );

    res.status(200).json({
      error: false,
      total: total[0].count,
      page: page + 1,
      limit,
      customers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
