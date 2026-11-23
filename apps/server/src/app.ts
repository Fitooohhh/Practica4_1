import path from 'node:path';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { ItemRepository } from './repository';
import { validateCreateItem } from './validation';

export function createApp(repository: ItemRepository) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'campuscircular-api' }));

  app.get('/api/items', async (req: Request, res: Response) => {
    try {
      const items = await repository.list({
        search: typeof req.query.search === 'string' ? req.query.search : undefined,
        category: typeof req.query.category === 'string' ? req.query.category : undefined
      });
      res.json({ data: items, total: items.length });
    } catch {
      res.status(500).json({ error: 'No se pudieron cargar los artículos.' });
    }
  });

  app.get('/api/items/:id', async (req, res) => {
    const item = await repository.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Artículo no encontrado.' });
    return res.json({ data: item });
  });

  app.post('/api/items', async (req, res) => {
    const result = validateCreateItem(req.body);
    if (!result.valid) return res.status(400).json({ error: 'Datos inválidos.', details: result.errors });
    try {
      const item = await repository.create(result.data);
      return res.status(201).json({ data: item });
    } catch {
      return res.status(500).json({ error: 'No se pudo crear el artículo.' });
    }
  });

  const webRoot = process.env.WEB_DIST ?? path.resolve(process.cwd(), 'dist-web');
  app.use(express.static(webRoot));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(webRoot, 'index.html')));
  return app;
}
