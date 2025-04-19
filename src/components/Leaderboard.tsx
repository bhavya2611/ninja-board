"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ArrowDown,
  ArrowUp,
  User,
  Section,
  BarChart,
  Trophy,
  Pointer,
  TrendingUp,
  TrendingDown
} from "lucide-react";

// Define the type for a player entry
type Player = {
  Rank: number;
  Name: string;
  "Ninja Sessions Attended": number;
  "Games Played": number;
  "Games Won": number;
  "Games Lost": number;
  "Points Won": number;
  "Points Lost": number;
  "Net Points": number;
  "Total Ninja Points": number;
  "Player Rating": number;
};

const columns = [
  { key: "Rank", label: "Rank", icon: null, sortable: true },
  { key: "Name", label: "Name", icon: User, sortable: true },
  {
    key: "Ninja Sessions Attended",
    label: "Ninja Sessions",
    sortable: false
  },
  {
    key: "Games Played",
    label: "Games Played",
    icon: BarChart,
    sortable: false
  },
  { key: "Games Won", label: "Games Won", icon: Trophy, sortable: false },
  { key: "Games Lost", label: "Games Lost", icon: null, sortable: false },
  { key: "Points Won", label: "Points Won", icon: TrendingUp, sortable: false },
  {
    key: "Points Lost",
    label: "Points Lost",
    icon: TrendingDown,
    sortable: false
  },
  {
    key: "Net Points",
    label: "Net Points",
    sortable: false
  },
  {
    key: "Total Ninja Points",
    label: "Ninja Points",
    icon: Pointer,
    sortable: true
  },
  { key: "Player Rating", label: "Rating", icon: null, sortable: false }
];

export const Leaderboard = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Player | null>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">();

  // Load data from JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/leaderboard_data.json");
        const gameResponse = await fetch("/data/games.json");
        if (!response.ok || !gameResponse.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Player[] = await response.json();
        const gamesData = await gameResponse.json();

        let leaderboardData = [];

        for (const player of data) {
          const playerGames = gamesData.games.filter(
            (game: { name: string }) => game.name === player.Name
          );

          if (player["Ninja Sessions Attended"] > 0) {
            player["Games Played"] = playerGames.length;

            player["Games Won"] = playerGames.filter(
              (game: { matchWon: boolean }) => game.matchWon
            ).length;

            player["Games Lost"] = playerGames.filter(
              (game: { matchWon: boolean }) => !game.matchWon
            ).length;

            player["Total Ninja Points"] =
              playerGames.reduce(
                (accumulator: number, game: { ninjaPoints: number }) =>
                  accumulator + game.ninjaPoints,
                0
              ) +
              player["Ninja Sessions Attended"] * 10;

            player["Points Won"] = playerGames.reduce(
              (accumulator: number, game: { matchPointsWon: number }) =>
                accumulator + game.matchPointsWon,
              0
            );

            player["Points Lost"] = playerGames.reduce(
              (accumulator: number, game: { matchPointsLost: number }) =>
                accumulator + game.matchPointsLost,
              0
            );

            player["Net Points"] = player["Points Won"] - player["Points Lost"];
          }

          leaderboardData.push(player);
        }

        // Calculate ranks based on total ninja points
        const rankedData = leaderboardData
          .sort((a, b) => b["Total Ninja Points"] - a["Total Ninja Points"])
          // .sort(
          //   (a, b) =>
          //     b["Points Won"] -
          //     b["Points Lost"] -
          //     (a["Points Won"] - a["Points Lost"])
          // )
          .map((player, index) => ({ ...player, Rank: index + 1 }));

        setPlayers(rankedData);
      } catch (error) {
        console.error("Could not load leaderboard data:", error);
      }
    };

    loadData();
  }, []);

  // Function to sort the leaderboard
  const sortPlayers = useCallback(
    (column: keyof Player) => {
      if (column === sortColumn) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("desc");
      }
    },
    [sortColumn, sortDirection]
  );

  // Sort and filter players
  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];

    if (sortColumn) {
      sortablePlayers.sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        // Handle numeric sorting
        if (
          typeof a[sortColumn] === "number" &&
          typeof b[sortColumn] === "number"
        ) {
          return direction * (Number(a[sortColumn]) - Number(b[sortColumn]));
        } else {
          if (a[sortColumn] < b[sortColumn]) {
            return -1 * direction;
          } else if (a[sortColumn] > b[sortColumn]) {
            return 1 * direction;
          } else {
            return 0;
          }
        }
      });
    }

    return sortablePlayers.filter((player) =>
      player.Name.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search, sortColumn, sortDirection]);

  return (
    <div>
      <Input
        type='search'
        placeholder='Search player...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='mb-4 rounded-xl'
      />
      <div className='relative overflow-x-auto shadow-md rounded-xl border-[1px]'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-100'>
              {columns.map((column) => (
                <TableHead key={column.key} className='px-6 py-3'>
                  {column.sortable ? (
                    <button
                      onClick={() => sortPlayers(column.key as keyof Player)}
                      className='flex items-center gap-1 hover:underline'
                    >
                      {column.label}
                      {sortColumn === column.key &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className='h-4 w-4' />
                        ) : (
                          <ArrowDown className='h-4 w-4' />
                        ))}
                    </button>
                  ) : (
                    <div className='flex items-center gap-1'>
                      {column.label}{" "}
                      {column.icon && (
                        <column.icon className='inline-block h-4 w-4 ml-1' />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow
                className={`${index % 2 == 1 ? "bg-[#fd390017]" : "bg-white"}`}
                key={player.Name}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className='px-6 py-4'>
                    {column.key === "Rank" && !isNaN(Number(player[column.key]))
                      ? `#${player[column.key]}`
                      : // @ts-expect-error
                        player[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
