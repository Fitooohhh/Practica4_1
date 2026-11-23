import { Pool } from 'pg';
import { createApp } from './app';
import { MemoryItemRepository, PostgresItemRepository } from './repository';

const port = Number(process.env.PORT ?? 4000);
const useMemory = process.env.REPOSITORY_MODE === 'memory';
const pool = useMemory ? undefined : new Pool({ connectionString: process.env.DATABASE_URL });
const repository = useMemory ? new MemoryItemRepository() : new PostgresItemRepository(pool!);
const app = createApp(repository);

app.listen(port, () => console.log(`CampusCircular API ejecutándose en http://localhost:${port}`));
