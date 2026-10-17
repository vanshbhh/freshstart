// Register, login, logout, current user
const router = require('express').Router();
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const { db, wrap, bad, need, url, login, SECRET, DAY } = require('../lib');

router.post('/register', wrap((q, r) => {
  const { name = '', email = '', password = '', role } = q.body, em = email.trim().toLowerCase();
  if (!name.trim() || !em.includes('@')) throw bad('Enter your name and a valid email.');
  if (password.length < 6) throw bad('Password needs at least 6 characters.');
  if (!['HR', 'JOB_SEEKER'].includes(role)) throw bad('Choose an account type.');
  if (db.prepare('SELECT 1 FROM users WHERE email=?').get(em)) throw bad('This email is already registered.');
  const id = db.prepare('INSERT INTO users(name,email,hash,role) VALUES(?,?,?,?)').run(name.trim(), em, bcrypt.hashSync(password, 10), role).lastInsertRowid;
  const u = { id, name: name.trim(), role }; login(r, u); r.json(u);
}));
router.post('/login', wrap((q, r) => {
  const u = db.prepare('SELECT * FROM users WHERE email=?').get((q.body.email || '').trim().toLowerCase());
  if (!u || !bcrypt.compareSync(q.body.password || '', u.hash)) throw bad('Wrong email or password.');
  if (u.role !== q.body.role) throw bad('This account is registered as ' + (u.role === 'HR' ? 'HR / Recruiter' : 'Job Seeker') + '.');
  login(r, u); r.json({ id: u.id, name: u.name, role: u.role });
}));
router.post('/logout', (q, r) => r.clearCookie('t').json({ ok: 1 }));
router.get('/me', (q, r) => { try { r.json(jwt.verify(q.cookies.t, SECRET)); } catch { r.json(null); } });

module.exports = router;
