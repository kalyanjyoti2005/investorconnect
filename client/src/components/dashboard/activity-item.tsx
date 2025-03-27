import { 
  PlusCircle, 
  MessageSquare, 
  AlertCircle, 
  DollarSign, 
  Activity,
  CheckCircle
} from "lucide-react";

interface ActivityItemProps {
  title: string;
  time: string;
  icon: string;
  color: string;
}

export default function ActivityItem({ title, time, icon, color }: ActivityItemProps) {
  // Map color string to Tailwind classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string }> = {
      primary: { bg: "bg-primary-500", text: "text-white" },
      blue: { bg: "bg-blue-500", text: "text-white" },
      green: { bg: "bg-green-500", text: "text-white" },
      yellow: { bg: "bg-yellow-500", text: "text-white" },
      red: { bg: "bg-red-500", text: "text-white" },
      purple: { bg: "bg-purple-500", text: "text-white" },
    };
    return colorMap[color] || colorMap.primary;
  };

  // Get the appropriate icon based on the icon string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "plus":
        return <PlusCircle className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      case "info":
        return <AlertCircle className="w-4 h-4" />;
      case "dollar":
        return <DollarSign className="w-4 h-4" />;
      case "check":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="flex group hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors -mx-2">
      <div className="relative mr-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses.bg} ${colorClasses.text}`}>
          {getIcon(icon)}
        </div>
        <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full"></span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
  );
}
