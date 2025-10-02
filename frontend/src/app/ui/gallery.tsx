"use client";

import { useState, useEffect, useRef } from "react";
import { ImageItem } from "../data/images";

export default function Gallery() {
  const [visible, setVisible] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);
  const [seenIds, setSeenIds] = useState<Set<number>>(new Set());
  const isInitialMount = useRef(true);

  const perPage = parseInt(process.env.NEXT_PUBLIC_IMAGES_PER_PAGE || "12", 10);

  // Load images when filters change or on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadMore();
    } else {
      // Reset and load when filters change
      setSeenIds(new Set());
      setPage(1);
      setVisible([]);
      loadMoreWithPage(1);
    }
  }, [filters]);

  const loadMoreWithPage = async (pageNum: number) => {
    if (loading) return;

    setLoading(true);

    try {
      const filterParam =
        filters.size > 0 ? `&filter=${[...filters].join(",")}` : "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/images?page=${pageNum}&perPage=${perPage}${filterParam}`
      );
      const data: ImageItem[] = await response.json();

      // Filter out images with duplicate ids
      const uniqueData = data.filter((img) => !seenIds.has(img.id));

      // Update the seenIds state to include the new unique image ids
      setSeenIds(
        (prev) => new Set([...prev, ...uniqueData.map((img) => img.id)])
      );

      // Append unique images to the visible list
      setVisible((prev) => [...prev, ...uniqueData]);
      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    loadMoreWithPage(page);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !loading
    ) {
      loadMore();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, filters]);

  const handleKeywordClick = (keyword: string) => {
    setSeenIds(new Set());
    setFilters((prevFilters) => {
      const newFilters = new Set(prevFilters);
      if (newFilters.has(keyword)) {
        newFilters.delete(keyword);
      } else {
        newFilters.add(keyword);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters(new Set());
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">
        📸 Image Gallery with Hashtags
      </h1>

      {filters.size > 0 && (
        <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10 p-4 backdrop-blur-md bg-opacity-50">
          <div className="text-center">
            <p className="text-lg">
              🔎 กำลังกรองด้วยคำว่า{" "}
              <span className="font-semibold text-blue-600">
                #{[...filters].join(", ")}
              </span>
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
            >
              ล้างตัวกรอง
            </button>
          </div>
        </div>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mt-2">
        {visible.map((img, index) => (
          <div
            key={`${img.id}-${index}`}
            className="relative break-inside-avoid overflow-hidden rounded-lg shadow-md dark:bg-gray-800"
          >
            <img src={img.url} alt="" className="w-full h-auto object-cover" />

            <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-wrap gap-2">
              {img.keywords.map((k) => (
                <button
                  key={k}
                  onClick={() => handleKeywordClick(k)}
                  className={`px-2 py-1 text-xs rounded text-white ${
                    filters.has(k)
                      ? "bg-blue-600 dark:bg-blue-700"
                      : "bg-gray-700 dark:bg-gray-600"
                  }`}
                >
                  #{k}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && !loading && (
        <p className="text-center mt-10">ไม่พบรูป</p>
      )}
      {loading && <p className="text-center mt-10">กำลังโหลด...</p>}

      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 focus:outline-none z-20"
      >
        ↑
      </button>
    </div>
  );
}
