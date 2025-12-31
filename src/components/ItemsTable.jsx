import SortIcon from "./SortIcon";

  // Priority
  function getPriorityClass(priority) {
    switch (priority) {
      case "low":
        return "low";
      case "medium":
        return "medium";
      case "high":
        return "high";
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
}) {
  return (
    <div className="table-wrapper">
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
            <tr>
              <td colSpan={6} className="td">
                ⏳ Loading items…
              </td>
            </tr>
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
            rows.map((item) => (
              <tr
                key={item.id}
                className={`tr ${item.id === selectedId ? "tr--selected" : ""}`}
                onClick={() => onRowClick(item.id)}
              >
                <td className="td">{item.name}</td>

                <td className="td">
                  <span className={`pill pill--${item.status}`}>
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
