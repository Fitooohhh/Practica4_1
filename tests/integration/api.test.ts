import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../apps/server/src/app';
import { MemoryItemRepository } from '../../apps/server/src/repository';

function makeApi() { return request(createApp(new MemoryItemRepository())); }

describe('API de CampusCircular', () => {
  it('responde health check', async () => expect((await makeApi().get('/api/health')).status).toBe(200));
  it('lista artículos con total', async () => {
    const response = await makeApi().get('/api/items');
    expect(response.body.total).toBe(3);
    expect(response.body.data[0]).toHaveProperty('title');
  });
  it('filtra artículos por categoría', async () => {
    const response = await makeApi().get('/api/items?category=Estudio');
    expect(response.status).toBe(200);
    expect(response.body.data.every((item: { category: string }) => item.category === 'Estudio')).toBe(true);
  });
  it('busca artículos por texto', async () => {
    const response = await makeApi().get('/api/items?search=bici');
    expect(response.body.total).toBe(1);
  });
  it('devuelve 404 si no existe un artículo', async () => expect((await makeApi().get('/api/items/no-existe')).status).toBe(404));
  it('crea un artículo válido', async () => {
    const response = await makeApi().post('/api/items').send({ title: 'Mochila impermeable', description: 'Mochila amplia para llevar laptop y cuadernos.', category: 'Estudio', condition: 'Bueno', owner: 'Valeria' });
    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('Mochila impermeable');
  });
  it('rechaza un artículo inválido', async () => {
    const response = await makeApi().post('/api/items').send({ title: 'X' });
    expect(response.status).toBe(400);
    expect(response.body.details.length).toBeGreaterThan(1);
  });
  it('devuelve el artículo recién creado por id', async () => {
    const api = makeApi();
    const created = await api.post('/api/items').send({ title: 'Cuaderno nuevo', description: 'Cuaderno con hojas limpias para apuntes.', category: 'Estudio', condition: 'Nuevo', owner: 'Pablo' });
    const response = await api.get(`/api/items/${created.body.data.id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.owner).toBe('Pablo');
  });
});
