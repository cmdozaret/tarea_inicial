const Pool = require('pg').Pool
const pool = new Pool({    
  user: process.env.PG_USER ?? 'postgres',
  password: process.env.PG_PASSWORD ?? 'postgres',
  host: process.env.PG_HOST ?? 'localhost',
  database: process.env.PG_PRODUCTION_DATABASE ?? 'express',
  port: isNaN(process.env.PG_PORT) ? 5432 : Number(process.env.PG_PORT),
})

module.exports = {
  pool
}