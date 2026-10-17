// Shared by every page: API calls, popups, menu, login check
const $ = s => document.querySelector(s);
let me = null;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function api(u, m = 'GET', b) {
  const r = await fetch('/api' + u, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Something went wrong.');
  return d;
}
function toast(m, err) {
  const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = m;
  document.body.append(t); setTimeout(() => t.remove(), 2600);
}
async function act(f) { try { await f(); } catch (e) { toast(e.message, 1); } }
const TYPES = ['Full Time', 'Part Time', 'Internship', 'Contract'].map(x => `<option>${x}</option>`).join('');
const EXP = ['Fresher', '0-1 Year', '1-2 Years', '2-3 Years', '3+ Years'].map(x => `<option>${x}</option>`).join('');
const left = j => Math.max(0, Math.ceil((j.expiresAt - Date.now()) / 864e5));
const stars = j => j.ratingCount ? `★ ${(j.ratingSum / j.ratingCount).toFixed(1)} (${j.ratingCount} ratings)` : 'No ratings yet';
const badges = j => `<span class="b">${esc(j.jobType)}</span><span class="b">${esc(j.experience)}</span><span class="b ${j.remaining ? '' : 'red'}">${j.remaining} of ${j.openings} vacancies left</span>`;
const card = j => `<a class="card" href="job-details.html?id=${j.id}"><h3>${esc(j.jobTitle)}</h3><p>${esc(j.companyName)}, ${esc(j.location)}</p><p>${badges(j)}</p><p>${stars(j)}</p></a>`;
function nav() {
  $('#nav').innerHTML = '<b>Fresh Start</b><a href="index.html">Home</a><a href="jobs.html">Jobs</a>' + (me
    ? (me.role === 'HR' ? '<a href="post-job.html">Post a job</a><a href="hr-dashboard.html">Dashboard</a><a href="applications.html">Applications</a>' : '') + `<a href="#" id="out">Log out (${esc(me.name)})</a>`
    : '<a href="login.html">Log in</a><a href="register.html">Register</a>');
  const o = $('#out');
  if (o) o.onclick = async e => { e.preventDefault(); await api('/logout', 'POST'); location.href = 'index.html'; };
}
// Call at the top of each page. init('HR') also sends non-HR visitors to the login page.
async function init(role) {
  try { me = await api('/me'); } catch (e) {}
  nav();
  if (role && (!me || me.role !== role)) { location.href = 'login.html'; return false; }
  return true;
}
