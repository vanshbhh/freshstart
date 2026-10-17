// Database, helpers and login/permission checks shared by all routes
const Database = require('better-sqlite3'), bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'change-this-secret', DAY = 864e5;
const db = new Database(process.env.DB_PATH || 'data.db');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, hash TEXT, role TEXT);
CREATE TABLE IF NOT EXISTS jobs(id INTEGER PRIMARY KEY, hrId INTEGER, companyName TEXT, jobTitle TEXT, location TEXT,
  jobType TEXT, experience TEXT, skills TEXT, openings INTEGER, remaining INTEGER, website TEXT, description TEXT,
  email TEXT, whatsapp TEXT, googleForm TEXT, ratingSum INTEGER DEFAULT 0, ratingCount INTEGER DEFAULT 0,
  createdAt INTEGER, expiresAt INTEGER);
CREATE TABLE IF NOT EXISTS applications(id INTEGER PRIMARY KEY, jobId INTEGER, hrId INTEGER, userId INTEGER,
  name TEXT, email TEXT, phone TEXT, resume TEXT, message TEXT, createdAt INTEGER, UNIQUE(jobId, userId));
CREATE TABLE IF NOT EXISTS ratings(jobId INTEGER, userId INTEGER, rating INTEGER, PRIMARY KEY(jobId, userId));`);

const wrap = f => (q, r) => { try { f(q, r); } catch (e) { r.status(e.code ? 400 : 500).json({ error: e.message }); } };
const bad = m => { const e = new Error(m); e.code = 1; return e; };
const need = role => (q, r, n) => {
  try { q.user = jwt.verify(q.cookies.t, SECRET); } catch { return r.status(401).json({ error: 'Please log in first.' }); }
  if (role && q.user.role !== role) return r.status(403).json({ error: 'Your account type cannot do this.' });
  n();
};
const url = s => !s || /^https?:\/\//i.test(s);
const login = (r, u) => r.cookie('t', jwt.sign({ id: u.id, name: u.name, role: u.role }, SECRET, { expiresIn: '7d' }),
  { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * DAY });


module.exports = { db, wrap, bad, need, url, login, SECRET, DAY };
