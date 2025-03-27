import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Startup } from "@shared/schema";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StartupDetail from "@/components/startup/startup-detail";
import { formatCurrency } from "@/lib/utils";

interface TrendingStartupRowProps {
  startup: Startup;
}

export default function TrendingStartupRow({ startup }: TrendingStartupRowProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { user } = useAuth();
  const isInvestor = user?.role === "investor";

  // Format the funding stage to be more readable
  const formatStage = (stage: string) => {
    return stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine the color of the stage badge
  const getStageBadgeColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      idea: "text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100",
      pre_seed: "text-purple-700 bg-purple-100 dark:bg-purple-700 dark:text-purple-100",
      seed: "text-purple-700 bg-purple-100 dark:bg-purple-700 dark:text-purple-100",
      series_a: "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100",
      series_b: "text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100",
      series_c: "text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100",
      growth: "text-indigo-700 bg-indigo-100 dark:bg-indigo-700 dark:text-indigo-100"
    };
    return stageColors[stage] || stageColors.idea;
  };

  return (
    <>
      <tr className="text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-4 py-3">
          <div className="flex items-center">
            <div className="w-10 h-10 flex-shrink-0">
              {startup.logo ? (
                <img 
                  className="object-cover w-full h-full rounded-full" 
                  src={startup.logo} 
                  alt={`${startup.name} logo`} 
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary-100 text-primary-700 rounded-full dark:bg-primary-700 dark:text-primary-100">
                  {startup.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-semibold">{startup.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{startup.description.substring(0, 30)}...</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm">
          {startup.industry}
        </td>
        <td className="px-4 py-3 text-sm">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageBadgeColor(startup.stage)}`}>
            {formatStage(startup.stage)}
          </span>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
            <span>{startup.trendingScore}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm">
          {formatCurrency(startup.fundingGoal)}
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="flex space-x-2">
            <Button 
              size="sm"
              onClick={() => setIsDetailOpen(true)}
              className="px-2 py-1 text-xs font-medium"
            >
              View
            </Button>
            {isInvestor && (
              <Button 
                size="sm"
                variant="outline"
                className="px-2 py-1 text-xs font-medium"
              >
                NDA
              </Button>
            )}
          </div>
        </td>
      </tr>

      {/* Startup Detail Dialog */}
      {isDetailOpen && (
        <StartupDetail 
          startup={startup} 
          onClose={() => setIsDetailOpen(false)} 
        />
      )}
    </>
  );
}
