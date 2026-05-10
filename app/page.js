"use client";

import { useState } from "react";

const sampleMatch = {
  name: "Amelia Hartwell",
  story:
    "A 19th-century explorer and journal writer known for crossing the Alps on foot and documenting village folklore.",
};

export default function HomePage() {
  const [imageSrc, setImageSrc] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
  };

  return (
    <main className="page">
      <section className="card">
        <h1>ECHO – Find Your Doppelganger</h1>

        {!imageSrc ? (
          <label className="uploadButton">
            Upload a photo
            <input type="file" accept="image/*" onChange={handleUpload} />
          </label>
        ) : (
          <div className="result">
            <img className="preview" src={imageSrc} alt="Uploaded preview" />
            <p className="score">You are 82% aligned with a historical twin</p>
            <div className="matchCard">
              <h2>{sampleMatch.name}</h2>
              <p>{sampleMatch.story}</p>
            </div>
            <label className="uploadButton secondary">
              Try a different photo
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>
          </div>
        )}
      </section>
    </main>
  );
}
