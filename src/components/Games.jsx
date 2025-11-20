"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { titleToSlug } from "@/utils/urlUtils";
import AdSenseSlot from "@/components/AdSenseSlot";
const AdsterraAd = dynamic(() => import("@/components/AdsterraAd"), {
  ssr: false,
});
export default function Games(props) {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-white/70">Loading...</div>}>
      <GamesInner {...props} />
    </Suspense>
  );
}

function GamesInner({ showSearch = true, compact = false, sectionTitle = "", disablePagination = false, hideFooterSpace = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [categoryData, setCategoryData] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [shouldLoadCategories, setShouldLoadCategories] = useState(false);
  const categorySectionRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const getGames = useCallback(async (pageNum = 1, searchValue = "", category = "", append = false) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) {
        console.error("NEXT_PUBLIC_BASE_API_URL is not defined");
        setLoading(false);
        return;
      }

      let url = `${baseUrl}games?page=${pageNum}&limit=24`;
      if (searchValue) {
        url += `&search=${encodeURIComponent(searchValue)}`;
      }
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const response = await axios.get(url);
      const newGames = response?.data?.data?.games || [];
      setGames((prev) => (append ? [...prev, ...newGames] : newGames));
      setHasNext(response?.data?.data?.pagination?.hasNext);
      setHasPrev(pageNum > 1);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cat = searchParams?.get("category") || "";
    setActiveCategory(cat);
    // reset list before new fetch (important for Load more UX)
    setGames([]);
    getGames(1, debouncedSearch, cat, false);
    setPage(1);
  }, [getGames, debouncedSearch, searchParams]);

  // Define homepage categories and fetch exactly 20 for each from API
  const categoryDefs = [
    { key: "Action", label: "Action" },
    { key: "Puzzle", label: "Puzzle" },
    { key: "Racing", label: "Racing" },
    { key: "Sports", label: "Sports" },
    { key: "Girls", label: "Girls" },
    { key: "Hypercasual", label: "Hypercasual" },
    { key: "Arcade", label: "Arcade" },
  ];

  useEffect(() => {
    if (!isClient) return;
    if (currentPath !== "/") return;
    if (shouldLoadCategories) return;
    const node = categorySectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShouldLoadCategories(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isClient, currentPath, shouldLoadCategories]);

  useEffect(() => {
    if (!shouldLoadCategories) return;
    if (currentPath !== "/") return;

    const fetchCategoryBlocks = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) return;
      setLoadingCategories(true);
      try {
        const results = {};
        await Promise.all(
          categoryDefs.map(async (cat) => {
            try {
              const url = `${baseUrl}games?page=1&limit=20&category=${encodeURIComponent(cat.key)}`;
              const resp = await axios.get(url);
              results[cat.key] = resp?.data?.data?.games || [];
            } catch {
              results[cat.key] = [];
            }
          })
        );
        setCategoryData(results);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoryBlocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadCategories, currentPath]);

  const handleNextPage = () => {
    if (hasNext && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      const append = isClient && currentPath === "/";
      getGames(nextPage, debouncedSearch, activeCategory, append);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && !loading) {
      const prevPage = page - 1;
      setPage(prevPage);
      getGames(prevPage, debouncedSearch, activeCategory);
    }
  };

  const handleClick = (e, game) => {
    e.preventDefault();
    // Create URL-friendly slug from game title
    const gameSlug = titleToSlug(game?.title || game?.gameId);
    
    // setTimeout(() => {
    router.push(`/${gameSlug}`);
    // }, 1500);
  };

  // Build category buckets from fetched data
  const categoryBuckets = categoryDefs.map((cat) => ({ ...cat, items: categoryData[cat.key] || [] }));

  return (
    <div className={`${compact ? 'pt-3' : 'pt-20'} px-4 sm:px-6`}>
      {/* pop-up ads */}
      {isClient && currentPath === "/" && (
        <div className="flex flex-col items-center gap-4 pt-5">
          <h1 className="text-[36px] max-sm:text-[26px] font-extrabold text-center heading-glow">
            PLAY YOUR FAVORITE GAME
          </h1>
          <div className="w-full px-[20.2rem] media_resp max-lg:px-5">
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {["1000+ Games", "No install needed", "Play on any device", "Everything is free"].map((label, idx) => (
                <div key={idx} className="group rounded-xl border border-[#DCF836]/35 bg-[rgba(7,18,28,0.55)] backdrop-blur-sm transition-colors duration-300 badge-glow">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#DCF836] text-black text-[12px] font-bold shadow-[0_0_10px_rgba(220,248,54,0.5)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[#DCF836] text-sm sm:text-base font-semibold">{label}</span>
                  </div>
                  {/* Ad for this block */}
                  {idx === 0 && (
                    <AdSenseSlot
                      slot="6963570616"
                      format="fluid"
                      layoutKey="-gx-5+29-24-33"
                    />
                  )}
                  {idx === 1 && (
                    <AdSenseSlot
                      slot="1807995596"
                      format="fluid"
                      layoutKey="-gx-5+29-24-33"
                    />
                  )}
                  {idx === 2 && (
                    <AdSenseSlot
                      slot="3619221978"
                      format="fluid"
                      layoutKey="-gx-5+29-24-33"
                    />
                  )}
                  {idx === 3 && (
                    <AdSenseSlot
                      slot="4145835583"
                      format="fluid"
                      layoutKey="-gx-5+29-24-33"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Games title (only on /all) */}
      {isClient && currentPath === "/all" && (
        <div className="px-[20.2rem] media_resp max-lg:px-5 mt-2">
          <h1 className="text-white text-[30px] max-sm:text-[22px] font-semibold text-center">
            Explore All Games
          </h1>
          <p className="text-white/70 text-center mt-1 text-sm md:text-base max-md:text-sm">
            Search and discover 1000+ free games. No install, play instantly.
          </p>
          {/* GOOGLE ADS BELOW SECTION */}
          <div className="w-full flex justify-center">
            <AdSenseSlot slot="5555120178" format="autorelaxed" />
          </div>
        </div>
      )}

      {/* Search Bar (controlled via showSearch) */}
      {showSearch && isClient && currentPath !== "/" && (
      <div className="flex justify-center mt-6">
        <div className="relative w-full max-w-[720px] px-5">
          <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(220,248,54,0.08),rgba(220,248,54,0.02))] blur-[2px] -z-[1]" />
          <div className="relative flex items-center rounded-2xl border border-[#DCF836]/30 bg-[rgba(7,18,28,0.55)] backdrop-blur-md shadow-[0_0_0_1px_rgba(220,248,54,0.06),0_8px_30px_rgba(0,0,0,0.35)]">
            <span className="pl-4 text-[#DCF836]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-4.35-4.35" stroke="#DCF836" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="7" stroke="#DCF836" strokeWidth="2" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setDebouncedSearch(search); }}
              placeholder="Search 1000+ free games..."
              aria-label="Search games"
              className="w-full bg-transparent text-white placeholder-white/60 px-3 py-3 rounded-2xl focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="pr-4 text-white/70 hover:text-[#DCF836] focus:outline-none"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Optional section title */}
      {sectionTitle ? (
        <div className="px-[20.2rem] media_resp max-lg:px-5 mt-4">
          <h2 className="text-white text-xl font-semibold">{sectionTitle}</h2>
        </div>
      ) : null}

      {/* Popular Categories with See more (min 20 items) */}
      <div ref={categorySectionRef}>
        {isClient && currentPath === "/" && shouldLoadCategories && (
          loadingCategories ? (
            <div className="px-[20.2rem] media_resp max-lg:px-5 mt-6 animate-pulse space-y-4">
              <div className="h-6 w-48 bg-[#0b1622] rounded-full" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-32 bg-[#0b1622] rounded-2xl" />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-[20.2rem] media_resp max-lg:px-5 mt-6">
              <div className="font-semibold text-2xl mb-1 heading-sub">Popular Categories</div>
              <div className="line-glow mb-3" />
              <div className="flex flex-col gap-4">
                {categoryBuckets.map((cat) => (
                  cat.items.length >= 20 ? (
                    <div key={cat.key} className="basis-full">
                      <div className="flex items-center justify-between">
                        <div className="text-[#DCF836] font-semibold mt-4 mb-2">{cat.label}</div>
                        <button
                          className="text-sm text-white/90 underline hover:text-[#DCF836]"
                          onClick={() => router.push(`/all?category=${encodeURIComponent(cat.key)}`)}
                        >
                          See more
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {cat.items.slice(0, 20).map((item, index) => (
                          <div
                            onClick={(e) => handleClick(e, item)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e, item); }}
                            role="link"
                            tabIndex={0}
                            aria-label={item?.title || 'Open game'}
                            key={`${cat.key}-${index}`}
                            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DCF836] rounded-[20px]"
                          >
                            <div className="relative group overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:scale-[1.02] hover:border-4 hover:border-[#DCF836] duration-300 w-full h-full">
                              <Image
                                width={200}
                                height={200}
                                alt="game-poster"
                                className="w-full object-cover"
                                src={item?.thumb || "/assets/pokii_game.webp"}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,12,23,0.92)] via-[rgba(2,12,23,0.55)] to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-2 left-2 right-2 translate-y-0 md:translate-y-3 md:group-hover:translate-y-0 transition-transform duration-300">
                                <div className="backdrop-blur-[2px] inline-block max-w-full px-2 py-1 rounded-md">
                                  <div
                                    className="text-[#DCF836] drop-shadow-[0_0_10px_rgba(220,248,54,0.55)] font-extrabold tracking-wide leading-snug text-[12px] md:text-sm"
                                    title={item?.title}
                                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                  >
                                    {item?.title}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        {/* GOOGLE ADS UNDER CATEGORY */}
                        {cat.key === "Action" && (
                          <div className="w-full flex justify-center ad-wrapper">
                            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
                          </div>
                        )}
                        {/* Puzzle */}
                        {cat.key === "Puzzle" && (
                          <div className="w-full flex justify-center ad-wrapper">
                            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
                          </div>
                        )}
                        {/* Racing */}
                        {cat.key === "Racing" && (
                          <div className="w-full flex justify-center ad-wrapper">
                            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
                          </div>
                        )}
                        {/* Hypercasual */}
                        {cat.key === "Hypercasual" && (
                          <div className="w-full flex justify-center ad-wrapper">
                            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
                          </div>
                        )}
                        {/* Arcade */}
                        {cat.key === "Arcade" && (
                          <div className="w-full flex justify-center ad-wrapper">
                            <AdSenseSlot slot="7994995968" format="fluid" layout="in-article" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )
        )}
        {isClient && currentPath === "/" && !shouldLoadCategories && (
          <div className="px-[20.2rem] media_resp max-lg:px-5 mt-6 animate-pulse space-y-4">
            <div className="h-6 w-48 bg-[#0b1622] rounded-full" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-32 bg-[#0b1622] rounded-2xl" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Game Grid */}
      <div className={`game_container ${compact ? 'pt-3' : 'pt-[32px]'} px-[20.2rem] media_resp max-lg:px-5`} style={{ minHeight: '600px' }}>
        {loading ? (
          <div className="flex justify-center items-center w-full h-64 col-span-full">
            <div className="loader border-4 border-t-4 border-gray-200 h-12 w-12 rounded-full animate-spin border-t-[#DCF836]" />
          </div>
        ) : (
          games?.map((item, index) => (
            <div
              onClick={(e) => handleClick(e, item)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e, item); }}
              role="link"
              tabIndex={0}
              aria-label={item?.title || 'Open game'}
              key={index}
              className="justify-between gap-5 cursor-pointer w-full h-full focus:outline-none focus:ring-2 focus:ring-[#DCF836] rounded-[20px]"
            >
              <div className="relative group w-full h-full">
                <div className="relative group overflow-hidden border-4 border-transparent rounded-[20px] transform transition-transform hover:scale-[1.02] hover:border-4 hover:border-[#DCF836] duration-300 w-full h-full">
                  <Image
                    width={200}
                    height={200}
                    alt="game-poster"
                    className="w-full object-cover"
                    src={item?.thumb || "/assets/pokii_game.webp"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,12,23,0.92)] via-[rgba(2,12,23,0.55)] to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 translate-y-0 md:translate-y-3 md:group-hover:translate-y-0 transition-transform duration-300">
                    <div className="backdrop-blur-[2px] inline-block max-w-full px-2 py-1 rounded-md">
                      <div
                        className="text-[#DCF836] drop-shadow-[0_0_10px_rgba(220,248,54,0.55)] font-extrabold tracking-wide leading-snug text-[12px] md:text-sm"
                        title={item?.title}
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {item?.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* GOOGLE ADS ABOVE PAGINATION */}
      <div className="w-full flex justify-center">
        <AdSenseSlot
          slot="1949975132"
          format="autorelaxed"
        />
      </div>

      {/* Pagination / Load more */}
      {!disablePagination && (() => {
        const isHomeView = isClient && currentPath === "/";
        if (isHomeView) {
          return (
            <div className="flex justify-center items-center py-8">
              <button
                onClick={handleNextPage}
                disabled={!hasNext || loading}
                className={`px-8 py-2 rounded-[60px] font-semibold transition-colors cursor-pointer ${
                  hasNext && !loading
                    ? "bg-[#DCF836] text-black hover:bg-[#c4e030]"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? 'Loading...' : hasNext ? 'Load more' : 'No more games'}
              </button>
            </div>
          );
        }
        return (
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
        );
      })()}

      {/* social bar ads (hidden for compact related section) */}
      {hideFooterSpace ? (
        <div className="py-6" />
      ) : (
        <div id="container-0d8fc43bdea8a840875c81f3bb6d87a4"></div>
      )}
    </div>
  );
}
