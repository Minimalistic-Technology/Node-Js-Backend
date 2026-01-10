"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan")); // For HTTP request logging
const config_1 = require("./config");
const auth_routes_1 = require("./modules/auth/auth.routes");
const user_routes_1 = require("./modules/user/user.routes");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./core/logger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const app = (0, express_1.default)();
// --- Core Middleware ---
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)()); // Configure CORS as needed
app.use((0, helmet_1.default)()); // Secure HTTP headers
app.use((0, morgan_1.default)(config_1.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
// Swagger/OpenAPI Setup
if (config_1.env.NODE_ENV === 'development') {
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
    const openapiSpec = (0, swagger_jsdoc_1.default)(options);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec));
    logger_1.logger.info(`API docs available at http://localhost:${config_1.env.PORT}/api-docs`);
}
// --- API Routes ---
app.get('/health', (req, res) => res.status(200).send('OK'));
app.use('/api/auth', auth_routes_1.authRoutes);
app.use('/api', user_routes_1.userRoutes); // for /api/me
// --- Error Handling ---
// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint not found' });
});
// Global Error Handler
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
