// hr-dashboard.html - HR's own jobs
async function load() {
  const js = await api('/my/jobs');
  $('#app').innerHTML = `<h1>HR dashboard</h1><p>Welcome, ${esc(me.name)}</p>` + (js.map(j => `<div class="box row"><div><h3>${esc(j.jobTitle)}</h3><p>${esc(j.companyName)}, ${esc(j.location)}</p><p>${badges(j)}<span class="b">${j.expiresAt < Date.now() ? 'Expired' : 'Auto-deletes in ' + left(j) + ' days'}</span></p><p>${stars(j)}</p></div>
  <div><a class="btn" href="job-details.html?id=${j.id}">View</a><a class="btn" href="edit-job.html?id=${j.id}">Edit</a><button class="btn alt" data-fill="${j.id}" ${j.remaining ? '' : 'disabled'}>Mark 1 filled</button><button class="btn red" data-del="${j.id}">Delete</button></div></div>`).join('')
    || '<div class="box"><h3>No jobs posted yet</h3><a class="btn" href="post-job.html">Post a job</a></div>');
}
init('HR').then(ok => {
  if (!ok) return;
  act(load);
  $('#app').onclick = e => {
    const f = e.target.dataset.fill, d = e.target.dataset.del;
    if (f) act(async () => { await api(`/jobs/${f}/fill`, 'POST'); toast('Vacancy updated'); await load(); });
    if (d && confirm('Delete this job permanently? This cannot be undone.')) act(async () => { await api('/jobs/' + d, 'DELETE'); toast('Job deleted'); await load(); });
  };
});
