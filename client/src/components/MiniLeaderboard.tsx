import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface LeaderboardPlayer {
  userId: number;
  rank: number;
  username: string;
  score: number;
  tier: string;
  avatarInitials: string;
  isCurrentUser: boolean;
  recentGrowth: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardPlayer[];
  userRank: number;
  totalUsers: number;
  percentile: number;
}

export default function MiniLeaderboard() {
  // Fetch leaderboard data
  const { data: leaderboardData, isLoading } = useQuery<LeaderboardData>({
    queryKey: ['/api/sccs/leaderboard'],
  });

  if (isLoading) return <MiniLeaderboardSkeleton />;
  if (!leaderboardData) return null;

  const { leaderboard, userRank } = leaderboardData;
  const top3 = leaderboard.slice(0, 3);
  const currentUser = leaderboard.find((player) => player.isCurrentUser);

  const getTierColor = (tier: string): string => {
    switch(tier) {
      case 'platinum': return 'bg-blue-500/80';
      case 'gold': return 'bg-yellow-500/80';
      case 'silver': return 'bg-gray-400/80';
      case 'bronze': return 'bg-amber-700/80';
      default: return 'bg-gray-500/80';
    }
  };

  return (
    <Card className="bg-card/30 border-none shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary/80" />
            Top Performers
          </span>
          <Link href="/sccs">
            <a className="text-sm font-normal text-primary hover:text-primary/80 flex items-center">
              View Full Leaderboard
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-gray-200">
                <AvatarFallback className={cn("text-white", getTierColor(top3[1].tier))}>
                  {top3[1].avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
            </div>
            <p className="text-xs mt-1 font-medium">{top3[1].score}</p>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-yellow-400">
                <AvatarFallback className={cn("text-white", getTierColor(top3[0].tier))}>
                  {top3[0].avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-blue-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
            </div>
            <p className="text-xs mt-1 font-medium">{top3[0].score}</p>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-gray-200">
                <AvatarFallback className={cn("text-white", getTierColor(top3[2].tier))}>
                  {top3[2].avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-amber-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
            </div>
            <p className="text-xs mt-1 font-medium">{top3[2].score}</p>
          </div>
        </div>

        {/* User's position */}
        {currentUser && (
          <div className="flex items-center p-2 rounded-lg bg-primary/10 border-l-4 border-primary">
            <div className="w-6 text-center font-bold text-xs text-muted-foreground">
              {userRank}
            </div>
            <Avatar className="mx-2 h-8 w-8">
              <AvatarFallback className={cn("text-white", getTierColor(currentUser.tier))}>
                {currentUser.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium leading-none">
                You
              </p>
            </div>
            <div className="text-sm font-bold text-primary">{currentUser.score}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniLeaderboardSkeleton() {
  return (
    <Card className="bg-card/30 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}