const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
    it('should return API running message on GET /', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });
});