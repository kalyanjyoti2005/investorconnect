import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building, 
  Users, 
  BarChart3, 
  Calendar, 
  FileText, 
  Link, 
  Globe, 
  ChevronRight, 
  Milestone,
  LockIcon
} from "lucide-react";
import { Startup, User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency } from "@/lib/utils";

interface StartupDetailProps {
  startup: Startup;
  onClose: () => void;
}

export default function StartupDetail({ startup, onClose }: StartupDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const isInvestor = user?.role === "investor";

  // Get founder information
  const { data: founder } = useQuery<User>({
    queryKey: [`/api/users/${startup.founderId}`],
    enabled: !!startup.founderId,
  });

  // Check if investor has signed NDA
  const { data: nda } = useQuery({
    queryKey: [`/api/ndas/investor?startupId=${startup.id}`],
    enabled: isInvestor,
  });

  const hasNdaSigned = nda?.signed === true;

  // Format the funding stage to be more readable
  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate funding progress percentage
  const fundingProgress = Math.min(
    Math.round((startup.currentFunding / startup.fundingGoal) * 100),
    100
  );

  // Information that is only visible to founders or investors with signed NDA
  const isAuthorizedForFullDetails = user?.id === startup.founderId || hasNdaSigned;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {startup.logo ? (
                <img 
                  src={startup.logo} 
                  alt={`${startup.name} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold bg-primary-100 text-primary-600">
                  {startup.name.charAt(0)}
                </div>
              )}
              <div>
                <DialogTitle className="text-xl">{startup.name}</DialogTitle>
                <DialogDescription>{startup.industry}</DialogDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="capitalize">
                {formatStage(startup.stage)}
              </Badge>
              <Badge variant="secondary">
                ${formatCurrency(startup.fundingGoal)} Goal
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {startup.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Funding Progress</span>
                <span>
                  <span className="font-medium">{formatCurrency(startup.currentFunding)}</span>
                  <span className="text-gray-500"> of {formatCurrency(startup.fundingGoal)}</span>
                </span>
              </div>
              <Progress value={fundingProgress} className="h-2.5" />
              <div className="flex justify-between text-xs mt-1">
                <span>{fundingProgress}% Funded</span>
                <span>{new Date(startup.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Industry</h4>
                  <p className="text-gray-600 dark:text-gray-400">{startup.industry}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Founded by</h4>
                  <p className="text-gray-600 dark:text-gray-400">{founder?.name || "Loading..."}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <BarChart3 className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Stage</h4>
                  <p className="text-gray-600 dark:text-gray-400">{formatStage(startup.stage)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(startup.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {startup.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Website</h4>
                    <a 
                      href={startup.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline dark:text-primary-400"
                    >
                      {startup.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section - with NDA restrictions */}
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                Documents
                {!isAuthorizedForFullDetails && <LockIcon className="h-4 w-4 ml-2 text-gray-400" />}
              </h3>
              
              {isAuthorizedForFullDetails ? (
                <div className="space-y-2">
                  {startup.pitchDeck && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary-500 mr-3" />
                        <span>Pitch Deck</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Link className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  )}
                  
                  {startup.businessPlan && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-primary-500 mr-3" />
                        <span>Business Plan</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Link className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  )}

                  {!startup.pitchDeck && !startup.businessPlan && (
                    <p className="text-gray-500 dark:text-gray-400 italic">No documents available</p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Full documents are available after signing an NDA
                  </p>
                  {isInvestor && (
                    <Button>
                      Request NDA
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-4">
            {isAuthorizedForFullDetails ? (
              <>
                <div>
                  <h3 className="text-lg font-medium mb-2">Funding Breakdown</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 border rounded-lg bg-white dark:bg-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Raised</p>
                        <p className="text-2xl font-bold">{formatCurrency(startup.currentFunding)}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-white dark:bg-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Goal</p>
                        <p className="text-2xl font-bold">{formatCurrency(startup.fundingGoal)}</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-white dark:bg-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                        <p className="text-2xl font-bold">{fundingProgress}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Milestones</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100 flex items-center justify-center mr-3">
                        <Milestone className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">MVP Development</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed on June 15, 2023</p>
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-600 dark:text-blue-100 flex items-center justify-center mr-3">
                        <Milestone className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Market Validation</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">In progress</p>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-100 flex items-center justify-center mr-3">
                        <Milestone className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Official Launch</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Planned for Q4 2023</p>
                      </div>
                      <Badge variant="outline">Upcoming</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Financial Projections</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Detailed financial projections are available in the business plan document.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                <LockIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Financial Information Protected</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Detailed financial information is available after signing an NDA.
                </p>
                {isInvestor && (
                  <Button>
                    Request NDA
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Founding Team</h3>
              
              {founder ? (
                <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={founder.profileImage} alt={founder.name} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {founder.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{founder.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Founder & CEO</p>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {founder.bio || "No bio provided"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">Loading founder information...</p>
              )}
              
              {isAuthorizedForFullDetails && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Additional Team Members</h4>
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No additional team members listed.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {isInvestor && (
            <Button className="flex items-center" disabled={!isAuthorizedForFullDetails}>
              Invest
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
          
          {!hasNdaSigned && isInvestor && (
            <Button variant="outline">
              Request NDA
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
