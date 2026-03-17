const request = require('supertest');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;
let agent;
let userId;

beforeAll(async () => {
  app = await setupTestApp();

  const hash = await bcrypt.hash('password123', 10);
  const result = await getDb().collection('users').insertOne({
    username: 'TestUser',
    email: 'test@example.com',
    password: hash,
    createdAt: new Date(),
  });
  userId = result.insertedId;

  agent = request.agent(app);
  await agent.post('/api/login').send({
    email: 'test@example.com',
    password: 'password123',
  });
});

afterAll(async () => {
  await teardownTestApp();
});

afterEach(async () => {
  await getDb().collection('graphs').deleteMany({});
});


describe('POST /api/deletegraph', () => {
  test('deletes own graph', async () => {
    const graphId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      title: 'To Delete',
      userId: userId,
    });

    const res = await agent.post('/api/deletegraph').send({
      graphId: graphId.toHexString(),
    });
    expect(res.status).toBe(200);

    const graph = await getDb().collection('graphs').findOne({ _id: graphId });
    expect(graph).toBeNull();
  });

  test('requires authentication', async () => {
    const res = await request(app).post('/api/deletegraph').send({
      graphId: new ObjectId().toHexString(),
    });
    expect(res.status).toBe(500);
  });

  test('rejects invalid graphId length', async () => {
    const res = await agent.post('/api/deletegraph').send({
      graphId: 'short',
    });
    expect(res.status).toBe(500);
  });

  test('does not delete graph owned by another user', async () => {
    const graphId = new ObjectId();
    const otherUserId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      title: 'Not Mine',
      userId: otherUserId,
    });

    await agent.post('/api/deletegraph').send({
      graphId: graphId.toHexString(),
    });

    // Graph should still exist
    const graph = await getDb().collection('graphs').findOne({ _id: graphId });
    expect(graph).not.toBeNull();
  });
});
