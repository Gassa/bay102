import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.env || "localhost"
const dbUsername = process.env.DB_USERNAME || "me";
const dbPassword = process.env.DB_PASSWORD || "password";
const dbHost = process.env.DB_HOST || "localhost";
const dbHostPort= parseInt(process.env.DB_PORT || "5423");
const dbName = process.env.DB_DATABASE || "default";

const baseConfig = {
  user: dbUsername,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbHostPort,
  idleTimeoutMillis: 30*1000, // 30 seconds for an idle connection to be closed
  max: 20, // the max number of connections in connection pool
  allowExitIdle: true,
} 

const sslOption = { ssl: { rejectUnauthorized: false } }

const config = env == "localhost" ? baseConfig : Object.assign(baseConfig, sslOption);

console.log(config);

const close = async() => {
  await pool.end();
}

const pool = new pg.Pool(config)

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  client.release()
});

export default { pool, close }

