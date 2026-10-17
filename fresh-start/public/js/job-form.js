// Form shared by post-job.html and edit-job.html (add or rename job fields here)
function jobForm(j, id) {
  const v = k => esc(j ? j[k] : ''), i = (k, p, t = 'text') => `<input id="${k}" type="${t}" placeholder="${p}" value="${v(k)}">`;
  $('#app').innerHTML = `<div class="box"><h1>${j ? 'Edit job' : 'Post a job'}</h1><div class="grid">${i('companyName', 'Company name *')}${i('jobTitle', 'Job title *')}${i('location', 'Location *')}
  <select id="jobType"><option value="">Job type *</option>${TYPES}</select><select id="experience"><option value="">Experience *</option>${EXP}</select>${i('skills', 'Skills (comma separated)')}
  ${i('openings', 'Total openings *', 'number')}${i('remaining', 'Vacancies remaining *', 'number')}${i('website', 'Company website (https://...)')}${i('email', 'HR email', 'email')}${i('whatsapp', 'WhatsApp number with country code')}${i('googleForm', 'Google Form URL')}</div>
  <textarea id="description" placeholder="Job description *">${v('description')}</textarea><button class="btn" id="save">${j ? 'Save changes' : 'Publish job'}</button> <a class="btn alt" href="hr-dashboard.html">Cancel</a></div>`;
  if (j) { $('#jobType').value = j.jobType; $('#experience').value = j.experience; }
  $('#save').onclick = () => act(async () => {
    const b = {}; ['companyName', 'jobTitle', 'location', 'jobType', 'experience', 'skills', 'openings', 'remaining', 'website', 'email', 'whatsapp', 'googleForm', 'description'].forEach(k => b[k] = $('#' + k).value);
    await api(j ? '/jobs/' + id : '/jobs', j ? 'PUT' : 'POST', b);
    toast(j ? 'Job updated' : 'Job published'); setTimeout(() => location.href = 'hr-dashboard.html', 700);
  });
}
