export default function PaginationBar({ loading, page, setPage, meta }) {
  const showingFrom =
    meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
  const showingTo = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="pagination">
      <div className="pagination__info">
        {meta.total === 0
          ? "No results"
          : `Showing ${showingFrom}–${showingTo} of ${meta.total}`}
      </div>

      <div className="pagination__controls">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || page <= 1}
        >
          Prev
        </button>

        <div className="pagination__page">
          Page <strong>{meta.page}</strong> / {meta.totalPages}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
          disabled={loading || page >= meta.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
