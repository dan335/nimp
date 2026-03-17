const request = require('supertest');
const bcrypt = require('bcryptjs');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;

beforeAll(async () => {
  app = await setupTestApp();

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


describe('GET /api/logout', () => {
  test('destroys session', async () => {
    const agent = request.agent(app);

    // Log in first
    await agent.post('/api/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    // Logout
    const res = await agent.get('/api/logout');
    expect(res.status).toBe(200);
  });
});
