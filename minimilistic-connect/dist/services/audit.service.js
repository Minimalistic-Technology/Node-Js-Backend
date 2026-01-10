"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const database_1 = require("@/database");
exports.auditService = {
    log: async (data) => {
        try {
            await database_1.prisma.auditLog.create({
                data: {
                    userId: data.userId,
                    eventType: data.eventType,
                    ip: data.ip,
                    userAgent: data.userAgent,
                    meta: data.meta || undefined,
                },
            });
        }
        catch (error) {
            // Log to console/file if DB logging fails
            console.error('Failed to write to audit log:', error);
        }
    },
};
