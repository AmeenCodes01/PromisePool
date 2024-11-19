"use client";
import { useState } from "react";
import gifs from "../data/images.json"; // JSON file with GIF data

function CopyableSearchableGIFGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  // Filter GIFs based on the search query (case-insensitive search)
  const filteredGifs = gifs.filter((gif) =>
    gif.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Function to copy GIF to clipboard
  async function copyGifToClipboard(src: string) {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopyStatus("GIF copied to clipboard!");
      setTimeout(() => setCopyStatus(""), 2000); // Reset status after 2 seconds
    } catch (err) {
      console.error("Failed to copy GIF:", err);
      setCopyStatus("Failed to copy GIF.");
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <input
        type="text"
        placeholder=""
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {/* Display copy status */}
      {copyStatus && <p className="text-green-500 mb-4">{copyStatus}</p>}

      {/* GIF Gallery */}
      <div className="grid md:grid-cols-6 grid-cols-4 gap-4">
        {filteredGifs.length > 0 ? (
          filteredGifs.map((gif) => (
            <div key={gif.path}>
              <img
                src={gif.path}
                alt="GIF"
                draggable="true" // Allows dragging the GIF
                onClick={() => copyGifToClipboard(gif.path)} // Copy on click
                className="cursor-pointer rounded shadow hover:scale-105 transition-transform"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No GIFs found</p>
        )}
      </div>
    </div>
  );
}

export default CopyableSearchableGIFGallery;
