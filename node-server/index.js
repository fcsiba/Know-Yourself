const {app} = require('./setup/serverSetup');
const {db} = require('./setup/rethinkDBSetup');

db.then(r => {
    console.log('RethinkDB has been initialized')
    require('./routes')(app,r);
}).catch(err => {
    console.log('ERROR: RethinkDB was not able to start')
})