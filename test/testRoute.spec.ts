import request from 'supertest';
import { expect } from 'chai';
import { app } from '../app'; // Adjust path if app.ts is located elsewhere

describe('GET /test', () => {
 it('should return success response', async () => {
  const res = await request(app).get('/test');
  expect(res.status).to.equal(200);
  expect(res.body).to.deep.equal({
    success: true,
    message: "GET API is working",
  });
}).timeout(5000);
});
