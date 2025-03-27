import { Button } from "@/components/ui/button";

interface AiRecommendationCardProps {
  name: string;
  description: string;
  logo: string;
  matchPercentage: number;
  reason: string;
}

export default function AiRecommendationCard({
  name,
  description,
  logo,
  matchPercentage,
  reason
}: AiRecommendationCardProps) {
  // Calculate color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100";
    if (percentage >= 85) return "text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100";
    return "text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100";
  };

  return (
    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            className="object-cover w-10 h-10 rounded-full" 
            src={logo} 
            alt={`${name} logo`} 
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getMatchColor(matchPercentage)}`}>
          {matchPercentage}% match
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
        {reason}
      </p>
      <div className="flex mt-3 space-x-2">
        <Button 
          size="sm"
          className="px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          View Profile
        </Button>
        <Button 
          size="sm"
          variant="outline"
          className="px-2 py-1 text-xs font-medium"
        >
          Request NDA
        </Button>
      </div>
    </div>
  );
}
