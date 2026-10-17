// Deletes jobs older than 30 days (runs hourly)
const { db } = require('./lib');
const purge = () => db.transaction(() => {
  const old = 'SELECT id FROM jobs WHERE expiresAt<?', t = Date.now();
  db.prepare(`DELETE FROM ratings WHERE jobId IN (${old})`).run(t);
  db.prepare(`DELETE FROM applications WHERE jobId IN (${old})`).run(t);
  db.prepare('DELETE FROM jobs WHERE expiresAt<?').run(t);
})();
purge(); setInterval(purge, 3600e3);

