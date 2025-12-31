const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Turn UI state into query params for the backend
export function buildItemsQuery(params) {
  const qs = new URLSearchParams();

  if (params.q) qs.set("q", params.q);
  if (params.status) qs.set("status", params.status);
  if (params.category) qs.set("category", params.category);
  if (params.priority) qs.set("priority", params.priority);

  qs.set("sort", params.sort);
  qs.set("order", params.order);
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));

  return qs.toString();
}

// Fetch the list from GET /items
export async function fetchItems(queryString) {
  const res = await fetch(`${API_BASE}/items?${queryString}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // expects { data: [...], meta: {...} }
}

/* Update an item by sending a PATCH request to /items/:id */
export async function patchItem(id, updates) {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* Add new item with POST request to /items */
export async function createItem(payload) {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export { API_BASE };