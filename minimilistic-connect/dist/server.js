"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_1 = require("./core/logger");
const database_1 = require("./database");
const startServer = async () => {
    try {
        // Test database connection
        await database_1.prisma.$connect();
        logger_1.logger.info('Database connected successfully.');
        app_1.default.listen(config_1.env.PORT, () => {
            logger_1.logger.info(`Server running on http://localhost:${config_1.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error(error, 'Failed to start server');
        await database_1.prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
