const request = require('supertest');
const { createApp } = require('../src/app');

describe('API de tareas', () => {
  let app;
  beforeEach(() => {
    app = createApp();
  });

  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /api/version usa variables de entorno', async () => {
    process.env.APP_VERSION = '9.9.9';
    const res = await request(app).get('/api/version');
    expect(res.body.version).toBe('9.9.9');
    delete process.env.APP_VERSION;
  });

  test('GET /api/tareas lista las tareas iniciales', async () => {
    const res = await request(app).get('/api/tareas');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('POST /api/tareas crea una tarea', async () => {
    const res = await request(app).post('/api/tareas').send({ titulo: 'Desplegar a Pages' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 3, titulo: 'Desplegar a Pages', hecha: false });
  });

  test('POST /api/tareas sin titulo devuelve 400', async () => {
    const res = await request(app).post('/api/tareas').send({});
    expect(res.status).toBe(400);
  });

  test('PATCH /api/tareas/:id marca como hecha', async () => {
    const res = await request(app).patch('/api/tareas/2').send({ hecha: true });
    expect(res.status).toBe(200);
    expect(res.body.hecha).toBe(true);
  });

  test('PATCH /api/tareas/:id inexistente devuelve 404', async () => {
    const res = await request(app).patch('/api/tareas/999').send({ hecha: true });
    expect(res.status).toBe(404);
  });
});
