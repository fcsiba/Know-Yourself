const entryRoutes = require('./entryRoutes');
const appRoutes = require('./appRoutes');

module.exports = (app, r) => {
    entryRoutes(app, r);
    appRoutes(app, r);
}