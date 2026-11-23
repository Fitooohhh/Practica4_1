import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { CreateItemInput, Item, ItemFilters } from './types';

export interface ItemRepository {
  list(filters?: ItemFilters): Promise<Item[]>;
  findById(id: string): Promise<Item | undefined>;
  create(input: CreateItemInput): Promise<Item>;
}

const seed: Item[] = [
  { id: '11111111-1111-4111-8111-111111111111', title: 'Calculadora científica', description: 'Calculadora en buen estado para cursos de ingeniería.', category: 'Estudio', condition: 'Usado', owner: 'Ana', createdAt: '2026-01-10T10:00:00.000Z' },
  { id: '22222222-2222-4222-8222-222222222222', title: 'Bicicleta urbana', description: 'Bicicleta con canasto, ideal para moverse por el campus.', category: 'Movilidad', condition: 'Bueno', owner: 'Luis', createdAt: '2026-01-09T10:00:00.000Z' },
  { id: '33333333-3333-4333-8333-333333333333', title: 'Maceta autorregable', description: 'Maceta pequeña para escritorio hecha con material reutilizado.', category: 'Hogar', condition: 'Nuevo', owner: 'María', createdAt: '2026-01-08T10:00:00.000Z' }
];

export class MemoryItemRepository implements ItemRepository {
  private items: Item[];

  constructor(initialItems: Item[] = seed) {
    this.items = [...initialItems];
  }

  async list(filters: ItemFilters = {}): Promise<Item[]> {
    const search = filters.search?.toLowerCase().trim();
    return this.items.filter((item) => {
      const matchesSearch = !search || `${item.title} ${item.description} ${item.owner}`.toLowerCase().includes(search);
      const matchesCategory = !filters.category || item.category === filters.category;
      return matchesSearch && matchesCategory;
    });
  }

  async findById(id: string): Promise<Item | undefined> {
    return this.items.find((item) => item.id === id);
  }

  async create(input: CreateItemInput): Promise<Item> {
    const item: Item = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
    this.items.unshift(item);
    return item;
  }
}

export class PostgresItemRepository implements ItemRepository {
  constructor(private readonly pool: Pool) {}

  async list(filters: ItemFilters = {}): Promise<Item[]> {
    const values: string[] = [];
    const where: string[] = [];
    if (filters.search) {
      values.push(`%${filters.search}%`);
      where.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length} OR owner ILIKE $${values.length})`);
    }
    if (filters.category) {
      values.push(filters.category);
      where.push(`category = $${values.length}`);
    }
    const result = await this.pool.query(
      `SELECT id, title, description, category, condition, owner, created_at AS "createdAt" FROM items ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`,
      values
    );
    return result.rows;
  }

  async findById(id: string): Promise<Item | undefined> {
    const result = await this.pool.query('SELECT id, title, description, category, condition, owner, created_at AS "createdAt" FROM items WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(input: CreateItemInput): Promise<Item> {
    const result = await this.pool.query(
      'INSERT INTO items (id, title, description, category, condition, owner) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, description, category, condition, owner, created_at AS "createdAt"',
      [randomUUID(), input.title, input.description, input.category, input.condition, input.owner]
    );
    return result.rows[0];
  }
}
