"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [expirationInfo, setExpirationInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const detectFood = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");
    setExpirationInfo([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // First, detect food
      const detectRes = await fetch("http://localhost:8000/detect-food", {
        method: "POST",
        body: formData,
      });
      const detectData = await detectRes.json();
      setResult(detectData.result);

      // Then, get expiration dates
      const expirationRes = await fetch("http://localhost:8000/get-expiration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ detection_result: detectData.result }),
      });
      const expirationData = await expirationRes.json();
      setExpirationInfo(expirationData.expiration_info || []);
    } catch (error) {
      console.error("Error:", error);
    }

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

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white shadow-md p-6 rounded-xl w-[90%] max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Food Detection Results</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-700 whitespace-pre-line">{result}</p>
          </div>
          
          {/* Expiration Information - Simplified */}
          {expirationInfo.length > 0 && (
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800">🗓️ Expiration Date</h3>
              <p className="text-blue-700 font-semibold mt-2">
                Expires: {new Date(expirationInfo[0].expiration_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {expirationInfo.length === 0 && result && (
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-yellow-800">
                ℹ️ No expiration data found in database
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
