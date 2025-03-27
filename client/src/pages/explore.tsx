import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Startup } from "@shared/schema";
import StartupCard from "@/components/startup/startup-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StartupDetail from "@/components/startup/startup-detail";

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [fundingRange, setFundingRange] = useState([0, 10000000]);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  const { data: startups, isLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  const filteredStartups = startups?.filter((startup) => {
    return (
      (searchTerm === "" || 
        startup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        startup.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (industry === "" || startup.industry === industry) &&
      (stage === "" || startup.stage === stage) &&
      (startup.fundingGoal >= fundingRange[0] && startup.fundingGoal <= fundingRange[1])
    );
  }) || [];

  const industries = ["Health Tech", "Fintech", "Clean Energy", "AI & ML", "Cybersecurity", "E-commerce", "Edtech"];
  const stages = ["idea", "pre_seed", "seed", "series_a", "series_b", "series_c", "growth"];
  const stageLabels: Record<string, string> = {
    idea: "Idea Stage",
    pre_seed: "Pre-Seed",
    seed: "Seed",
    series_a: "Series A",
    series_b: "Series B",
    series_c: "Series C",
    growth: "Growth"
  };

  const handleStartupClick = (startup: Startup) => {
    setSelectedStartup(startup);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Explore Startups
            </h2>
            
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Find Your Next Investment</CardTitle>
                <CardDescription>Use filters to narrow down startups that match your investment criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {/* Search Term */}
                  <div className="col-span-1 xl:col-span-2">
                    <Label htmlFor="search" className="mb-2 block">Search</Label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search startups..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Industry Filter */}
                  <div>
                    <Label htmlFor="industry" className="mb-2 block">Industry</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Stage Filter */}
                  <div>
                    <Label htmlFor="stage" className="mb-2 block">Stage</Label>
                    <Select value={stage} onValueChange={setStage}>
                      <SelectTrigger id="stage">
                        <SelectValue placeholder="All Stages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Stages</SelectItem>
                        {stages.map((s) => (
                          <SelectItem key={s} value={s}>{stageLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Funding Goal Range */}
                  <div className="col-span-1 xl:col-span-1">
                    <Label className="mb-2 block">Funding Goal</Label>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 10000000]}
                        max={10000000}
                        step={100000}
                        value={fundingRange}
                        onValueChange={setFundingRange}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatCurrency(fundingRange[0])}</span>
                        <span>{formatCurrency(fundingRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSearchTerm("");
                      setIndustry("");
                      setStage("");
                      setFundingRange([0, 10000000]);
                    }}
                  >
                    <FilterIcon className="h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Results */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Results ({filteredStartups.length})
                  </h3>
                  <Select defaultValue="trending">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending First</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="funding-low">Funding: Low to High</SelectItem>
                      <SelectItem value="funding-high">Funding: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredStartups.map((startup) => (
                    <StartupCard 
                      key={startup.id} 
                      startup={startup} 
                      onClick={() => handleStartupClick(startup)}
                    />
                  ))}
                </div>
                
                {filteredStartups.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <SearchIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No startups found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your filters or search criteria to find more startups.
                    </p>
                  </div>
                )}
              </div>
            )}
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
