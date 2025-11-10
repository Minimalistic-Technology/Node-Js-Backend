import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan'; // For HTTP request logging
import { env } from './config';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { logger } from './core/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

// --- Core Middleware ---
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Configure CORS as needed
app.use(helmet()); // Secure HTTP headers
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Swagger/OpenAPI Setup
if (env.NODE_ENV === 'development') {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'My Auth API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            }
          }
        }
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./src/modules/**/*.routes.ts'], // Path to your route files
  };
  const openapiSpec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  logger.info(`API docs available at http://localhost:${env.PORT}/api-docs`);
}

// --- API Routes ---
app.get('/health', (req, res) => res.status(200).send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // for /api/me

// --- Error Handling ---
// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint not found' });
});

// Global Error Handler
app.use(errorMiddleware);

export default app;