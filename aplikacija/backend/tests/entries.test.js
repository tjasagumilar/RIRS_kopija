const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');

jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  }),
}));

describe('GET /api/entries', () => {
  it('should return 500 if no employeeId is provided', async () => {
    const res = await request(app).get('/api/entries');
    
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Employee ID is required');
  });

  it('should return entries for the given employeeId', async () => {
    const mockEntries = [
      { id: 1, employee_id: 1, hours: 8, date: '2023-12-01' },
      { id: 2, employee_id: 1, hours: 7, date: '2023-12-02' }
    ];

    mysql.createConnection().query.mockImplementation((query, params, callback) => {
      if (query.includes('SELECT * FROM entries WHERE employee_id = ?')) {
        callback(null, mockEntries);
      } else {
        callback(new Error("Query not recognized"));
      }
    });

    const res = await request(app).get('/api/entries').query({ employee_id: 1 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockEntries);
  });

  it('should return an empty array if no entries exist for the employee', async () => {
    mysql.createConnection().query.mockImplementation((query, params, callback) => {
      if (query.includes('SELECT * FROM entries WHERE employee_id = ?')) {
        callback(null, []); 
      } else {
        callback(new Error("Query not recognized"));
      }
    });

    const res = await request(app).get('/api/entries').query({ employee_id: 999 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([]);
  });
});


