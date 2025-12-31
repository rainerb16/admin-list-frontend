import { useEffect, useRef } from "react";
import SortIcon from "./SortIcon";

  // Priority
  function getPriorityClass(priority) {
  switch (priority) {
    case "low":
      return "pill--low";
    case "medium":
      return "pill--medium";
    case "high":
      return "pill--high";
    default:
      return "";
  }
}

export default function ItemsTable({
  sort,
  order,
  onHeaderClick,
  loading,
  error,
  rows,
  onRetry,
  onRowClick,
  selectedId,
  setActiveIndex,
  onTableKeyDown,
  activeIndex,
}) {
  const wrapperRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    const el = rowRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div 
      ref={wrapperRef}  
      className="table-wrapper"
      tabIndex={0}
      onKeyDown={onTableKeyDown}
      onClick={(e) => e.currentTarget.focus()}
      aria-label="Items table"
    >
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="th" onClick={() => onHeaderClick("name")}>
              Name <SortIcon active={sort === "name"} order={order} />
            </th>

            <th className="th" onClick={() => onHeaderClick("status")}>
              Status <SortIcon active={sort === "status"} order={order} />
            </th>

            <th className="th" onClick={() => onHeaderClick("priority")}>
              Priority <SortIcon active={sort === "priority"} order={order} />
            </th>

            <th className="th">Category</th>

            <th className="th" onClick={() => onHeaderClick("createdAt")}>
              Created <SortIcon active={sort === "createdAt"} order={order} />
            </th>

            <th className="th">Notes</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={`sk-${i}`} className="tr tr--skeleton">
                <td className="td"><div className="skeleton skeleton--w40" /></td>
                <td className="td"><div className="skeleton skeleton--w30" /></td>
                <td className="td"><div className="skeleton skeleton--w25" /></td>
                <td className="td"><div className="skeleton skeleton--w30" /></td>
                <td className="td"><div className="skeleton skeleton--w35" /></td>
                <td className="td"><div className="skeleton skeleton--w60" /></td>
              </tr>
            ))
          ) : error ? (
            <tr>
              <td colSpan={6} className="td">
                <div className="error">{error}</div>
                <button type="button" onClick={onRetry}>
                  Retry
                </button>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="td">
                No matching items.
              </td>
            </tr>
          ) : (
            rows.map((item,idx) => (
              <tr
                key={item.id}
                ref={(el) => (rowRefs.current[idx] = el)}
                className={`tr
                  ${item.id === selectedId ? "tr--selected" : ""}
                  ${idx === activeIndex ? "tr--active" : ""}
                `}
                onClick={() => !loading && onRowClick(item.id)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <td className="td">{item.name}</td>

                <td className="td">
                  <span className={`pill pill--${item.status}`}>
                    {item.status === "active" ? "● " : item.status === "paused" ? "⏸ " : "⛁ "}
                    {item.status}
                  </span>
                </td>

                <td className="td">
                  <span className={`pill ${getPriorityClass(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>

                <td className="td">{item.category}</td>

                <td className="td">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td className="td">{item.notes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
