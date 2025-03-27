import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string, darkBg: string, darkText: string }> = {
      green: {
        bg: "bg-green-100", 
        text: "text-green-500", 
        darkBg: "dark:bg-green-500", 
        darkText: "dark:text-green-100"
      },
      blue: {
        bg: "bg-blue-100", 
        text: "text-blue-500", 
        darkBg: "dark:bg-blue-500", 
        darkText: "dark:text-blue-100"
      },
      yellow: {
        bg: "bg-yellow-100", 
        text: "text-yellow-500", 
        darkBg: "dark:bg-yellow-500", 
        darkText: "dark:text-yellow-100"
      },
      purple: {
        bg: "bg-purple-100", 
        text: "text-purple-500", 
        darkBg: "dark:bg-purple-500", 
        darkText: "dark:text-purple-100"
      },
      red: {
        bg: "bg-red-100", 
        text: "text-red-500", 
        darkBg: "dark:bg-red-500", 
        darkText: "dark:text-red-100"
      },
      primary: {
        bg: "bg-primary-100", 
        text: "text-primary-500", 
        darkBg: "dark:bg-primary-500", 
        darkText: "dark:text-primary-100"
      }
    };

    return colorMap[color] || colorMap.primary;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className={cn(
        "p-3 mr-4 rounded-full",
        colorClasses.bg,
        colorClasses.text,
        colorClasses.darkBg,
        colorClasses.darkText
      )}>
        {icon}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {value}
        </p>
        <p className={cn(
          "text-sm flex items-center",
          change.includes('+') ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
        )}>
          {change.includes('+') && (
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          )}
          {change}
        </p>
      </div>
    </div>
  );
}
