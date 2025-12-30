import { useEffect, useMemo, useState } from "react";

import FiltersBar from "./components/FiltersBar";
import PaginationBar from "./components/PaginationBar";
import ItemsTable from "./components/ItemsTable";

import { API_BASE, buildItemsQuery, fetchItems } from "./api/items";

export default function App() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

    // Data state (from backend)
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

    // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryString = useMemo(() => {
    return buildItemsQuery({
      q: q.trim(),
      status,
      category,
      sort,
      order,
      page,
      limit,
    });
  }, [q, status, category, sort, order, page, limit]);

  // Clear filters
  function onClear() {
    setQ("");
    setStatus("");
    setCategory("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
    setLimit(10);
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
      setError("Failed to load items. Check API URL + backend is running.");
      setRows([]);
      setMeta({ page: 1, limit, total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [queryString]);

  function onHeaderClick(field) {
    setPage(1);

    if (sort === field) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setOrder(field === "createdAt" ? "desc" : "asc");
    }
  }

  useEffect(() => {
    setPage(1);
  }, [status, category, q, limit]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">Admin List</h1>
          <p className="subtitle">
            API: <code>{API_BASE}</code>
          </p>
        </div>
      </header>

      <FiltersBar
        q={q}
        setQ={setQ}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        limit={limit}
        setLimit={setLimit}
        onClear={onClear}
      />

      <section className="card">
        <PaginationBar
          loading={loading}
          page={page}
          setPage={setPage}
          meta={meta}
        />

        <ItemsTable
          sort={sort}
          order={order}
          onHeaderClick={onHeaderClick}
          loading={loading}
          error={error}
          rows={rows}
          onRetry={load}
        />
      </section>
    </div>
  );
}


