const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Mock MySQL module
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  }),
}));

// Mock bcrypt
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

    // Simulate a database query for user lookup
    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, [mockUser]); // Return mock user
    });

    // Simulate bcrypt password comparison
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

    // Simulate a database query for user lookup
    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, [mockUser]);
    });

    // Simulate bcrypt password comparison failure
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should return 401 if username or password is missing', async () => {
    const res = await request(app).post('/api/login').send({ username: 'testuser' });
    expect(res.statusCode).toBe(401);
  });

  it('should return 500 for database errors', async () => {
    // Simulate database error
    mockQuery.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'bob', password: 'geslo123' });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error logging in');
  });
});



// const request = require('supertest');
// const app = require('../index');

// describe('POST /api/login', () => {
//   it('should log in a user with valid credentials', async () => {
//     const res = await request(app)
//       .post('/api/login')
//       .send({ username: 'bob', password: 'geslo123' });
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('success', true);
//     expect(res.body).toHaveProperty('user');
//   });

//   it('should reject login with invalid credentials', async () => {
//     const res = await request(app)
//       .post('/api/login')
//       .send({ username: 'nibob', password: 'nigeslo123' });
//     expect(res.statusCode).toBe(401);
//     expect(res.body).toHaveProperty('success', false);
//   });

//   it('should return 401 if username or password is missing', async () => {
//     const res = await request(app).post('/api/login').send({ username: 'testuser' });
//     expect(res.statusCode).toBe(401);
//   });
// });

