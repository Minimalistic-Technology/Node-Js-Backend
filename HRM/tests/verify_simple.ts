
import request from 'supertest';
import { app } from '../app';
import assert from 'assert';

async function testRoutes() {
    console.log('Starting route verification...');

    try {
        console.log('Testing /api/hrm/company/ ...');
        const resCompany = await request(app).get('/api/hrm/company/');
        console.log(`Status: ${resCompany.status}`);

        if (resCompany.status === 404) {
            console.error('FAILED: /api/hrm/company/ returned 404 Not Found');
            process.exit(1);
        } else if (resCompany.status === 401) {
            console.log('PASSED: /api/hrm/company/ returned 401 Unauthorized (as expected for unauthenticated request)');
        } else {
            console.log(`WARNING: /api/hrm/company/ returned ${resCompany.status}. This means route is found, but behavior might be unexpected.`);
        }

        console.log('Testing /api/hrm/documents/employee/123 ...');
        const resDoc = await request(app).get('/api/hrm/documents/employee/123');
        console.log(`Status: ${resDoc.status}`);

        if (resDoc.status === 404) {
            console.error('FAILED: /api/hrm/documents/employee/123 returned 404 Not Found');
            process.exit(1);
        } else if (resDoc.status === 401) {
            console.log('PASSED: /api/hrm/documents/employee/123 returned 401 Unauthorized (as expected)');
        } else {
            console.log(`WARNING: /api/hrm/documents/employee/123 returned ${resDoc.status}. This means route is found.`);
        }

    } catch (err) {
        console.error('An error occurred during verification:', err);
        process.exit(1);
    }
}

testRoutes();
