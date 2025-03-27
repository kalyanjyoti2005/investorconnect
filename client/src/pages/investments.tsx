import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Investment, Startup } from "@shared/schema";
import { ChevronRight, DollarSign, ArrowUpRight, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StartupDetail from "@/components/startup/startup-detail";

export default function Investments() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const isInvestor = user?.role === "investor";

  // Fetch investments for current user
  const { data: investments, isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: [isInvestor ? "/api/investments/investor" : `/api/investments/startup/${user?.id}`],
    enabled: !!user,
  });

  // Fetch all startups to get details for each investment
  const { data: startups, isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
    enabled: !!investments,
  });

  const isLoading = investmentsLoading || startupsLoading;

  const getStartupById = (startupId: number): Startup | undefined => {
    return startups?.find(startup => startup.id === startupId);
  };

  // Filter investments based on tab
  const filteredInvestments = investments?.filter(investment => {
    if (selectedTab === "active") {
      return ["approved", "escrow", "released"].includes(investment.status);
    } else if (selectedTab === "pending") {
      return investment.status === "pending";
    } else {
      return true; // "all" tab
    }
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "escrow":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-purple-600 border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
            <DollarSign className="h-3 w-3" />
            In Escrow
          </Badge>
        );
      case "released":
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <ArrowUpRight className="h-3 w-3" />
            Released
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {isInvestor ? "My Investments" : "Startup Funding"}
            </h2>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>{isInvestor ? "Investment Portfolio" : "Funding Overview"}</CardTitle>
                    <CardDescription>
                      {isInvestor 
                        ? "Track and manage all your startup investments" 
                        : "Track and manage all funding received for your startup"}
                    </CardDescription>
                  </div>
                  
                  {isInvestor && (
                    <Button onClick={() => window.location.href = "/explore"}>
                      Discover Startups
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                  
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredInvestments && filteredInvestments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredInvestments.map((investment) => {
                        const startup = getStartupById(investment.startupId);
                        return (
                          <div 
                            key={investment.id}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white dark:bg-gray-800 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => startup && setSelectedStartup(startup)}
                          >
                            <div className="flex items-center mb-4 md:mb-0">
                              <Avatar className="h-10 w-10 mr-4">
                                {startup?.logo ? (
                                  <AvatarImage src={startup.logo} alt={startup.name} />
                                ) : (
                                  <AvatarFallback className="bg-primary-100 text-primary-700">
                                    {startup?.name.charAt(0) || "S"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{startup?.name || "Unknown Startup"}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {startup?.industry || "Unknown Industry"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Amount:</span>
                                <span className="font-semibold">{formatCurrency(investment.amount)}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Date:</span>
                                <span>{new Date(investment.createdAt).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Status:</span>
                                {getStatusBadge(investment.status)}
                              </div>
                              
                              <Button variant="ghost" size="sm" className="ml-auto">
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No investments found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {isInvestor 
                          ? "You don't have any investments in this category yet." 
                          : "Your startup hasn't received any investments in this category yet."}
                      </p>
                      {isInvestor && (
                        <Button onClick={() => window.location.href = "/explore"}>
                          Discover Startups
                        </Button>
                      )}
                    </div>
                  )}
                </Tabs>
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
