const request = require('supertest');
const bcrypt = require('bcryptjs');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;

beforeAll(async () => {
  app = await setupTestApp();

  // Create a test user
  const hash = await bcrypt.hash('password123', 10);
  await getDb().collection('users').insertOne({
    username: 'TestUser',
    email: 'test@example.com',
    password: hash,
    createdAt: new Date(),
  });
});

afterAll(async () => {
  await teardownTestApp();
});


describe('POST /api/login', () => {
  test('logs in with valid credentials', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
  });

  test('rejects missing email', async () => {
    const res = await request(app).post('/api/login').send({
      email: '',
      password: 'password123',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Email address required');
  });

  test('rejects missing password', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: '',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Password required');
  });

  test('rejects non-existent email', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Email not found');
  });

  test('rejects wrong password', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Wrong password');
  });
});
