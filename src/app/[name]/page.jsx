import { GAMES } from "@/components/Constant";
import GameDetail from "@/components/GameDetail";
import Games from "@/components/Games";
import axios from "axios";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { name } = await params;
  let gameDetails = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is not defined");
      notFound(); // This will trigger the 404 page
    }

    const response = await axios.get(`${baseUrl}games/${name}`);
    gameDetails = response?.data?.data?.game;
    
    // If no game details found, show 404 page
    if (!gameDetails) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching game details:", error);
    // If API returns 404 or any error, show 404 page
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return {
        title: `Play ${name} - Pokiifuns Game`,
        description: `Enjoy playing ${name} on Pokiifuns Game!`,
      };
    }

    const response = await axios.get(`${baseUrl}games/${name}`);
    const gameDetails = response?.data?.data?.game;

    return {
      title: `Play ${
        gameDetails?.title || name
      } - Free Online Browser Game to Play`,
      description: `Enjoy playing ${
        gameDetails?.title || name
      } on Pokiifuns Game!`,
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);

    return {
      title: `Play ${name} - Pokiifuns Game`,
      description: `Enjoy playing ${name} on Pokiifuns Game!`,
    };
  }
}
