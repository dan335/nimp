const request = require('supertest');
const { setupTestApp, teardownTestApp, getDb } = require('../../helpers/apiSetup');

let app;

beforeAll(async () => {
  app = await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

afterEach(async () => {
  await getDb().collection('users').deleteMany({});
});


describe('POST /api/createaccount', () => {
  const validUser = {
    username: 'TestUser',
    email: 'test@example.com',
    password1: 'password123',
    password2: 'password123',
  };

  test('creates account successfully', async () => {
    const res = await request(app).post('/api/createaccount').send(validUser);
    expect(res.status).toBe(200);

    const user = await getDb().collection('users').findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
    expect(user.username).toBe('TestUser');
  });

  test('rejects missing username', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      username: '',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Username required');
  });

  test('rejects missing email', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      email: '',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Email required');
  });

  test('rejects email longer than 255 characters', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      email: 'a'.repeat(250) + '@b.com',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('less than 255');
  });

  test('rejects username longer than 28 characters', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      username: 'a'.repeat(30),
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('less than 28');
  });

  test('rejects missing password', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      password1: '',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Password required');
  });

  test('rejects mismatched passwords', async () => {
    const res = await request(app).post('/api/createaccount').send({
      ...validUser,
      password2: 'different',
    });
    expect(res.status).toBe(500);
    expect(res.text).toContain('Passwords do not match');
  });

  test('rejects duplicate email', async () => {
    await request(app).post('/api/createaccount').send(validUser);
    const res = await request(app).post('/api/createaccount').send(validUser);
    expect(res.status).toBe(500);
    expect(res.text).toContain('already exists');
  });

  test('stores hashed password, not plaintext', async () => {
    await request(app).post('/api/createaccount').send(validUser);
    const user = await getDb().collection('users').findOne({ email: 'test@example.com' });
    expect(user.password).not.toBe('password123');
    expect(user.password.startsWith('$2a$') || user.password.startsWith('$2b$')).toBe(true);
  });

  test('trims and lowercases email', async () => {
    await request(app).post('/api/createaccount').send({
      ...validUser,
      email: '  Test@Example.com  ',
    });
    const user = await getDb().collection('users').findOne({ email: 'test@example.com' });
    expect(user).not.toBeNull();
  });
});
