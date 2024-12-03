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

describe('Employee API Tests', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = mysql.createConnection().query;
    mockQuery.mockReset();
  });

  // describe('GET /api/employees', () => {
  //   it('should fetch employees from the database', async () => {
  //     const mockEmployees = [
  //       { id: 1, name: 'John Doe', position: 'Developer' },
  //       { id: 2, name: 'Jane Smith', position: 'Designer' },
  //     ];

  //     mockQuery.mockImplementation((query, params, callback) => {
  //       callback(null, mockEmployees);
  //     });

  //     const res = await request(app).get('/api/employees');
  //     expect(res.statusCode).toBe(200);
  //     expect(Array.isArray(res.body)).toBe(true);
  //     expect(res.body).toEqual(mockEmployees);
  //   });
  // });

  describe('GET /api/entries/month', () => {
    it('should fetch total hours for the month, excluding certain employees', async () => {
      const month = 11;
      const excludeEmployeeIds = [1, 2, 3];
      const mockEntries = [
        { employee_id: 4, total_hours: 160 },
        { employee_id: 5, total_hours: 140 },
      ];

      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, mockEntries);
      });

      const res = await request(app).get(`/api/entries/month?month=${month}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(mockEntries);
      res.body.forEach((entry) => {
        expect(excludeEmployeeIds).not.toContain(entry.employee_id);
      });
    });

    it('should return a 404 if no entries are found for the given criteria', async () => {
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, []);
      });
      const res = await request(app).get('/api/entries/month?month=1');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('No entries found for the given criteria');
    });

  });
});
