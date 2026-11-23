export const CATEGORIES = ['Estudio', 'Movilidad', 'Hogar', 'Tecnología', 'Ropa', 'Otros'] as const;
export const CONDITIONS = ['Nuevo', 'Bueno', 'Usado'] as const;

export type Category = (typeof CATEGORIES)[number];
export type ItemCondition = (typeof CONDITIONS)[number];

export interface Item {
  id: string;
  title: string;
  description: string;
  category: Category;
  condition: ItemCondition;
  owner: string;
  createdAt: string;
}

export interface CreateItemInput {
  title: string;
  description: string;
  category: Category;
  condition: ItemCondition;
  owner: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
}
