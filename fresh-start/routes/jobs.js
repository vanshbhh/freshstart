// Job posting, editing, deleting, listing, vacancies
const router = require('express').Router();
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const { db, wrap, bad, need, url, login, SECRET, DAY } = require('../lib');

const F = ['companyName', 'jobTitle', 'location', 'jobType', 'experience', 'skills', 'openings', 'remaining', 'website', 'description', 'email', 'whatsapp', 'googleForm'];
function clean(b) {
  const j = {}; F.forEach(k => j[k] = typeof b[k] === 'string' ? b[k].trim().slice(0, 4000) : b[k]);
  ['companyName', 'jobTitle', 'location', 'jobType', 'experience', 'description'].forEach(k => { if (!j[k]) throw bad('Please fill all fields marked *.'); });
  j.openings = Math.floor(+j.openings); j.remaining = Math.floor(+j.remaining);
  if (!(j.openings >= 1)) throw bad('Total openings must be at least 1.');
  if (!(j.remaining >= 0 && j.remaining <= j.openings)) throw bad('Vacancies must be between 0 and total openings.');
  if (!url(j.website) || !url(j.googleForm)) throw bad('Links must start with http:// or https://');
  return j;
}
const own = (q, id) => { const j = db.prepare('SELECT * FROM jobs WHERE id=?').get(id);
  if (!j) throw bad('Job not found.'); if (j.hrId !== q.user.id) throw bad('This is not your job.'); return j; };

router.get('/jobs', wrap((q, r) => {
  const { q: s = '', location = '', experience = '', jobType = '', page = 1 } = q.query, l = x => '%' + x + '%';
  const rows = db.prepare(`SELECT * FROM (SELECT * FROM jobs WHERE expiresAt>? ORDER BY createdAt DESC LIMIT 100)
    WHERE (jobTitle LIKE ? OR companyName LIKE ? OR skills LIKE ?) AND location LIKE ? AND (?='' OR experience=?) AND (?='' OR jobType=?)
    LIMIT 21 OFFSET ?`).all(Date.now(), l(s), l(s), l(s), l(location), experience, experience, jobType, jobType, (Math.max(1, +page || 1) - 1) * 20);
  r.json({ jobs: rows.slice(0, 20), more: rows.length > 20 });
}));
router.get('/jobs/:id', wrap((q, r) => {
  const j = db.prepare('SELECT * FROM jobs WHERE id=? AND expiresAt>?').get(q.params.id, Date.now());
  if (!j) throw bad('Job not found or expired.'); r.json(j);
}));
router.get('/my/jobs', need('HR'), wrap((q, r) => r.json(db.prepare('SELECT * FROM jobs WHERE hrId=? ORDER BY createdAt DESC').all(q.user.id))));
router.post('/jobs', need('HR'), wrap((q, r) => {
  const j = clean(q.body), now = Date.now();
  const id = db.prepare(`INSERT INTO jobs(hrId,${F},createdAt,expiresAt) VALUES(?,${F.map(() => '?')},?,?)`)
    .run(q.user.id, ...F.map(k => j[k]), now, now + 30 * DAY).lastInsertRowid;
  r.json({ id });
}));
router.put('/jobs/:id', need('HR'), wrap((q, r) => {
  own(q, q.params.id); const j = clean(q.body);
  db.prepare(`UPDATE jobs SET ${F.map(k => k + '=?')} WHERE id=?`).run(...F.map(k => j[k]), q.params.id); r.json({ ok: 1 });
}));
router.post('/jobs/:id/fill', need('HR'), wrap((q, r) => {
  own(q, q.params.id); db.prepare('UPDATE jobs SET remaining=MAX(0,remaining-1) WHERE id=?').run(q.params.id); r.json({ ok: 1 });
}));
router.delete('/jobs/:id', need('HR'), wrap((q, r) => {
  own(q, q.params.id);
  db.transaction(id => { ['ratings', 'applications'].forEach(t => db.prepare(`DELETE FROM ${t} WHERE jobId=?`).run(id)); db.prepare('DELETE FROM jobs WHERE id=?').run(id); })(q.params.id);
  r.json({ ok: 1 });
}));

module.exports = router;
