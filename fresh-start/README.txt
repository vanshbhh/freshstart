FRESH START - NODE VERSION

RUN:  npm install  then  npm start   (open http://localhost:3000)
ENV:  JWT_SECRET (required in production), PORT, DB_PATH (SQLite file path), NODE_ENV=production
DEPLOY: Render/Railway - build "npm install", start "npm start". Attach a persistent disk and set DB_PATH to it.

WHERE TO CHANGE THINGS
 Colours / layout ........ public/css/style.css (variables at the top)
 A page's content ........ public/<page>.html + public/js/<page>.js
 Menu / popups / helpers . public/js/common.js
 Job form fields ......... public/js/job-form.js  +  routes/jobs.js (F list and clean())
 Login & register ........ public/js/auth.js  +  routes/auth.js
 Applying & ratings ...... routes/applications.js
 Database tables ......... lib.js
 30-day auto delete ...... cleanup.js
