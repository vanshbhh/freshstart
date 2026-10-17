// applications.html - applications for the HR's jobs
init('HR').then(ok => ok && act(async () => {
  const a = await api('/applications');
  $('#app').innerHTML = '<h1>Applications received</h1>' + (a.map(x => `<div class="box"><h3>${esc(x.name)} <small>for ${esc(x.jobTitle)}</small></h3><p>${esc(x.email)} &middot; ${esc(x.phone)}${x.resume ? ` &middot; <a href="${esc(x.resume)}" target="_blank" rel="noopener">Resume</a>` : ''}</p><p style="font-weight:500">${esc(x.message)}</p><small>${new Date(x.createdAt).toLocaleString()}</small></div>`).join('') || '<p>No applications yet.</p>');
}));
