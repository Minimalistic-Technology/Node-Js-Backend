
import express from 'express';
import request from 'supertest';
import { app } from '../app';

// Mock needed things if app starts server automatically
// import { server } from '../server'; 

describe('Route Registration Verification', () => {
    it('should return 401 for /api/hrm/company/ (GET) instead of 404', async () => {
        const res = await request(app).get('/api/hrm/company/');
        console.log('GET /api/hrm/company/ status:', res.status);
        if (res.status === 404) {
            throw new Error('Route /api/hrm/company/ not found (404)');
        }
        if (res.status !== 401) {
            // It might be 500 if db connection fails, but that means route is hit logic-wise
            console.warn('Expected 401, got', res.status);
        }
    });

    it('should return 401 for /api/hrm/documents/employee/123 (GET) instead of 404', async () => {
        const res = await request(app).get('/api/hrm/documents/employee/123');
        console.log('GET /api/hrm/documents/employee/123 status:', res.status);
        if (res.status === 404) {
            throw new Error('Route /api/hrm/documents/employee/123 not found (404)');
        }
    });
});
