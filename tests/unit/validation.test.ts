import { describe, expect, it } from 'vitest';
import { validateCreateItem } from '../../apps/server/src/validation';

const valid = { title: 'Libro de cálculo', description: 'Texto suficientemente largo para validar el artículo.', category: 'Estudio', condition: 'Bueno', owner: 'Sofía' };

describe('validateCreateItem', () => {
  it('acepta un artículo válido', () => expect(validateCreateItem(valid).valid).toBe(true));
  it('rechaza un cuerpo vacío', () => expect(validateCreateItem(undefined)).toEqual({ valid: false, errors: ['El cuerpo es obligatorio.'] }));
  it('rechaza un título demasiado corto', () => expect(validateCreateItem({ ...valid, title: 'AB' }).valid).toBe(false));
  it('rechaza una descripción demasiado corta', () => expect(validateCreateItem({ ...valid, description: 'corta' }).valid).toBe(false));
  it('rechaza una categoría desconocida', () => expect(validateCreateItem({ ...valid, category: 'Mascotas' }).valid).toBe(false));
  it('rechaza un estado desconocido', () => expect(validateCreateItem({ ...valid, condition: 'Roto' }).valid).toBe(false));
  it('rechaza un propietario vacío', () => expect(validateCreateItem({ ...valid, owner: '' }).valid).toBe(false));
  it('recorta espacios antes de devolver los datos', () => {
    const result = validateCreateItem({ ...valid, title: '  Libro útil  ', owner: '  Sofía ' });
    expect(result.valid && result.data.title).toBe('Libro útil');
  });
});
