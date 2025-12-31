import { useEffect, useMemo, useState } from "react";

import FiltersBar from "./components/FiltersBar";
import PaginationBar from "./components/PaginationBar";
import ItemsTable from "./components/ItemsTable";
import DetailPanel from "./components/DetailPanel";

import { API_BASE, buildItemsQuery, fetchItems, patchItem } from "./api/items";
export default function App() {
  // Table controls
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Keyboard + Accessibility
  const [activeIndex, setActiveIndex] = useState(0);

  // Selection (detail panel)
  const [selectedId, setSelectedId] = useState(null);

  // Data state
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Build query string whenever controls change
  const queryString = useMemo(() => {
    return buildItemsQuery({
      q: q.trim(),
      status,
      category,
      priority,
      sort,
      order,
      page,
      limit,
    });
  }, [q, status, category, priority, sort, order, page, limit]);

  // Derive selected item from rows + selectedId
  const selectedItem = useMemo(() => {
    if (selectedId == null) return null;
    return rows.find((r) => r.id === selectedId) || null;
  }, [rows, selectedId]);

  // Clear filters
  function onClear() {
    setQ("");
    setStatus("");
    setCategory("");
    setPriority("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    setLimit(10);
    setSelectedId(null);
  }

  async function load() {
    setLoading(true);
    setError("");

    try {
      const json = await fetchItems(queryString);
      setRows(Array.isArray(json.data) ? json.data : []);
      setMeta(
        json.meta || {
          page,
          limit,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (e) {
      console.error(e);
      setError("Failed to load items. Check API URL + backend is running.");
      setRows([]);
      setMeta({ page: 1, limit, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(id, updates) {
    setSaving(true);
    setError("");

    try {
      await patchItem(id, updates);
      await load();
      setSelectedId(null);
    } catch (e) {
      console.error(e);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function onRowClick(id) {
    setSelectedId(id);
  }

  // Fetch whenever query changes
  useEffect(() => {
    load();
  }, [queryString]);

  // Sorting UI
  function onHeaderClick(field) {
    setPage(1);

    if (sort === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      const defaultOrder = field === "createdAt" ? "desc" : "asc";
      setOrder(field === "priority" ? "desc" : defaultOrder);
    }
  }

  // Reset to page 1 when filters/search/per-page changes
  useEffect(() => {
    setPage(1);
  }, [status, category, priority, q, limit]);

  // Reset active index
  useEffect(() => {
    setActiveIndex(0);
  }, [queryString]);

  //  Key Handler Function
  function onTableKeyDown(e) {
  if (loading) return;
  if (!rows || rows.length === 0) return;

  // Don't steal keys while user is typing in an input/textarea/select
  const tag = e.target.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActiveIndex((i) => Math.min(rows.length - 1, i + 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActiveIndex((i) => Math.max(0, i - 1));
  } else if (e.key === "Enter") {
    e.preventDefault();
    const item = rows[activeIndex];
    if (item) setSelectedId(item.id);
  } else if (e.key === "Escape") {
    e.preventDefault();
    setSelectedId(null);
  }
}

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Admin List</h1>
        </div>
      </header>

      <FiltersBar
        q={q}
        setQ={setQ}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        priority={priority}
        setPriority={setPriority}
        limit={limit}
        setLimit={setLimit}
        onClear={onClear}
      />

      <section className="card layout">
        <div className="layout__main">
          <PaginationBar loading={loading} page={page} setPage={setPage} meta={meta} />

          <ItemsTable
            sort={sort}
            order={order}
            onHeaderClick={onHeaderClick}
            loading={loading}
            error={error}
            rows={rows}
            onRetry={load}
            onRowClick={onRowClick}
            selectedId={selectedId}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onTableKeyDown={onTableKeyDown}
          />
        </div>
        <DetailPanel
          item={selectedItem}
          saving={saving}
          onClose={() => setSelectedId(null)}
          onSave={handleSave}
        />
      </section>
    </div>
  );
}
