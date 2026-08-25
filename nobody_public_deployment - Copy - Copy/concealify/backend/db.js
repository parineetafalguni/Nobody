const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});
async function init(){
 if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
 await pool.query(`
 CREATE TABLE IF NOT EXISTS users(
   id SERIAL PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,
   verified BOOLEAN NOT NULL DEFAULT FALSE,created_at TIMESTAMPTZ DEFAULT NOW(),profile JSONB NOT NULL
 );
 CREATE TABLE IF NOT EXISTS otp_requests(
   email TEXT PRIMARY KEY,otp_hash TEXT NOT NULL,expires_at BIGINT NOT NULL,
   username TEXT NOT NULL,password_hash TEXT NOT NULL,attempts INT NOT NULL DEFAULT 0
 );
 CREATE TABLE IF NOT EXISTS posts(
   id SERIAL PRIMARY KEY,owner_id INT REFERENCES users(id) ON DELETE CASCADE,
   name TEXT NOT NULL,age TEXT,joined TEXT,category TEXT,mood TEXT,type TEXT,pref TEXT,
   body TEXT NOT NULL,image_url TEXT,reactions JSONB NOT NULL DEFAULT '{"Supportive":0,"Helpful":0,"Felt Heard":0,"Good Perspective":0}',
   created_at TIMESTAMPTZ DEFAULT NOW()
 );
 CREATE TABLE IF NOT EXISTS comments(
   id SERIAL PRIMARY KEY,post_id INT REFERENCES posts(id) ON DELETE CASCADE,
   owner_id INT REFERENCES users(id) ON DELETE CASCADE,name TEXT NOT NULL,text TEXT NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
 );`);
}
module.exports={pool,init};
