"use client";
import Image from "next/image";
import Script from "next/script";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const AdsterraAd = dynamic(() => import("@/components/AdsterraAd"), {
  ssr: false,
});
export default function Games() {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getGames = useCallback(async (pageNum = 1, searchValue = "") => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_BASE_URL}games?page=${pageNum}&limit=24`;
      if (searchValue) {
        url += `&search=${encodeURIComponent(searchValue)}`;
      }
      const response = await axios.get(url);
      const newGames = response?.data?.data?.games || [];
      setGames(newGames);
      setHasNext(response?.data?.data?.pagination?.hasNext);
      setHasPrev(pageNum > 1);
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

  const handleNextPage = () => {
    if (hasNext && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      getGames(nextPage, debouncedSearch);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && !loading) {
      const prevPage = page - 1;
      setPage(prevPage);
      getGames(prevPage, debouncedSearch);
    }
  };

  const handleClick = (e, gameId) => {
    e.preventDefault();
    // const adScript = document.createElement("script");
    // adScript.type = "text/javascript";
    // adScript.src =
    //   "//pl27199328.profitableratecpm.com/2c/ad/9e/2cad9e29e745bfa5d8929d583d48ed29.js";
    // adScript.async = true;
    // document.body.appendChild(adScript);

    // setTimeout(() => {
    router.push(`/${gameId}`);
    // }, 1500);
  };

  return (
    <div className="pt-20">
      {/* pop-up ads */}
      {/* <Script
        type="text/javascript"
        src="//pl27199328.profitableratecpm.com/2c/ad/9e/2cad9e29e745bfa5d8929d583d48ed29.js"
      ></Script> */}
      {/* pop-up ads */}
      {isClient && window.location.pathname === "/" && (
        <h1 className="text-white text-[36px] max-sm:text-[26px] font-semibold justify-between items-center text-center pt-5">
          PLAY YOUR FAVORITE GAME
        </h1>
      )}

      {/* <AdsterraAd
        keyId="33c38de2503eaee4251a5962d435100d"
        width={160}
        height={50}
      /> */}

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
              className="absolute right-3 max-md:right-5 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
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
      <div className="game_container pt-[32px] px-[20.2rem] media_resp max-lg:px-5">
        {loading ? (
          <div className="flex justify-center items-center w-full h-64 col-span-full">
            <div className="loader border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin border-t-[#DCF836]" />
          </div>
        ) : (
          games?.map((item, index) => (
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
          ))
        )}
      </div>
      {/* working ads*/}
      {/* <div id="container-ff32eb879155623c7d2e3f92b411feaf"></div>
      <Script
        src="//pl27191963.profitableratecpm.com/ff32eb879155623c7d2e3f92b411feaf/invoke.js"
        data-cfasync="false"
        strategy="afterInteractive"
        async
      /> */}
      {/* <div className="game_container px-[20.2rem] media_resp max-lg:px-5">
        {loading ? (
          <div className="flex justify-center items-center w-full h-64 col-span-full">
            <div className="loader border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin border-t-[#DCF836]" />
          </div>
        ) : (
          games?.slice(12, 25).map((item, index) => (
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
          ))
        )}
      </div> */}

      {/* <AdsterraAd
        keyId="ecba41c690f4c72c724c02b884fe6e13"
        width={300}
        height={250}
      /> */}

      {/* Pagination Buttons */}
      <div className="flex justify-center items-center gap-4 py-8">
        <button
          onClick={handlePrevPage}
          disabled={!hasPrev || loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            hasPrev && !loading
              ? "bg-[#DCF836] text-black hover:bg-[#c4e030]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>

        <span className="text-white font-medium">Page {page}</span>

        <button
          onClick={handleNextPage}
          disabled={!hasNext || loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            hasNext && !loading
              ? "bg-[#DCF836] text-black hover:bg-[#c4e030]"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
      {/* <AdsterraAd
        keyId="5d5abcca14de57540562622c80497b3d"
        width={320}
        height={50}
      /> */}

      {/* social bar ads */}
      <div id="container-0d8fc43bdea8a840875c81f3bb6d87a4"></div>
      {/* <Script
        type="text/javascript"
        src="//pl27199319.profitableratecpm.com/0d/8f/c4/0d8fc43bdea8a840875c81f3bb6d87a4.js"
      ></Script> */}
    </div>
    // </div>
  );
}
