const express = require('express'), cookie = require('cookie-parser'), path = require('path');
require('./cleanup');
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }), cookie());
app.use('/api', require('./routes/auth'), require('./routes/jobs'), require('./routes/applications'));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 3000, () => console.log('Fresh Start running on port ' + (process.env.PORT || 3000)));
