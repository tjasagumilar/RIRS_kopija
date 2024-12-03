const request = require('supertest');
const app = require('../index'); // Adjust the path if necessary

describe('GET /api/employees', () => {
  it('should fetch employees from the database', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
});

describe('GET /api/entries/month', () => {
    it('should fetch total hours for the month, excluding certain employees', async () => {
      const month = 11;
      const excludeEmployeeIds = [1, 2, 3];
      const res = await request(app).get(`/api/entries/month?month=${month}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((entry) => {
        expect(excludeEmployeeIds).not.toContain(entry.employee_id); 
      });
    });
  
    it('should return a 404 if no entries are found for the given criteria', async () => {
      const month = 1;
      const res = await request(app).get(`/api/entries/month?month=${month}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No entries found for the given criteria");
    });
  });