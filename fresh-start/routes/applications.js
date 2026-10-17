// Applying to jobs, HR application list, ratings
const router = require('express').Router();
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const { db, wrap, bad, need, url, login, SECRET, DAY } = require('../lib');

router.post('/jobs/:id/apply', need('JOB_SEEKER'), wrap((q, r) => {
  const j = db.prepare('SELECT * FROM jobs WHERE id=? AND expiresAt>?').get(q.params.id, Date.now());
  if (!j) throw bad('Job not found or expired.'); if (j.remaining < 1) throw bad('No vacancies left.');
  const { name = '', email = '', phone = '', resume = '', message = '' } = q.body;
  if (!name.trim() || !email.includes('@') || !phone.trim()) throw bad('Name, email and phone are required.');
  if (!url(resume)) throw bad('Resume link must start with http:// or https://');
  if (db.prepare('SELECT 1 FROM applications WHERE jobId=? AND userId=?').get(j.id, q.user.id)) throw bad('You already applied to this job.');
  db.prepare('INSERT INTO applications(jobId,hrId,userId,name,email,phone,resume,message,createdAt) VALUES(?,?,?,?,?,?,?,?,?)')
    .run(j.id, j.hrId, q.user.id, name.trim(), email.trim(), phone.trim(), resume.trim(), message.slice(0, 2000), Date.now());
  r.json({ ok: 1 });
}));
router.get('/applications', need('HR'), wrap((q, r) => r.json(db.prepare(
  'SELECT a.*, j.jobTitle FROM applications a JOIN jobs j ON j.id=a.jobId WHERE a.hrId=? ORDER BY a.createdAt DESC').all(q.user.id))));
router.post('/jobs/:id/rate', need('JOB_SEEKER'), wrap((q, r) => {
  const n = +q.body.rating; if (!Number.isInteger(n) || n < 1 || n > 5) throw bad('Rating must be 1 to 5.');
  if (!db.prepare('SELECT 1 FROM jobs WHERE id=?').get(q.params.id)) throw bad('Job not found.');
  db.transaction(() => {
    const p = db.prepare('SELECT rating FROM ratings WHERE jobId=? AND userId=?').get(q.params.id, q.user.id);
    db.prepare('INSERT OR REPLACE INTO ratings VALUES(?,?,?)').run(q.params.id, q.user.id, n);
    db.prepare('UPDATE jobs SET ratingSum=ratingSum+?, ratingCount=ratingCount+? WHERE id=?').run(p ? n - p.rating : n, p ? 0 : 1, q.params.id);
  })();
  r.json({ ok: 1 });
}));

module.exports = router;
