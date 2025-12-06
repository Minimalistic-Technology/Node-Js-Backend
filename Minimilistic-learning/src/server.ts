import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';

const start = async () => {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    server.listen(env.PORT, () => {
      console.log(`minimilistic-learning API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void start();

