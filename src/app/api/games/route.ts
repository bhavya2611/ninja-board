import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Game = {
  team1: string;
  team2: string;
  team1Points: number;
  team2Points: number;
  group: string;
};

export async function POST(req: NextRequest) {
  try {
    const newGame: Game[] = await req.json();

    // Get the absolute path to the games.json file
    const filePath = path.join(process.cwd(), "public/data/games.json");

    // Read the existing games from the file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const existingGames = JSON.parse(fileContent);

    // Append the new game to the array
    existingGames.games.push(...newGame);

    console.log(existingGames);

    // Write the updated games array back to the file
    await fs.writeFile(
      filePath,
      JSON.stringify(existingGames, null, 2),
      "utf-8"
    );

    return NextResponse.json(
      { message: "Game added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding game:", error);
    return NextResponse.json({ message: "Error adding game" }, { status: 500 });
  }
}
