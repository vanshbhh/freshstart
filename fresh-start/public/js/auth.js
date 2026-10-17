// login.html and register.html
const reg = document.body.dataset.mode === 'register', title = reg ? 'Create account' : 'Log in';
init().then(() => {
  $('#app').innerHTML = `<div class="box narrow"><h1>${title}</h1>${reg ? '<input id="n" placeholder="Full name">' : ''}<input id="e" type="email" placeholder="Email"><input id="p" type="password" placeholder="Password${reg ? ' (minimum 6 characters)' : ''}"><select id="r"><option value="HR">HR / Recruiter</option><option value="JOB_SEEKER">Job Seeker</option></select><button class="btn" id="go" style="width:100%">${title}</button>
  <p>${reg ? 'Already registered? <a href="login.html">Log in</a>' : 'New here? <a href="register.html">Create an account</a>'}</p></div>`;
  $('#go').onclick = () => act(async () => {
    const u = await api(reg ? '/register' : '/login', 'POST', { name: reg ? $('#n').value : '', email: $('#e').value, password: $('#p').value, role: $('#r').value });
    location.href = u.role === 'HR' ? 'hr-dashboard.html' : 'jobs.html';
  });
});
