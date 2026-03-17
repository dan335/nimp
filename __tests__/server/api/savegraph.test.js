const request = require('supertest');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;
let agent;
let userId;

beforeAll(async () => {
  app = await setupTestApp();

  // Create and log in a test user
  const hash = await bcrypt.hash('password123', 10);
  const result = await getDb().collection('users').insertOne({
    username: 'TestUser',
    email: 'test@example.com',
    password: hash,
    createdAt: new Date(),
  });
  userId = result.insertedId;

  // Log in to get a session
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


describe('POST /api/savegraph', () => {
  test('requires authentication', async () => {
    const res = await request(app).post('/api/savegraph').send({
      graph: { id: new ObjectId().toHexString(), title: 'Test', nodes: [] },
      isPublic: true,
      anyoneCanOverwrite: false,
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Account required');
  });

  test('creates a new graph', async () => {
    const graphId = new ObjectId().toHexString();
    const res = await agent.post('/api/savegraph').send({
      graph: { id: graphId, title: 'My Graph', nodes: [] },
      isPublic: true,
      anyoneCanOverwrite: false,
      thumbnail: null,
    });
    expect(res.status).toBe(200);
    const body = res.body;
    expect(body._id).toBe(graphId);
    expect(body.title).toBe('My Graph');
    expect(body.slug).toBe('my-graph');

    // Verify in database
    const graph = await getDb().collection('graphs').findOne({ _id: new ObjectId(graphId) });
    expect(graph).not.toBeNull();
    expect(graph.title).toBe('My Graph');
  });

  test('updates an existing graph owned by user', async () => {
    const graphId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      graph: { id: graphId.toHexString(), title: 'Old Title', nodes: [] },
      title: 'Old Title',
      isPublic: true,
      anyoneCanOverwrite: false,
      userId: userId,
      username: 'TestUser',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewedAt: new Date(),
      views: 0,
    });

    const res = await agent.post('/api/savegraph').send({
      graph: { id: graphId.toHexString(), title: 'Updated Title', nodes: [] },
      isPublic: false,
      anyoneCanOverwrite: false,
      thumbnail: null,
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('rejects save of graph owned by another user', async () => {
    const graphId = new ObjectId();
    const otherUserId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      graph: { id: graphId.toHexString(), title: 'Other Graph', nodes: [] },
      title: 'Other Graph',
      isPublic: true,
      anyoneCanOverwrite: false,
      userId: otherUserId,
      username: 'OtherUser',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewedAt: new Date(),
      views: 0,
    });

    const res = await agent.post('/api/savegraph').send({
      graph: { id: graphId.toHexString(), title: 'Hacked Title', nodes: [] },
      isPublic: true,
      anyoneCanOverwrite: false,
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Not allowed');
  });

  test('allows save when anyoneCanOverwrite is true', async () => {
    const graphId = new ObjectId();
    const otherUserId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      graph: { id: graphId.toHexString(), title: 'Shared Graph', nodes: [] },
      title: 'Shared Graph',
      isPublic: true,
      anyoneCanOverwrite: true,
      userId: otherUserId,
      username: 'OtherUser',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewedAt: new Date(),
      views: 0,
    });

    const res = await agent.post('/api/savegraph').send({
      graph: { id: graphId.toHexString(), title: 'Updated by Another', nodes: [] },
      isPublic: true,
      anyoneCanOverwrite: true,
      thumbnail: null,
    });
    expect(res.status).toBe(200);
  });
});


describe('POST /api/copygraph', () => {
  test('copies a graph', async () => {
    const graphId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      graph: { id: graphId.toHexString(), title: 'Original', nodes: [] },
      title: 'Original',
      isPublic: true,
      anyoneCanOverwrite: false,
      userId: userId,
      username: 'TestUser',
      createdAt: new Date(),
      updatedAt: new Date(),
      viewedAt: new Date(),
      views: 5,
    });

    const res = await agent.post('/api/copygraph').send({
      graph: { id: graphId.toHexString(), title: 'Copy of Original', nodes: [] },
      isPublic: true,
      anyoneCanOverwrite: false,
      thumbnail: null,
    });
    expect(res.status).toBe(200);
    expect(res.body._id).not.toBe(graphId.toHexString());
    expect(res.body.slug).toBe('copy-of-original');
  });
});


describe('POST /api/viewgraph', () => {
  test('increments view count', async () => {
    const graphId = new ObjectId();
    await getDb().collection('graphs').insertOne({
      _id: graphId,
      title: 'Test Graph',
      views: 0,
      viewedAt: new Date(2020, 0, 1),
    });

    await agent.post('/api/viewgraph').send({ graphId: graphId.toHexString() });

    const graph = await getDb().collection('graphs').findOne({ _id: graphId });
    expect(graph.views).toBe(1);
    expect(graph.viewedAt.getTime()).toBeGreaterThan(new Date(2020, 0, 1).getTime());
  });
});
