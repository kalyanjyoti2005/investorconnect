import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage 
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

// Icons
import {
  Search,
  Filter,
  ArrowUpRight,
  ThumbsUp,
  Eye,
  MessageSquare,
  Lock,
  Plus,
  ChevronRight,
  BarChart3,
  Users,
  CircleDollarSign,
  TrendingUp,
  BriefcaseBusiness,
  CheckCircle2,
  MoreVertical,
  Star,
  Info,
  Bookmark
} from "lucide-react";
import { Startup, Investment } from "@shared/schema";

// Define filter interfaces
interface StartupFilters {
  industry: string;
  stage: string;
  fundingRange: string;
  sort: string;
}

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [activeView, setActiveView] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<StartupFilters>({
    industry: "all",
    stage: "all",
    fundingRange: "all",
    sort: "trending",
  });

  // Fetch startups from API
  const { data: startups, isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  // Fetch investments from API
  const { data: investments, isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  // Redirect if not logged in or not an investor
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              You need to log in to access the investor dashboard.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/auth")}>Go to Login</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (user.role !== "investor") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              This dashboard is for investors only. Your account is registered as a founder.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Industry options for filter
  const industryOptions = [
    { value: "all", label: "All Industries" },
    { value: "Technology", label: "Technology" },
    { value: "AI & Machine Learning", label: "AI & Machine Learning" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "FinTech", label: "FinTech" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "SaaS", label: "SaaS" },
    { value: "EdTech", label: "EdTech" },
    { value: "Clean Energy", label: "Clean Energy" },
  ];

  // Startup stage options for filter
  const stageOptions = [
    { value: "all", label: "All Stages" },
    { value: "idea", label: "Idea Stage" },
    { value: "pre_seed", label: "Pre-Seed" },
    { value: "seed", label: "Seed" },
    { value: "series_a", label: "Series A" },
    { value: "series_b", label: "Series B" },
    { value: "series_c", label: "Series C" },
    { value: "growth", label: "Growth/Expansion" },
  ];

  // Funding range options for filter
  const fundingRangeOptions = [
    { value: "all", label: "Any Amount" },
    { value: "0-100000", label: "Under $100K" },
    { value: "100000-500000", label: "$ 100K - 500K" },
    { value: "500000-1000000", label: "$ 500K - 1M" },
    { value: "1000000-5000000", label: "$ 1M - 5M" },
    { value: "5000000-plus", label: "$ 5M+" },
  ];

  // Sort options
  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "newest", label: "Newest" },
    { value: "funding-low", label: "Funding Goal: Low to High" },
    { value: "funding-high", label: "Funding Goal: High to Low" },
  ];

  // Filter startup data based on filters
  const filteredStartups = startups
    ? startups
        .filter((startup) => {
          // Filter by search query
          if (
            searchQuery &&
            !startup.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !startup.description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return false;
          }

          // Filter by industry
          if (filters.industry !== "all" && startup.industry !== filters.industry) {
            return false;
          }

          // Filter by stage
          if (filters.stage !== "all" && startup.stage !== filters.stage) {
            return false;
          }

          // Filter by funding range
          if (filters.fundingRange !== "all") {
            const [min, max] = filters.fundingRange.split("-").map(Number);
            if (max === undefined && startup.fundingGoal < min) return false;
            if (max !== undefined && (startup.fundingGoal < min || startup.fundingGoal > max))
              return false;
          }

          return true;
        })
        .sort((a, b) => {
          // Sort options
          switch (filters.sort) {
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "funding-low":
              return a.fundingGoal - b.fundingGoal;
            case "funding-high":
              return b.fundingGoal - a.fundingGoal;
            case "trending":
            default:
              return (b.trendingScore || 0) - (a.trendingScore || 0);
          }
        })
    : [];

  // Get recommended startups based on user's previous investments
  const recommendedStartups = startups
    ? startups
        .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
        .slice(0, 4)
    : [];

  // Mock data for the presentation of UI components
  const mockPortfolioData = [
    { label: "Jan", value: 120000 },
    { label: "Feb", value: 150000 },
    { label: "Mar", value: 180000 },
    { label: "Apr", value: 210000 },
    { label: "May", value: 260000 },
    { label: "Jun", value: 320000 },
  ];

  // Main layout with sidebar
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 pb-8 mx-auto">
            <div className="flex items-center justify-between mt-8 mb-6">
              <h2 className="text-3xl font-bold">Investor Dashboard</h2>
              <Button onClick={() => navigate("/explore")}>
                Explore All Startups
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {/* Investment Stats Cards */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 mr-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <BriefcaseBusiness className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Active Investments
                    </h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-900 dark:text-blue-50">{investments?.length || 0}</span>
                    <span className="ml-2 text-sm text-blue-700 dark:text-blue-300">Startups</span>
                  </div>
                  <div className="mt-3 text-sm text-blue-700 dark:text-blue-300">
                    {investments?.length 
                      ? `Across ${new Set(investments.map(i => i.startupId)).size} companies` 
                      : "No active investments"}
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100 dark:border-emerald-900/30"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 mr-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <CircleDollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Total Invested
                    </h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-emerald-900 dark:text-emerald-50">
                      ${investments?.reduce((total, inv) => total + inv.amount, 0)?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-300">
                    Average: ${investments?.length ? Math.round(investments.reduce((total, inv) => total + inv.amount, 0) / investments.length).toLocaleString() : 0} per startup
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-100 dark:border-purple-900/30"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 mr-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Portfolio Growth
                    </h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-900 dark:text-purple-50">+24.8%</span>
                    <span className="ml-2 text-sm text-purple-700 dark:text-purple-300">This quarter</span>
                  </div>
                  <div className="flex items-center h-8 mt-3 space-x-1">
                    {mockPortfolioData.map((item, i) => (
                      <div
                        key={i}
                        className="relative w-full h-full group"
                      >
                        <div 
                          className="h-full rounded bg-purple-200 dark:bg-purple-700"
                          style={{ width: '4px', margin: '0 auto' }}
                        ></div>
                        <div 
                          className="absolute bottom-0 w-4 h-2 -ml-1.5 transition-all rounded-sm opacity-0 left-1/2 group-hover:opacity-100 bg-purple-700" 
                          style={{ 
                            height: `${(item.value / 320000) * 100}%`,
                            minHeight: '4px'
                          }}
                        ></div>
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 text-xs whitespace-nowrap mt-1 bg-background px-1.5 py-0.5 rounded shadow-sm border z-10">
                          {item.label}: ${(item.value / 1000).toFixed(1)}k
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="overflow-hidden rounded-xl shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-900/30"
              >
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="p-2 mr-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                      <CheckCircle2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Matched Startups
                    </h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-amber-900 dark:text-amber-50">{recommendedStartups?.length || 0}</span>
                    <span className="ml-2 text-sm text-amber-700 dark:text-amber-300">New matches</span>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, recommendedStartups?.length || 0))].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-700 text-xs"
                        >
                          {recommendedStartups?.[i]?.name.charAt(0)}
                        </div>
                      ))}
                      {(recommendedStartups?.length || 0) > 3 && (
                        <div className="flex items-center justify-center w-6 h-6 text-xs rounded-full bg-amber-200 dark:bg-amber-700">
                          +{(recommendedStartups?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-2 text-sm text-amber-700 dark:text-amber-300">
                      {recommendedStartups?.length ? "Based on your interests" : "Complete your profile to get matches"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Startup Explorer Section */}
            <div className="mb-8">
              <div className="flex flex-col items-start justify-between mb-6 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-2xl font-bold">Startup Explorer</h3>
                  <p className="text-muted-foreground">
                    Discover promising startups that match your investment criteria
                  </p>
                </div>
                
                <Tabs 
                  value={activeView} 
                  onValueChange={setActiveView}
                  className="w-full mt-4 lg:w-auto lg:mt-0"
                >
                  <TabsList className="w-full grid grid-cols-3 lg:w-auto">
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="newest">Newest</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {/* Search and Filters */}
              <div className="flex flex-col items-stretch gap-4 mb-6 lg:flex-row lg:items-center">
                <div className="relative flex-grow">
                  <Search className="absolute w-4 h-4 text-muted-foreground left-3 top-3" />
                  <Input
                    placeholder="Search startups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 lg:flex-nowrap">
                  <Select
                    value={filters.industry}
                    onValueChange={(value) => setFilters({ ...filters, industry: value })}
                  >
                    <SelectTrigger className="w-full lg:w-36">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.stage}
                    onValueChange={(value) => setFilters({ ...filters, stage: value })}
                  >
                    <SelectTrigger className="w-full lg:w-36">
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.fundingRange}
                    onValueChange={(value) => setFilters({ ...filters, fundingRange: value })}
                  >
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Funding Goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => setFilters({ ...filters, sort: value })}
                  >
                    <SelectTrigger className="w-full lg:w-40">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Startups Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {startupsLoading ? (
                  // Loading skeletons
                  [...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-40 bg-gray-200 animate-pulse dark:bg-gray-800"></div>
                      <CardContent className="p-6">
                        <div className="w-3/4 h-5 mb-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                        <div className="w-full h-4 mb-2 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                        <div className="w-5/6 h-4 mb-6 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                        <div className="flex items-center justify-between">
                          <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
                          <div className="w-1/4 h-8 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredStartups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center col-span-4 p-12 text-center border rounded-lg">
                    <div className="p-4 mb-4 bg-muted rounded-full">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-medium">No startups found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search to find startups that match your criteria.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setFilters({
                          industry: "all",
                          stage: "all",
                          fundingRange: "all",
                          sort: "trending",
                        });
                        setSearchQuery("");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  // Startup cards
                  filteredStartups.map((startup) => (
                    <motion.div
                      key={startup.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="overflow-hidden transition-shadow hover:shadow-md">
                        <div 
                          className="relative h-40 bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center"
                        >
                          {startup.logo ? (
                            <img
                              src={startup.logo}
                              alt={startup.name}
                              className="object-contain w-32 h-32"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-20 h-20 text-3xl font-bold rounded-full bg-primary/20 text-primary">
                              {startup.name.charAt(0)}
                            </div>
                          )}
                          
                          {/* NDA Badge if required */}
                          <div className="absolute top-3 right-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-1.5 rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
                                    <Lock className="w-4 h-4 text-amber-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>NDA required to view full details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          {/* Stage Badge */}
                          <div className="absolute top-3 left-3">
                            <Badge 
                              variant="secondary" 
                              className="font-medium text-xs px-2 py-0.5 bg-black/60 text-white/90 backdrop-blur-sm hover:bg-black/70"
                            >
                              {startup.stage.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-5">
                          <div className="mb-1">
                            <Badge 
                              variant="outline" 
                              className="text-xs text-muted-foreground"
                            >
                              {startup.industry}
                            </Badge>
                          </div>
                          
                          <h3 className="mb-1 text-xl font-bold">{startup.name}</h3>
                          
                          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                            {startup.description}
                          </p>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5 text-xs">
                              <span className="font-medium">Funding Progress</span>
                              <span className="text-muted-foreground">
                                ${startup.currentFunding?.toLocaleString()} of ${startup.fundingGoal?.toLocaleString()}
                              </span>
                            </div>
                            <Progress 
                              value={((startup.currentFunding || 0) / startup.fundingGoal) * 100} 
                              className="h-1.5" 
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                      <ThumbsUp className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Upvote</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                      <MessageSquare className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Message Founder</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                      <Bookmark className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add to Watchlist</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/startup/${startup.id}`)}
                            >
                              <span className="mr-1">Details</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}