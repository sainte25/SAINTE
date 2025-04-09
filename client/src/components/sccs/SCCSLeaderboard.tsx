import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, ChevronUp, Users, Medal, TrendingUp, Crown
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define types for the leaderboard data
interface LeaderboardPlayer {
  userId: number;
  username: string;
  avatarInitials: string;
  score: number;
  rank: number;
  tier: string;
  recentGrowth: number;
  isCurrentUser?: boolean;
}

interface LeaderboardData {
  userRank: number;
  totalUsers: number;
  percentile: number;
  leaderboard: LeaderboardPlayer[];
}

export default function SCCSLeaderboard() {
  const { data: leaderboardData, isLoading } = useQuery<LeaderboardData>({
    queryKey: ['/api/sccs/leaderboard'],
  });

  if (isLoading) {
    return <SCCSLeaderboardSkeleton />;
  }

  if (!leaderboardData) {
    return (
      <Card className="bg-card/50 border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">No leaderboard data available.</p>
        </CardContent>
      </Card>
    );
  }

  const { leaderboard, userRank, totalUsers, percentile } = leaderboardData;
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  const getTierColor = (tier: string): string => {
    switch(tier) {
      case 'platinum': return 'bg-blue-500/80';
      case 'gold': return 'bg-yellow-500/80';
      case 'silver': return 'bg-gray-400/80';
      case 'bronze': return 'bg-amber-700/80';
      default: return 'bg-gray-500/80';
    }
  };

  const getTierIcon = (tier: string, rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-300" />;
    if (tier === 'platinum') return <Trophy className="w-4 h-4 text-blue-400" />;
    if (tier === 'gold') return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (tier === 'silver') return <Medal className="w-4 h-4 text-gray-400" />;
    return <Medal className="w-4 h-4 text-amber-700" />;
  };

  return (
    <Card className="bg-card/50 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl">
          Community Leaderboard
        </CardTitle>
        <div className="text-center mb-4">
          <p className="text-muted-foreground text-sm">
            You're in the top <span className="text-primary font-bold">{Math.round(100 - percentile)}%</span> of {totalUsers} members
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Podium - Top 3 Players */}
        <div className="relative h-[180px] mb-8 flex items-end justify-center">
          {/* 2nd Place */}
          <div className="absolute left-0 bottom-0 w-1/3 flex flex-col items-center">
            <Avatar className="w-14 h-14 border-2 border-gray-200">
              <AvatarFallback className={cn("text-white", getTierColor(top3[1].tier))}>
                {top3[1].avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{top3[1].username}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                {getTierIcon(top3[1].tier, 2)}
                <span>{top3[1].score}</span>
              </p>
            </div>
            <div className="w-20 h-[60px] bg-gradient-to-t from-gray-800/60 to-gray-700/40 rounded-t-md mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
          </div>
          
          {/* 1st Place */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1/3 flex flex-col items-center z-10">
            <div className="w-6 h-6 rounded-full bg-yellow-500/80 flex items-center justify-center mb-1">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <Avatar className="w-16 h-16 border-2 border-yellow-400">
              <AvatarFallback className={cn("text-white", getTierColor(top3[0].tier))}>
                {top3[0].avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{top3[0].username}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                {getTierIcon(top3[0].tier, 1)}
                <span>{top3[0].score}</span>
              </p>
            </div>
            <div className="w-20 h-[100px] bg-gradient-to-t from-blue-800/60 to-blue-600/40 rounded-t-md mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
          </div>
          
          {/* 3rd Place */}
          <div className="absolute right-0 bottom-0 w-1/3 flex flex-col items-center">
            <Avatar className="w-14 h-14 border-2 border-gray-200">
              <AvatarFallback className={cn("text-white", getTierColor(top3[2].tier))}>
                {top3[2].avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium">{top3[2].username}</p>
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                {getTierIcon(top3[2].tier, 3)}
                <span>{top3[2].score}</span>
              </p>
            </div>
            <div className="w-20 h-[40px] bg-gradient-to-t from-amber-800/60 to-amber-700/40 rounded-t-md mt-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
          </div>
        </div>
        
        {/* Rest of the Leaderboard */}
        <div className="space-y-3 mt-4">
          {rest.map((player: LeaderboardPlayer) => (
            <div 
              key={player.userId} 
              className={cn(
                "flex items-center p-3 rounded-lg bg-card/70 shadow-sm border-l-4",
                player.isCurrentUser ? "border-primary" : "border-transparent"
              )}
            >
              <div className="w-8 text-center font-bold text-sm text-muted-foreground">
                {player.rank}
              </div>
              <Avatar className="mx-3 h-10 w-10">
                <AvatarFallback className={cn("text-white", getTierColor(player.tier))}>
                  {player.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">
                  {player.username}
                  {player.isCurrentUser && (
                    <span className="ml-2 text-xs text-primary">(You)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Tier: {player.tier}</p>
              </div>
              <div className="text-sm font-bold text-primary">{player.score}</div>
              <div className="ml-2 text-xs flex items-center gap-1">
                <ChevronUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">+{player.recentGrowth}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* User Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Card className="bg-card/70 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-lg font-bold">{userRank} of {totalUsers}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/70 border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points to Next Rank</p>
                <p className="text-lg font-bold">
                  {(() => {
                    if (!leaderboard || leaderboard.length === 0) return 0;
                    const nextRankPlayer = leaderboard.find((p: LeaderboardPlayer) => p.rank === userRank - 1);
                    const currentUser = leaderboard.find((p: LeaderboardPlayer) => p.isCurrentUser === true);
                    return nextRankPlayer && currentUser ? nextRankPlayer.score - currentUser.score : 0;
                  })()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

function SCCSLeaderboardSkeleton() {
  return (
    <Card className="bg-card/50 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardTitle>
        <div className="text-center mb-4">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Podium skeleton */}
        <div className="h-[180px] mb-8 relative flex items-end justify-center">
          <Skeleton className="absolute left-0 bottom-0 h-[120px] w-1/3" />
          <Skeleton className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[160px] w-1/3" />
          <Skeleton className="absolute right-0 bottom-0 h-[100px] w-1/3" />
        </div>
        
        {/* Leaderboard rows skeleton */}
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        
        {/* User stats skeleton */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </CardContent>
    </Card>
  );
}