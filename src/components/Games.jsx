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

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const getGames = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}games?page=${pageNum}&limit=30`
      );
      const newGames = response?.data?.data?.games || [];
      setGames((prev) => (pageNum === 1 ? newGames : [...prev, ...newGames]));
      setHasNext(response?.data?.data?.pagination?.hasNext);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getGames(1);
    setPage(1);
  }, [getGames]);

  useEffect(() => {
    if (page === 1) return;
    getGames(page);
  }, [page, getGames]);

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
      <div className="text-white text-[36px] max-sm:text-[26px] font-semibold justify-between  items-center text-center  pt-5">
        PLAY YOUR FAVORITE GAME
      </div>

      <div className="grid grid-cols-6 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-2 place-content-center place-items-center gap-1 pt-8 pb-8  px-[20.2rem]  max-lg:px-5">
        {games.map((item, index) => {
          return (
            <Link
              href={`/${item?.gameId}`}
              key={index}
              className="relative overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:border-4 hover:border-[#DCF836] duration-500  w-full h-full"
            >
              <Image
                width={136}
                height={136}
                alt="game-poster"
                className="size-[136px] mx-auto max-lg:size-auto max-md:size-[150px] max-sm:size-[150px] rounded-[20px] object-cover"
                src={item?.thumb}
              />
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
