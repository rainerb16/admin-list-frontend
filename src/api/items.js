const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Turn UI state into query params for the backend
export function buildItemsQuery(params) {
  const qs = new URLSearchParams();

  if (params.q) qs.set("q", params.q);
  if (params.status) qs.set("status", params.status);
  if (params.category) qs.set("category", params.category);

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

export { API_BASE };