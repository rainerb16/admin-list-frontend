import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${BASE_URL}/items`);
      if (!response.ok) throw new Error(response.statusText);
      const json = await response.json();
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  run();
}, []);

  return (
    <div>
      <h1>Admin List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      
      {!loading && !error && (
        <div>
          {JSON.stringify(items, null, 2)}
        </div>
      )}
    </div>
  );
}