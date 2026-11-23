import { describe, expect, it } from 'vitest';
import { MemoryItemRepository } from '../../apps/server/src/repository';

describe('MemoryItemRepository', () => {
  it('inicia con artículos de demostración', async () => expect((await new MemoryItemRepository().list()).length).toBe(3));
  it('filtra por texto', async () => expect((await new MemoryItemRepository().list({ search: 'bici' }))[0].title).toContain('Bicicleta'));
  it('filtra por categoría', async () => expect((await new MemoryItemRepository().list({ category: 'Hogar' })).every((item) => item.category === 'Hogar')).toBe(true));
  it('combina texto y categoría', async () => expect((await new MemoryItemRepository().list({ search: 'calculadora', category: 'Movilidad' })).length).toBe(0));
  it('crea un artículo con identificador', async () => {
    const repo = new MemoryItemRepository();
    const item = await repo.create({ title: 'Lámpara LED', description: 'Lámpara de escritorio de bajo consumo.', category: 'Hogar', condition: 'Bueno', owner: 'Diego' });
    expect(item.id).toBeTruthy();
    expect((await repo.list()).length).toBe(4);
  });
  it('encuentra un artículo por id', async () => {
    const item = await new MemoryItemRepository().findById('11111111-1111-4111-8111-111111111111');
    expect(item?.owner).toBe('Ana');
  });
});
