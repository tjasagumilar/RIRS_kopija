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
  let mockQuery;

  beforeEach(() => {
    mockQuery = mysql.createConnection().query;
    mockQuery.mockReset();
  });

  it('should fetch work entries for a specific employee', async () => {
    const mockEntries = [
      { id: 1, employee_id: 1, hours: 8, date: '2023-12-01' },
      { id: 2, employee_id: 1, hours: 7, date: '2023-12-02' },
    ];

    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, mockEntries);
    });

    const res = await request(app).get('/api/entries').query({ employee_id: 1 });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(mockEntries);
  });

  it('should return an empty array if no entries exist for the employee', async () => {
    mockQuery.mockImplementation((query, params, callback) => {
      callback(null, []); 
    });

    const res = await request(app).get('/api/entries').query({ employee_id: 999 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

