"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const config_1 = require("@/config");
exports.prisma = new client_1.PrismaClient({
    // Optional: Log queries in development
    log: config_1.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
