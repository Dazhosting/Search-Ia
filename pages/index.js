import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Search AI</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tulis pertanyaan..."
        style={{ width: "100%", padding: 10 }}
      />
      <button onClick={handleSearch} style={{ marginTop: 10 }}>
        Cari
      </button>
      <pre style={{ marginTop: 20, background: "#eee", padding: 10 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
                  }
