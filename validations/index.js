const server = require('./server');
const client = require('./client');

module.exports = joi => ({
    server: server(joi),
    client: client(joi)
});
