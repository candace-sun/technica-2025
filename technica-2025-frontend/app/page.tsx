"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/detect-food", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult("Error detecting food");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Food Detector</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
      />

      <button onClick={handleSubmit} style={{ marginLeft: 10 }}>
        Detect Food
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Results:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
