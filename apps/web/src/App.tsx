import { FormEvent, useEffect, useState } from 'react';

type Item = { id: string; title: string; description: string; category: string; condition: string; owner: string; createdAt: string };
const categories = ['Todas', 'Estudio', 'Movilidad', 'Hogar', 'Tecnología', 'Ropa', 'Otros'];

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'Estudio', condition: 'Nuevo', owner: '' });

  async function loadItems() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'Todas') params.set('category', category);
    const response = await fetch(`/api/items?${params}`);
    const result = await response.json();
    setItems(result.data ?? []);
  }

  useEffect(() => { void loadItems(); }, [search, category]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    const response = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.details?.join(' ') ?? result.error); return; }
    setMessage('¡Artículo publicado!');
    setForm({ title: '', description: '', category: 'Estudio', condition: 'Nuevo', owner: '' });
    await loadItems();
  }

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">MVP · ECONOMÍA CIRCULAR UNIVERSITARIA</p>
          <h1>Campus<span>Circular</span></h1>
          <p className="hero-copy">Dale una segunda vida a lo que ya no usas y encuentra lo que necesitas dentro de tu comunidad.</p>
        </div>
        <div className="hero-badge">♻️<small>menos residuos<br />más comunidad</small></div>
      </header>

      <section className="toolbar" aria-label="Filtros del catálogo">
        <input data-testid="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, descripción o persona…" />
        <select data-testid="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((option) => <option key={option}>{option}</option>)}</select>
      </section>

      <section className="content-grid">
        <div className="catalog-section">
          <div className="section-heading"><div><p className="eyebrow">EXPLORA</p><h2>Objetos disponibles</h2></div><span className="count">{items.length} publicados</span></div>
          <div className="cards" data-testid="item-list">
            {items.map((item) => <article className="card" key={item.id} data-testid="item-card"><div className="card-top"><span className="tag">{item.category}</span><span className="condition">{item.condition}</span></div><h3>{item.title}</h3><p>{item.description}</p><footer><span>Por {item.owner}</span><span className="arrow">→</span></footer></article>)}
            {items.length === 0 && <div className="empty">No encontramos artículos con esos filtros.</div>}
          </div>
        </div>

        <aside className="form-panel"><p className="eyebrow">COMPARTE</p><h2>Publica un artículo</h2><p className="panel-copy">Cuéntale a la comunidad qué tienes para intercambiar o regalar.</p>
          <form onSubmit={submit}>
            <label>Título<input data-testid="title-input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Mochila impermeable" /></label>
            <label>Descripción<textarea data-testid="description-input" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe el objeto y cómo puede ayudar…" /></label>
            <div className="two-cols"><label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((option) => <option key={option}>{option}</option>)}</select></label><label>Estado<select value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })}><option>Nuevo</option><option>Bueno</option><option>Usado</option></select></label></div>
            <label>Tu nombre<input data-testid="owner-input" required value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} placeholder="Ej. Valeria" /></label>
            <button data-testid="submit-button" type="submit">Publicar en CampusCircular <span>↗</span></button>
            {message && <p className="form-message" role="status">{message}</p>}
          </form>
        </aside>
      </section>
      <footer className="site-footer">Construido para la comunidad universitaria · CampusCircular 2026</footer>
    </main>
  );
}
