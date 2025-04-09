import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowUp, Medal, Users } from "lucide-react";

type LeaderboardItem = {
  userId: number;
  username: string;
  avatarInitials: string;
  score: number;
  rank: number;
  tier: string;
  recentGrowth: number;
  isCurrentUser?: boolean;
};

type LeaderboardData = {
  userRank: number;
  totalUsers: number;
  percentile: number;
  leaderboard: LeaderboardItem[];
};

export default function SCCSLeaderboard() {
  // Fetch leaderboard data
  const { data, isLoading, error } = useQuery<LeaderboardData>({
    queryKey: ["/api/sccs/leaderboard"],
    refetchOnWindowFocus: false,
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "bg-purple-500 text-white";
      case "gold":
        return "bg-amber-400 text-amber-950";
      case "silver":
        return "bg-gray-300 text-gray-800";
      case "bronze":
        return "bg-amber-700 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4 text-amber-400" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
    return <span className="font-semibold text-gray-500">{rank}</span>;
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-heading flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          Social Capital Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">
              <div className="h-8 w-28 bg-gray-200 rounded mb-4 mx-auto"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-3 mx-auto"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="rounded-full h-8 w-8 bg-gray-200"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="ml-auto h-4 w-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Unable to load leaderboard data. Please try again later.
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 bg-primary/5 p-3 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Your Rank</span>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">{data?.userRank}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {data?.totalUsers}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-500">Percentile</span>
                <div className="flex items-center text-green-600">
                  <span className="text-lg font-bold">Top {100 - (data?.percentile || 0)}%</span>
                  <Users className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-auto pr-1">
              {data?.leaderboard.map((item) => (
                <div
                  key={item.userId}
                  className={`flex items-center p-2 rounded-lg ${
                    item.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-6 flex justify-center">{getMedalIcon(item.rank)}</div>
                  <Avatar className="h-8 w-8 mx-2">
                    <AvatarFallback className={getTierColor(item.tier)}>
                      {item.avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${item.isCurrentUser ? "text-primary-700" : ""}`}>
                      {item.username}
                      {item.isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-green-600 text-xs">
                      <ArrowUp className="h-3 w-3 mr-0.5" />
                      <span>{item.recentGrowth}</span>
                    </div>
                    <Badge variant="outline" className={`${getTierColor(item.tier)} capitalize`}>
                      {item.tier}
                    </Badge>
                    <span className="font-semibold text-sm">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}