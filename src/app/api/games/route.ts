import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { timeStamp } from "console";

const NINJA_SESSION_ID = 6;

type Game = {
  name: string;
  ninjaSessionId: number;
  matchWon: boolean;
  timeStamp: number;
  ninjaPoints: number;
};

type PlayerScore = {
  name: string;
  matchWon: boolean;
  matchPointsWon: number;
  matchPointsLost: number;
  ninjaSessionId: number;
  ninjaPoints: number;
  bonusPoints: number;
};

export async function POST(req: NextRequest) {
  try {
    const matchScores: PlayerScore[] = await req.json();

    // Get the absolute path to the games.json file
    const filePath = path.join(process.cwd(), "public/data/games.json");

    // Read the existing games from the file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const existingGames = JSON.parse(fileContent);

    // const newGames = [];

    // let team1LatestGame =
    //   existingGames.games
    //     .filter((game: Game) => {
    //       return (
    //         game.name === matchScores[0].name &&
    //         game.ninjaSessionId === NINJA_SESSION_ID
    //       );
    //     })
    //     .sort((a: Game, b: Game) => {
    //       return b.timeStamp - a.timeStamp;
    //     })[0] ?? {};

    // let team2LatestGame =
    //   existingGames.games
    //     .filter((game: Game) => {
    //       return (
    //         game.name === matchScores[2].name &&
    //         game.ninjaSessionId === NINJA_SESSION_ID
    //       );
    //     })
    //     .sort((a: Game, b: Game) => {
    //       return b.timeStamp - a.timeStamp;
    //     })[0] ?? {};

    // const isBountyGame =
    //   team1LatestGame.ninjaPoints >= 20 || team2LatestGame.ninjaPoints >= 20;

    // // i =  player index
    // for (let i = 0; i < matchScores.length; i++) {
    //   let playerGame = { ...matchScores[i], timeStamp: Date.now() };

    //   let playerSessionGames = existingGames.games
    //     .filter((game: Game) => {
    //       return (
    //         game.name === playerGame.name &&
    //         game.ninjaSessionId === NINJA_SESSION_ID
    //       );
    //     })
    //     .sort((a: Game, b: Game) => {
    //       return b.timeStamp - a.timeStamp;
    //     });

    //   const playerLatestGame =
    //     i === 0 || i === 1 ? team1LatestGame : team2LatestGame;

    //   if (
    //     // Case 3 - Bounty win match of the session for a player
    //     isBountyGame &&
    //     playerGame.matchWon
    //   ) {
    //     let bonusPoints =
    //       i === 0 || i === 1
    //         ? team2LatestGame.ninjaPoints
    //         : team1LatestGame.ninjaPoints;

    //     if (bonusPoints > 0) {
    //       bonusPoints += 5;
    //     } else {
    //       bonusPoints = 10;
    //     }

    //     playerGame.bonusPoints = bonusPoints;
    //     playerGame.ninjaPoints = playerLatestGame?.ninjaPoints
    //       ? playerLatestGame?.ninjaPoints + 5
    //       : 10;
    //   } else if (
    //     // Case 2 - Consecutive win match of the session for a player
    //     playerLatestGame.ninjaPoints > 0 &&
    //     playerLatestGame.ninjaPoints < 20 &&
    //     playerGame.matchWon
    //   ) {
    //     playerGame.ninjaPoints = playerLatestGame.ninjaPoints + 5;
    //   } else if (playerGame.matchWon) {
    //     // Case 3 - First match of session won for a player
    //     playerGame.ninjaPoints = 10;
    //   } else {
    //     // Case 4 - Match lost for a player
    //     playerGame.ninjaPoints = 0;
    //   }

    //   newGames.push(playerGame);
    // }

    // console.log(newGames, "newGames");

    // Append the new game to the array
    existingGames.games.push(...matchScores);

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
