export default function FiltersBar({
  q,
  setQ,
  status,
  setStatus,
  category,
  setCategory,
  limit,
  setLimit,
  onClear,
}) {
  return (
    <section className="controls">
      <div className="control">
        <label>Search</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or notes..."
        />
      </div>

      <div className="control">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="active">active</option>
          <option value="paused">paused</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <div className="control">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="general">general</option>
          <option value="work">work</option>
          <option value="personal">personal</option>
        </select>
      </div>

      <div className="control">
        <label>Per page</label>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="control">
        <button type="button" onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}
