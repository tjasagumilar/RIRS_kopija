const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  }),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('POST /api/login', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = mysql.createConnection().query;
    mockQuery.mockReset();
  });

  it('should log in a user with valid credentials', async () => {
    const mockUser = { id: 1, username: 'bob', password: 'hashedpassword' };
    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, [mockUser]); 
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'geslo123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.username).toBe('bob');
  });

  it('should reject login with invalid credentials', async () => {
    const mockUser = { id: 1, username: 'bob', password: 'hashedpassword' };
    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, [mockUser]);
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });

  jest.setTimeout(10000);

  it('should return 401 if username or password is missing', async () => {
    const res = await request(app).post('/api/login').send({ username: 'testuser' });
    expect(res.statusCode).toBe(401);
  });

});


