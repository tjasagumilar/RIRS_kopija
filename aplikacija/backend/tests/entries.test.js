const request = require('supertest');
const app = require('../index');

describe('GET /api/entries', () => {
  it('should fetch work entries for a specific employee', async () => {
    const res = await request(app).get('/api/entries').query({ employee_id: 1 });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

//   it('should return 500 if no employeeId is provided', async () => {
//     const res = await request(app).get('/api/entries');
//     expect(res.statusCode).toBe(500);
//   });

  it('should return an empty array if no entries exist for the employee', async () => {
    const res = await request(app).get('/api/entries').query({ employee_id: 999 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
  
});
