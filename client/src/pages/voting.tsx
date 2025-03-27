import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search, 
  Filter, 
  Star, 
  Eye, 
  Users,
  TrendingUp,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Startup, Vote } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import StartupDetail from "@/components/startup/startup-detail";

export default function VotingPanel() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const isInvestor = user?.role === "investor";

  // Fetch startups
  const { data: startups, isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
    enabled: !!user,
  });

  // Fetch user votes
  const { data: votes, isLoading: votesLoading } = useQuery<Vote[]>({
    queryKey: ["/api/votes"],
    enabled: !!user && isInvestor,
  });

  const isLoading = startupsLoading || votesLoading;

  // Format the funding stage to be more readable
  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ startupId, voteType }: { startupId: number; voteType: 1 | -1 }) => {
      return apiRequest("POST", "/api/votes", {
        startupId,
        voteType,
        investorId: user?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/votes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
    },
  });

  // Handle vote
  const handleVote = (startupId: number, voteType: 1 | -1) => {
    if (!isInvestor) return;
    voteMutation.mutate({ startupId, voteType });
  };

  // Check if user has already voted for a startup
  const getUserVote = (startupId: number): Vote | undefined => {
    return votes?.find(vote => vote.startupId === startupId && vote.investorId === user?.id);
  };

  // Filter startups based on search query
  const filteredStartups = startups?.filter(startup => 
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort startups based on selected tab
  const sortedStartups = filteredStartups?.sort((a, b) => {
    if (selectedTab === "trending") {
      return b.trendingScore - a.trendingScore;
    } else if (selectedTab === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (selectedTab === "most-funded") {
      return b.currentFunding - a.currentFunding;
    } else {
      return b.trendingScore - a.trendingScore; // Default
    }
  });

  // Calculate funding progress percentage
  const calculateFundingProgress = (currentFunding: number, fundingGoal: number) => {
    return Math.min(Math.round((currentFunding / fundingGoal) * 100), 100);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Voting Panel
            </h2>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Startup Leaderboard</CardTitle>
                    <CardDescription>
                      Vote on startups to help them gain visibility in the community
                    </CardDescription>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search startups..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="trending">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trending
                    </TabsTrigger>
                    <TabsTrigger value="newest">Newest</TabsTrigger>
                    <TabsTrigger value="most-funded">Most Funded</TabsTrigger>
                    <TabsTrigger value="my-votes">My Votes</TabsTrigger>
                  </TabsList>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : sortedStartups && sortedStartups.length > 0 ? (
                    <div className="space-y-6">
                      {sortedStartups.map((startup) => {
                        const userVote = getUserVote(startup.id);
                        const fundingProgress = calculateFundingProgress(startup.currentFunding, startup.fundingGoal);
                        
                        return (
                          <Card key={startup.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row gap-6">
                                {/* Voting Controls (for investors only) */}
                                {isInvestor && (
                                  <div className="flex md:flex-col items-center justify-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleVote(startup.id, 1)}
                                      disabled={voteMutation.isPending || userVote?.voteType === 1}
                                      className={userVote?.voteType === 1 ? "text-green-600" : ""}
                                    >
                                      <ArrowUpCircle className="h-6 w-6" />
                                    </Button>
                                    <span className="font-semibold text-lg">{startup.trendingScore}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleVote(startup.id, -1)}
                                      disabled={voteMutation.isPending || userVote?.voteType === -1}
                                      className={userVote?.voteType === -1 ? "text-red-600" : ""}
                                    >
                                      <ArrowDownCircle className="h-6 w-6" />
                                    </Button>
                                  </div>
                                )}
                                
                                {/* Startup Info */}
                                <div className="flex-1">
                                  <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="h-12 w-12">
                                      {startup.logo ? (
                                        <AvatarImage src={startup.logo} alt={startup.name} />
                                      ) : (
                                        <AvatarFallback className="bg-primary-100 text-primary-700">
                                          {startup.name.charAt(0)}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <h3 className="text-lg font-semibold">{startup.name}</h3>
                                          <p className="text-sm text-gray-500 dark:text-gray-400">{startup.industry}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="capitalize">
                                            {formatStage(startup.stage)}
                                          </Badge>
                                          <Badge variant="secondary" className="flex items-center">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                            {startup.trendingScore}
                                          </Badge>
                                        </div>
                                      </div>
                                      
                                      <p className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-2">
                                        {startup.description}
                                      </p>
                                      
                                      <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Funding Progress</span>
                                          <span>
                                            <span className="font-medium">{formatCurrency(startup.currentFunding)}</span>
                                            <span className="text-gray-500"> of {formatCurrency(startup.fundingGoal)}</span>
                                          </span>
                                        </div>
                                        <Progress value={fundingProgress} className="h-2" />
                                      </div>
                                      
                                      <div className="mt-4 flex flex-wrap gap-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Eye className="h-4 w-4 mr-1" />
                                          <span>142 views</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Users className="h-4 w-4 mr-1" />
                                          <span>8 investors</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Calendar className="h-4 w-4 mr-1" />
                                          <span>{new Date(startup.createdAt).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end">
                                    <Button 
                                      variant="outline" 
                                      className="flex items-center"
                                      onClick={() => setSelectedStartup(startup)}
                                    >
                                      View Details
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mx-auto mb-4 w-fit">
                        <TrendingUp className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No startups found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {searchQuery 
                          ? `No startups match "${searchQuery}"` 
                          : "There are no startups to vote on at the moment."}
                      </p>
                      <Button onClick={() => window.location.href = "/explore"}>
                        Discover Startups
                      </Button>
                    </div>
                  )}
                </Tabs>
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800">
                <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                  {!isLoading && sortedStartups && (
                    <p>Showing {sortedStartups.length} startups</p>
                  )}
                </div>
              </CardFooter>
            </Card>
            
            {/* Information about voting */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>About Voting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-3 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full mb-3">
                      <ArrowUpCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-2">Upvote</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Upvote startups that you believe have strong potential to increase their visibility
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full mb-3">
                      <ArrowDownCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-2">Downvote</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Downvote startups that you believe need improvement or don't meet investment criteria
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="p-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full mb-3">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-2">Trending Score</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      A startup's trending score is calculated based on votes, interactions, and funding progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* Startup Detail Modal */}
        {selectedStartup && (
          <StartupDetail 
            startup={selectedStartup} 
            onClose={() => setSelectedStartup(null)} 
          />
        )}
        
        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
          <p>&copy; 2023 StartupMatch. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
