"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const generateZeroWaste = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/zero-waste-recipe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(
      typeof data.result === "string"
        ? data.result
        : JSON.stringify(data.result, null, 2)
    );
    setLoading(false);
};


  const detectFood = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/detect-food", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
  setResult(
    typeof data.result === "string"
      ? data.result
      : JSON.stringify(data.result, null, 2)
  );
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center py-12 px-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">🍽️ Food Detector</h1>

      {/* Upload Box */}
      <label
        htmlFor="fileUpload"
        className="cursor-pointer bg-white shadow-md rounded-xl p-6 border-2 border-dashed hover:border-blue-500 transition text-center w-80"
      >
        <p className="text-gray-600">Click to upload an image</p>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {/* Image Preview */}
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="w-60 h-60 object-cover rounded-xl shadow"
          />
        </div>
      )}

      {/* Detect Button */}
      <button
        onClick={detectFood}
        disabled={!file || loading}
        className={`mt-6 px-6 py-3 rounded-xl text-white font-semibold shadow 
          ${
            loading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            Processing…
          </div>
        ) : (
          "Detect Food"
        )}
      </button>

      {/* try zero waste */ }
      <button
        onClick={generateZeroWaste}
        disabled={!file || loading}
        className={`mt-6 px-6 py-3 rounded-xl text-white font-semibold shadow bg-gray-400`}
        
        
      >
       Generate Zero-Waste Recipe
    </button>

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white shadow-md p-6 rounded-xl w-[90%] max-w-xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Result</h2>
          <p className="text-gray-700 whitespace-pre-line">{result}</p>
        </div>
      )}
    </main>
  );
}
