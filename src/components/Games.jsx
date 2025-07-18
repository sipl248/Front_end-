"use client";
import Image from "next/image";
import Script from "next/script";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Games() {
  const router = useRouter();
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
    }, 500);
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

  useEffect(() => {
    getGames(1, debouncedSearch);
    setPage(1);
  }, [getGames, debouncedSearch]);

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

  const handleClick = (e, gameId) => {
    e.preventDefault();
    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src =
      "//pl27199328.profitableratecpm.com/2c/ad/9e/2cad9e29e745bfa5d8929d583d48ed29.js";
    adScript.async = true;
    document.body.appendChild(adScript);

    setTimeout(() => {
      router.push(`/${gameId}`);
    }, 1500);
  };

  return (
    <div className="pt-20">
      <h1 className="text-white text-[36px] max-sm:text-[26px] font-semibold justify-between items-center text-center pt-5">
        PLAY YOUR FAVORITE GAME
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center text-white mt-4">
        <div className="relative w-full max-w-md max-md:px-4 max-sm:px-4">
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

      {/* Game Grid */}
      <div className="game_container px-[20.2rem] media_resp max-lg:px-5">
        {games.map((item, index) => (
          <div
            onClick={(e) => handleClick(e, item?.gameId)}
            key={index}
            className="justify-between gap-5 cursor-pointer w-full h-full"
          >
            <div className="relative group w-full h-full">
              <div className="relative overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:border-4 hover:border-[#DCF836] duration-500 w-full h-full">
                <Image
                  width={200}
                  height={200}
                  alt="game-poster"
                  className="w-full object-cover"
                  src={item?.thumb}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Inline Ad (300x250) */}
        <div className="w-full flex justify-center my-8">
          <Script strategy="afterInteractive" id="ad-300x250">
            {`
              atOptions = {
                'key': 'ecba41c690f4c72c724c02b884fe6e13',
                'format': 'iframe',
                'height': 250,
                'width': 300,
                'params': {}
              };
            `}
          </Script>
          <Script
            strategy="afterInteractive"
            src="//www.highperformanceformat.com/ecba41c690f4c72c724c02b884fe6e13/invoke.js"
          />
          <div id="container-ecba41c690f4c72c724c02b884fe6e13"></div>
        </div>
      </div>

      {/* layout ad for demo */}
      <Script
        src="//pl27191963.profitableratecpm.com/ff32eb879155623c7d2e3f92b411feaf/invoke.js"
        data-cfasync="false"
        strategy="afterInteractive"
        async
      />
      <div id="container-ff32eb879155623c7d2e3f92b411feaf"></div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center pb-8">
          <div className="loader border-4 border-t-4 border-gray-200 h-8 w-8 rounded-full animate-spin border-t-[#DCF836]" />
        </div>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Bottom Ad (468x60) */}
      <div className="flex justify-center  ">
        <Script strategy="afterInteractive" id="ad-468x60">
          {`
            atOptions = {
              'key': 'c0957bab1658f4edf3a744cc4ab8e9f7',
              'format': 'iframe',
              'height': 60,
              'width': 468,
              'params': {}
            };
          `}
        </Script>
        <Script
          strategy="afterInteractive"
          src="//www.highperformanceformat.com/c0957bab1658f4edf3a744cc4ab8e9f7/invoke.js"
        />
      </div>

      {/* Mobile Ad (320x50) */}
      <div className="flex justify-center mb-8 sm:hidden">
        <Script strategy="afterInteractive" id="ad-320x50">
          {`
            atOptions = {
              'key': '5d5abcca14de57540562622c80497b3d',
              'format': 'iframe',
              'height': 50,
              'width': 320,
              'params': {}
            };
          `}
        </Script>
        <Script
          strategy="afterInteractive"
          src="//www.highperformanceformat.com/5d5abcca14de57540562622c80497b3d/invoke.js"
        />
        <div id="container-5d5abcca14de57540562622c80497b3d"></div>
      </div>
      <div id="container-5d5abcca14de57540562622c80497b3d"></div>

      {/* Sticky Footer Ad */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-black">
        <div id="container-ff32eb879155623c7d2e3f92b411feaf"></div>
        <Script
          async
          data-cfasync="false"
          strategy="afterInteractive"
          src="//pl27191963.profitableratecpm.com/ff32eb879155623c7d2e3f92b411feaf/invoke.js"
        />
      </div>
    </div>
  );
}
