const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path')
const session = require('express-session');
const app = express();
const RDBStore = require('session-rethinkdb')(session);
const dotenv = require('dotenv');
dotenv.config();
const r = require('rethinkdbdash')({servers: [{host: 'localhost', port: 28015, db: process.env.db}]});

const store = new RDBStore(r, {
    browserSessionsMaxAge: 6000000,
    clearInterval: 6000000
  });

app.use(cors({
    credentials: true
}))


app.listen(process.env.PORT);

app.use(helmet());
app.use(cookieParser(process.env.sessionSecret));
app.use(bodyParser());

app.use(session({ secret: process.env.sessionSecret, store: store, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

console.log('Server listening on port '+process.env.PORT);

module.exports = {
    app
}