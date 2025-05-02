require('dotenv').config();
const http = require('http');
const App = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
