const request = require('supertest');
const app = require('../index');

describe('POST /api/login', () => {
  it('should log in a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'geslo123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
  });

  it('should reject login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'nibob', password: 'nigeslo123' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should return 401 if username or password is missing', async () => {
    const res = await request(app).post('/api/login').send({ username: 'testuser' });
    expect(res.statusCode).toBe(401);
  });
});

