import { GAMES } from "@/components/Constant";
import GameDetail from "@/components/GameDetail";
import Games from "@/components/Games";
import axios from "axios";
import { notFound } from "next/navigation";
import { slugToTitle } from "@/utils/urlUtils";

export default async function Page({ params }) {
  const { name } = await params;
  let gameDetails = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) {
      notFound();
    }

    // Convert slug back to title for API search
    const gameTitle = slugToTitle(name);
    
    // First try to find game by title using search API
    const searchResponse = await axios.get(`${baseUrl}games?search=${encodeURIComponent(gameTitle)}&limit=1`);
    const searchResults = searchResponse?.data?.data?.games || [];
    
    // Find exact match by title
    gameDetails = searchResults.find(game => 
      game.title && game.title.toLowerCase() === gameTitle.toLowerCase()
    );

    // If no exact match found, try the original ID-based approach as fallback
    if (!gameDetails) {
      try {
        const response = await axios.get(`${baseUrl}games/${name}`);
        gameDetails = response?.data?.data?.game;
      } catch (idError) {
        // If both approaches fail, show 404
        notFound();
      }
    }

    // If still no game details found, show 404 page
    if (!gameDetails) {
      notFound();
    }
  } catch (error) {
    // Only log unexpected errors, not 404/500 responses
    if (error.response?.status !== 404 && error.response?.status !== 500) {
      console.error("Unexpected error fetching game details:", error);
    }
    notFound();
  }

  return (
    <>
      <GameDetail {...{ gameDetails, name }} />
      <div className="bg-[#020C17]">
        <Games />
      </div>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { name } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseUrl) {
      const gameTitle = slugToTitle(name);
      return {
        title: `Play ${gameTitle} - Pokiifuns Game`,
        description: `Enjoy playing ${gameTitle} on Pokiifuns Game!`,
      };
    }

    // Convert slug back to title for API search
    const gameTitle = slugToTitle(name);
    
    // First try to find game by title using search API
    const searchResponse = await axios.get(`${baseUrl}games?search=${encodeURIComponent(gameTitle)}&limit=1`);
    const searchResults = searchResponse?.data?.data?.games || [];
    
    // Find exact match by title
    let gameDetails = searchResults.find(game => 
      game.title && game.title.toLowerCase() === gameTitle.toLowerCase()
    );

    // If no exact match found, try the original ID-based approach as fallback
    if (!gameDetails) {
      try {
        const response = await axios.get(`${baseUrl}games/${name}`);
        gameDetails = response?.data?.data?.game;
      } catch (idError) {
        // Use the converted title as fallback
        gameDetails = { title: gameTitle };
      }
    }

    return {
      title: `Play ${
        gameDetails?.title || gameTitle
      } - Free Online Browser Game to Play`,
      description: `Enjoy playing ${
        gameDetails?.title || gameTitle
      } on Pokiifuns Game!`,
    };
  } catch (error) {
    // Only log unexpected errors, not 404/500 responses
    if (error.response?.status !== 404 && error.response?.status !== 500) {
      console.error("Unexpected error in generateMetadata:", error);
    }

    const gameTitle = slugToTitle(name);
    return {
      title: `Play ${gameTitle} - Pokiifuns Game`,
      description: `Enjoy playing ${gameTitle} on Pokiifuns Game!`,
    };
  }
}
