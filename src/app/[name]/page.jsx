import { GAMES } from "@/components/Constant";
import GameDetail from "@/components/GameDetail";
import Games from "@/components/Games";
import axios from "axios";
import { notFound } from "next/navigation";
import { slugToTitle, normalizeTitle } from "@/utils/urlUtils";
import { findCustomGame } from "@/utils/customGames";

export default async function Page({ params }) {
  const { name } = await params;
  let gameDetails = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    // Convert slug back to title for API search
    const gameTitle = slugToTitle(name);

    // 1) Try custom games first (highest priority)
    gameDetails = findCustomGame(name) || findCustomGame(gameTitle);
    
    // 2) Try remote API when available (if custom game not found)
    if (!gameDetails && baseUrl) {
      try {
        const searchResponse = await axios.get(`${baseUrl}games?search=${encodeURIComponent(gameTitle)}&limit=20`);
        const searchResults = searchResponse?.data?.data?.games || [];
        const wanted = normalizeTitle(gameTitle);
        gameDetails = searchResults.find(g => normalizeTitle(g?.title) === wanted)
          || searchResults.find(g => normalizeTitle(g?.title).includes(wanted))
          || null;
      } catch (_) {
        // ignore and fall through to local fallback
      }
    }

    // 3) If not matched by title, try ID-based approach as fallback (only if API exists)
    if (!gameDetails && baseUrl) {
      try {
        const response = await axios.get(`${baseUrl}games/${name}`);
        gameDetails = response?.data?.data?.game;
      } catch (_) {}
    }

    // 4) Fallback to local constants
    if (!gameDetails) {
      const wanted = normalizeTitle(gameTitle);
      gameDetails = GAMES.find(g => normalizeTitle(g?.title) === wanted)
        || GAMES.find(g => normalizeTitle(g?.title).includes(wanted))
        || null;
    }
  } catch (error) {
    // Only log unexpected errors, not 404/500 responses
    if (error.response?.status !== 404 && error.response?.status !== 500) {
      console.error("Unexpected error fetching game details:", error);
    }
  }

  // If nothing matched, render the 404 page (call outside try/catch so Next.js doesn't log it)
  if (!gameDetails) {
    notFound();
  }

  return (
    <>
      <GameDetail {...{ gameDetails, name }} />
      <div className="bg-[#020C17] pt-1">
        <div className="px-[20.2rem] media_resp max-lg:px-5">
          <h2 className="text-[#DCF836] text-2xl font-semibold tracking-wide mb-1">
            Related games
          </h2>
          <div className="h-[2px] w-24 rounded-full bg-[linear-gradient(90deg,#DCF836,rgba(220,248,54,0.2))] underline-shine" />
        </div>
        <Games showSearch={false} compact={true} disablePagination={true} hideFooterSpace={true} />
      </div>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { name } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    const gameTitle = slugToTitle(name);
    let gameDetails = null;

    // 1) Try custom games first
    gameDetails = findCustomGame(name) || findCustomGame(gameTitle);

    // 2) Try API if custom game not found
    if (!gameDetails && baseUrl) {
      try {
        const searchResponse = await axios.get(`${baseUrl}games?search=${encodeURIComponent(gameTitle)}&limit=20`);
        const searchResults = searchResponse?.data?.data?.games || [];
        const wanted = normalizeTitle(gameTitle);
        gameDetails = searchResults.find(g => normalizeTitle(g?.title) === wanted)
          || searchResults.find(g => normalizeTitle(g?.title).includes(wanted))
          || null;
      } catch (_) {}
    }

    // 3) Try ID-based approach if still not found
    if (!gameDetails && baseUrl) {
      try {
        const response = await axios.get(`${baseUrl}games/${name}`);
        gameDetails = response?.data?.data?.game;
      } catch (_) {}
    }

    const finalTitle = gameDetails?.title || gameTitle;
    const finalDescription = gameDetails?.description 
      ? `${gameDetails.description.substring(0, 150)}...` 
      : `Play ${finalTitle} on Pokiifuns on any device. Explore levels, unlock skills, and test your limits in this exciting game. Click now to play free, no download needed!`;

    return {
      title: `${finalTitle} | Free to play online at Pokiifuns`,
      description: finalDescription,
    };
  } catch (error) {
    // Only log unexpected errors, not 404/500 responses
    if (error.response?.status !== 404 && error.response?.status !== 500) {
      console.error("Unexpected error in generateMetadata:", error);
    }

    const gameTitle = slugToTitle(name);
    return {
      title: `${gameTitle} | Free to play online at Pokiifuns`,
      description: `Play ${gameTitle} on Pokiifuns on any device. Explore levels, unlock skills, and test your limits in this exciting game. Click now to play free, no download needed!`,
    };
  }
}
