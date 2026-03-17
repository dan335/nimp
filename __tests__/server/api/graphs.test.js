const request = require('supertest');
const { ObjectId } = require('mongodb');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;

beforeAll(async () => {
  app = await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

afterEach(async () => {
  await getDb().collection('graphs').deleteMany({});
});


describe('GET /api/graphs', () => {
  test('returns empty array when no graphs', async () => {
    const res = await request(app).get('/api/graphs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns only public graphs', async () => {
    const userId = new ObjectId();
    await getDb().collection('graphs').insertMany([
      { title: 'Public Graph', isPublic: true, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/1/test' },
      { title: 'Private Graph', isPublic: false, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/2/test' },
    ]);

    const res = await request(app).get('/api/graphs');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Public Graph');
  });

  test('sorts by updatedAt descending', async () => {
    const userId = new ObjectId();
    await getDb().collection('graphs').insertMany([
      { title: 'Older', isPublic: true, userId, username: 'User', updatedAt: new Date(2020, 0, 1), views: 0, url: '/g/1/test' },
      { title: 'Newer', isPublic: true, userId, username: 'User', updatedAt: new Date(2025, 0, 1), views: 0, url: '/g/2/test' },
    ]);

    const res = await request(app).get('/api/graphs');
    expect(res.body[0].title).toBe('Newer');
    expect(res.body[1].title).toBe('Older');
  });
});


describe('POST /api/usergraphs', () => {
  test('returns user public graphs', async () => {
    const userId = new ObjectId();
    await getDb().collection('graphs').insertMany([
      { title: 'User Public', isPublic: true, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/1/test' },
      { title: 'User Private', isPublic: false, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/2/test' },
    ]);

    const res = await request(app).post('/api/usergraphs').send({
      userId: userId.toHexString(),
      isUser: false,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('User Public');
  });

  test('returns all user graphs when isUser is true', async () => {
    const userId = new ObjectId();
    await getDb().collection('graphs').insertMany([
      { title: 'Public', isPublic: true, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/1/test' },
      { title: 'Private', isPublic: false, userId, username: 'User', updatedAt: new Date(), views: 0, url: '/g/2/test' },
    ]);

    const res = await request(app).post('/api/usergraphs').send({
      userId: userId.toHexString(),
      isUser: true,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('rejects invalid userId length', async () => {
    const res = await request(app).post('/api/usergraphs').send({
      userId: 'short',
      isUser: false,
    });
    expect(res.status).toBe(500);
  });
});
