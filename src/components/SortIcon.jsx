export default function SortIcon({ active, order }) {
  if (!active) return <span style={{ opacity: 0.35 }}>↕</span>;
  return order === "asc" ? <span>↑</span> : <span>↓</span>;
}
