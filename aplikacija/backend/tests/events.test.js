const request = require('supertest');
const app = require('../index'); // Pot do glavne datoteke aplikacije
const mysql = require('mysql2');

// Mockanje mysql2 za povezavo z bazo
jest.mock('mysql2', () => ({
  createConnection: jest.fn().mockReturnValue({
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  }),
}));

describe('POST /api/events', () => {
  let mockQuery;

  beforeEach(() => {
    mockQuery = mysql.createConnection().query;
    mockQuery.mockReset(); // Počisti predhodne poizvedbe pred vsakim testom
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/api/events').send({
      // Manjka obvezni podatki: eventName, startDate, startTime
      location: 'Conference Room',
      description: 'Team meeting about the new project.',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Missing required fields: 'eventName', 'startDate', or 'startTime'");
  });

  it('should insert event into database and return 201 if data is valid', async () => {
    const mockInsertId = 42; // Predpostavimo, da je ID vstavljenega dogodka 42

    // Mockiranje delovanja query funkcije za uspešno vstavitev
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { insertId: mockInsertId }); // Simulira uspešen vnos v bazo
    });

    const response = await request(app).post('/api/events').send({
      eventName: 'Team Building',
      startDate: '2024-12-15',
      startTime: '15:00',
      location: 'Hotel Plaza',
      description: 'An event to strengthen team bonds.',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("'Event' entry added successfully");
    expect(response.body.id).toBe(mockInsertId);

    // Preveri, da je bila poizvedba izvedena s pravimi parametri
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO events'),
      [
        'Team Building',
        '2024-12-15',
        '15:00',
        'Hotel Plaza',
        'An event to strengthen team bonds.',
      ],
      expect.any(Function)
    );
  });
});
