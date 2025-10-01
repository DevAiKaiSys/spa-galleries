"use client";
import { useState, useEffect } from "react";
import { images, ImageItem } from "../data/images";

export default function Gallery() {
  const [visible, setVisible] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string | null>(null);

  const perPage = 20;

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = () => {
    const filtered = filter
      ? images.filter(img => img.keywords.includes(filter))
      : images;

    const next = filtered.slice(0, page * perPage);
    setVisible(next);
    setPage(p => p + 1);
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filter]);

  const handleKeywordClick = (keyword: string) => {
    setFilter(keyword);
    setPage(1);
    setVisible(images.filter(img => img.keywords.includes(keyword)).slice(0, perPage));
  };

  return (
    <div>
      {/* Masonry layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {visible.map((img) => (
          <div
            key={img.id}
            className="relative break-inside-avoid overflow-hidden rounded-lg shadow-md"
          >
            {/* รูปภาพ */}
            <img src={img.url} alt="" className="w-full h-auto object-cover" />

            {/* keywords overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-wrap gap-2">
              {img.keywords.map(k => (
                <button
                  key={k}
                  onClick={() => handleKeywordClick(k)}
                  className={`px-2 py-1 text-xs rounded text-white ${
                    filter === k ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  #{k}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && <p className="text-center mt-10">ไม่พบรูป</p>}
    </div>
  );
}
