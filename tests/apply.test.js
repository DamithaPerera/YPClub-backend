const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('POST /apply', () => {
    let token;
    beforeAll(async () => {
        const secret = process.env.SECRET;
        token = jwt.sign({ id: 'testUser' }, secret);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 404 if job does not exist', async () => {
        const response = await request(app)
            .post('/apply')
            .set('Authorization', token)
            .send({ jobId: '507f1f77bcf86cd799439011' }); // dummy ObjectId
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toMatch(/Job not found/);
    });
});
