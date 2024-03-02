const express = require("express");
const pool =require("./db")

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const customerRoutes = require("./routes/customers");


// app.get("/data", async (req, res) => {
//     try {
//         const { rows } = await pool.query("SELECT * FROM customer_data");
//         res.json(rows);
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.use("/api/customers", customerRoutes);

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}...`));
