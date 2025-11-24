// db.js
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("railway") ? { rejectUnauthorized: false } : false
});


//const pool = new Pool({
//    connectionString: "postgresql://railway_user:password@containers-us-west-123.railway.app:5432/railway_db"
//});