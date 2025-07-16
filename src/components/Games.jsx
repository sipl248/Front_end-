"use client";
import Image from "next/image";
import Link from "next/link";
import { GAMES } from "./Constant";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Games() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  const getGames = useCallback(async (pageNum = 1, searchValue = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}games?page=${pageNum}&limit=30`;
      if (searchValue) {
        url += `&search=${encodeURIComponent(searchValue)}`;
      }
      const response = await axios.get(url);
      const newGames = response?.data?.data?.games || [];
      setGames((prev) => (pageNum === 1 ? newGames : [...prev, ...newGames]));
      setHasNext(response?.data?.data?.pagination?.hasNext);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch games on mount and when debouncedSearch changes
  useEffect(() => {
    getGames(1, debouncedSearch);
    setPage(1);
  }, [getGames, debouncedSearch]);

  // Fetch more games on page change (except for first page)
  useEffect(() => {
    if (page === 1) return;
    getGames(page, debouncedSearch);
  }, [page, getGames, debouncedSearch]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNext, loading]);

  return (
    <div className="pt-20">
      <h1 className="text-white text-[36px] max-sm:text-[26px] font-semibold justify-between  items-center text-center  pt-5">
        PLAY YOUR FAVORITE GAME
      </h1>
      {/* Search Bar */}
      <div className="flex justify-center text-white mt-4 ">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#DCF836] pr-10 bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
              aria-label="Clear search"
            >
              {/* SVG Close Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 6L6 18M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="game_container  px-[20.2rem] media_resp   max-lg:px-5">
        {games.map((item, index) => {
          return (
            <Link
              href={`/${item?.gameId}`}
              key={index}
              className="justify-between gap-5 cursor-pointer w-full h-full"
            >
              <div className="relative group w-full h-full">
                <div className="relative overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:border-4 hover:border-[#DCF836] duration-500  w-full h-full">
                  <Image
                    width={200}
                    height={200}
                    alt="game-poster"
                    className="w-full  object-cover"
                    src={item?.thumb}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {loading && (
        <div className="flex justify-center pb-8">
          <div className="loader border-4 border-t-4 border-gray-200 h-8 w-8 rounded-full animate-spin border-t-[#DCF836]" />
        </div>
      )}
      {/* Sentinel for Intersection Observer */}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
