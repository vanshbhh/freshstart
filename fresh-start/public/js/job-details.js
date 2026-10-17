// job-details.html?id=... - job page, apply and rate
const id = new URLSearchParams(location.search).get('id');
init().then(() => act(async () => {
  const j = await api('/jobs/' + id), seeker = me && me.role === 'JOB_SEEKER';
  $('#app').innerHTML = `<div class="box"><h1>${esc(j.jobTitle)}</h1><p>${esc(j.companyName)}, ${esc(j.location)}${j.website ? ` &middot; <a href="${esc(j.website)}" target="_blank" rel="noopener">Website</a>` : ''}</p><p>${badges(j)}</p><p>${stars(j)}</p>
  ${j.skills ? `<p>Skills: ${esc(j.skills)}</p>` : ''}<p style="white-space:pre-wrap;font-weight:500">${esc(j.description)}</p>
  <p>${j.email ? `<a class="btn" href="mailto:${esc(j.email)}">Email HR</a>` : ''}${j.whatsapp ? `<a class="btn" href="https://wa.me/${esc(j.whatsapp.replace(/\D/g, ''))}" target="_blank" rel="noopener">WhatsApp</a>` : ''}${j.googleForm ? `<a class="btn" href="${esc(j.googleForm)}" target="_blank" rel="noopener">Google Form</a>` : ''}</p>
  ${seeker ? `<h3>Apply on Fresh Start</h3><input id="an" placeholder="Your name" value="${esc(me.name)}"><input id="ae" type="email" placeholder="Your email"><input id="ap" placeholder="Phone number"><input id="ar" placeholder="Resume or portfolio link (optional)"><textarea id="am" placeholder="Message (optional)"></textarea><button class="btn" id="ab" ${j.remaining ? '' : 'disabled'}>${j.remaining ? 'Submit application' : 'No vacancies left'}</button>
  <h3>Rate this job</h3><select id="rt" style="width:auto"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select> <button class="btn alt" id="rb">Save rating</button>`
    : `<p>${me ? 'Only job seekers can apply or rate.' : '<a href="login.html">Log in</a> as a job seeker to apply or rate.'}</p>`}</div>`;
  if (seeker) {
    $('#ab').onclick = () => act(async () => { await api(`/jobs/${id}/apply`, 'POST', { name: $('#an').value, email: $('#ae').value, phone: $('#ap').value, resume: $('#ar').value, message: $('#am').value }); toast('Application submitted'); $('#ab').disabled = true; });
    $('#rb').onclick = () => act(async () => { await api(`/jobs/${id}/rate`, 'POST', { rating: +$('#rt').value }); toast('Rating saved'); });
  }
}));
