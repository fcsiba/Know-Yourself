const r = require('rethinkdb');

const db = r.connect({host: 'localhost', port: 28015, db: 'KYS'})

module.exports = {db}