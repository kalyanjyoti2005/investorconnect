import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Star, Users } from "lucide-react";
import { Startup } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface StartupCardProps {
  startup: Startup;
  onClick: () => void;
}

export default function StartupCard({ startup, onClick }: StartupCardProps) {
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

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md group">
      <div 
        className="h-36 bg-gradient-to-r from-primary-600 to-primary-400 relative flex items-center justify-center"
      >
        {startup.logo ? (
          <img 
            src={startup.logo} 
            alt={`${startup.name} logo`}
            className="h-20 w-20 rounded-full object-cover border-4 border-white bg-white"
          />
        ) : (
          <div className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold bg-white text-primary-600">
            {startup.name.charAt(0)}
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {startup.trendingScore}
          </Badge>
          <Badge variant="outline" className="bg-white/80 dark:bg-gray-800/80">
            {formatStage(startup.stage)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary-600 transition-colors">
            {startup.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 h-10">
            {startup.description}
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Funding Progress</span>
              <span className="font-medium">{fundingProgress}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Industry</p>
              <p className="font-medium truncate">{startup.industry}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Goal</p>
              <p className="font-medium">{formatCurrency(startup.fundingGoal)}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Eye className="h-4 w-4" />
              <span>128 views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>12 investors</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button className="w-full" onClick={onClick}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
