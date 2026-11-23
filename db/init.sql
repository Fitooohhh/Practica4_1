CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY,
  title VARCHAR(80) NOT NULL,
  description VARCHAR(500) NOT NULL,
  category VARCHAR(40) NOT NULL,
  condition VARCHAR(30) NOT NULL,
  owner VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);

INSERT INTO items (id, title, description, category, condition, owner)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Calculadora científica', 'Calculadora en buen estado para cursos de ingeniería.', 'Estudio', 'Usado', 'Ana'),
  ('22222222-2222-4222-8222-222222222222', 'Bicicleta urbana', 'Bicicleta con canasto, ideal para moverse por el campus.', 'Movilidad', 'Bueno', 'Luis'),
  ('33333333-3333-4333-8333-333333333333', 'Maceta autorregable', 'Maceta pequeña para escritorio hecha con material reutilizado.', 'Hogar', 'Nuevo', 'María')
ON CONFLICT (id) DO NOTHING;
