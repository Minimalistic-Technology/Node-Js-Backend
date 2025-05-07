require('dotenv').config();
const http = require('http');
const App = require('./app');
const ConnectDB = require('./db');

const PORT = process.env.PORT || 5000;

ConnectDB();

const server = http.createServer(App);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
