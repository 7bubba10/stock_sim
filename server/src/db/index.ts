import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Shared connection pool — reused across all queries to avoid per-request connection overhead
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export default pool