const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');

// Mockiranje mysql2
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  }),
}));

describe('POST /api/login', () => {
  it('should log in a user with valid credentials', async () => {
    const mockUser = { id: 1, username: 'bob', password: 'hashedpassword' };

    mysql.createConnection().query.mockImplementation((query, params, callback) => {
      if (query === "SELECT * FROM employees WHERE username = ?") {
        callback(null, [mockUser]); 
      } else {
        callback(new Error("Query not recognized"));
      }
    });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'geslo123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('user');
  });

  it('should reject login with invalid credentials', async () => {
    const mockUser = { id: 1, username: 'bob', password: 'hashedpassword' };

    mysql.createConnection().query.mockImplementation((query, params, callback) => {
      if (query === "SELECT * FROM employees WHERE username = ?") {
        callback(null, [mockUser]); 
      } else {
        callback(new Error("Query not recognized"));
      }
    });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'nigeslo123' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 400 if username or password is missing', async () => {
    const res = await request(app).post('/api/login').send({ username: 'testuser' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Username and password are required');
    
    const res2 = await request(app).post('/api/login').send({ password: 'geslo123' });
    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBe('Username and password are required');
  });
});



