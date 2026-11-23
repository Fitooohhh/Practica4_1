import { CATEGORIES, CONDITIONS, CreateItemInput } from './types';

export function validateCreateItem(value: unknown): { valid: true; data: CreateItemInput } | { valid: false; errors: string[] } {
  if (!value || typeof value !== 'object') return { valid: false, errors: ['El cuerpo es obligatorio.'] };
  const body = value as Record<string, unknown>;
  const errors: string[] = [];

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const owner = typeof body.owner === 'string' ? body.owner.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const condition = typeof body.condition === 'string' ? body.condition : '';

  if (title.length < 3 || title.length > 80) errors.push('El título debe tener entre 3 y 80 caracteres.');
  if (description.length < 10 || description.length > 500) errors.push('La descripción debe tener entre 10 y 500 caracteres.');
  if (!CATEGORIES.includes(category as typeof CATEGORIES[number])) errors.push('La categoría no es válida.');
  if (!CONDITIONS.includes(condition as typeof CONDITIONS[number])) errors.push('El estado no es válido.');
  if (owner.length < 2 || owner.length > 80) errors.push('El propietario debe tener entre 2 y 80 caracteres.');

  if (errors.length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      title,
      description,
      category: category as CreateItemInput['category'],
      condition: condition as CreateItemInput['condition'],
      owner
    }
  };
}
