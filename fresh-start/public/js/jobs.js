// jobs.html - public job list with search and paging
let pg = 1;
init().then(() => {
  $('#app').innerHTML = `<h1>Latest jobs</h1><div class="bar"><input id="q" placeholder="Search title, company or skills"><input id="l" placeholder="Location"><select id="e"><option value="">Any experience</option>${EXP}</select><select id="t"><option value="">Any job type</option>${TYPES}</select><button class="btn" id="go">Search</button></div><div id="list"></div><div class="pager"><button class="btn alt" id="pv">Previous</button> <span id="pn"></span> <button class="btn" id="nx">Next</button></div>`;
  const load = () => act(async () => {
    const p = new URLSearchParams({ q: $('#q').value, location: $('#l').value, experience: $('#e').value, jobType: $('#t').value, page: pg });
    const d = await api('/jobs?' + p);
    $('#list').innerHTML = d.jobs.map(card).join('') || '<p>No jobs match your search.</p>';
    $('#pn').textContent = 'Page ' + pg; $('#pv').disabled = pg < 2; $('#nx').disabled = !d.more;
  });
  $('#go').onclick = () => { pg = 1; load(); }; $('#pv').onclick = () => { pg--; load(); }; $('#nx').onclick = () => { pg++; load(); };
  load();
});
