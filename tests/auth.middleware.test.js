const express = require('express');
const request = require('supertest');
const { authMiddleware } = require('../src/middleware/auth.middleware');

describe('Auth Middleware', () => {
    const app = express();

    app.get('/protected', authMiddleware, (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Authorized',
        });
    });

    it('should reject request without authorization header', async () => {
        const res = await request(app).get('/protected');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });

    it('should reject request with invalid token format', async () => {
        const res = await request(app)
            .get('/protected')
            .set('Authorization', 'InvalidToken');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
    });
});