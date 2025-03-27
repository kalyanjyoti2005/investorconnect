import { Button } from "@/components/ui/button";
import { Calendar, Video, Users } from "lucide-react";

interface EventItemProps {
  title: string;
  time: string;
  date: string;
  details: string;
  type: string;
  color: string;
}

export default function EventItem({ title, time, date, details, type, color }: EventItemProps) {
  // Map color string to Tailwind classes
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: "bg-primary-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
    };
    return colorMap[color] || colorMap.primary;
  };

  // Get date badge color
  const getDateBadgeColor = (date: string) => {
    if (date.toLowerCase().includes("today")) {
      return "text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100";
    }
    if (date.toLowerCase().includes("tomorrow")) {
      return "text-orange-700 bg-orange-100 dark:bg-orange-700 dark:text-orange-100";
    }
    return "text-gray-700 bg-gray-100 dark:bg-gray-600 dark:text-gray-100";
  };

  // Get the appropriate icon based on the event type
  const getEventIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "virtual":
        return <Video className="w-4 h-4" />;
      case "meeting":
        return <Users className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative pl-8 group hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors -mx-2">
      <div className={`absolute top-0 left-0 w-4 h-4 ${getColorClasses(color)} rounded-full`}></div>
      <span className="absolute top-0 left-0 w-px h-full bg-primary-200 dark:bg-primary-700" style={{ left: "8px", transform: "translateX(-50%)" }}></span>
      
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h5>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDateBadgeColor(date)}`}>
          {date}
        </span>
      </div>
      
      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        {time} • {details}
      </p>
      
      <div className="flex items-center mt-2 space-x-3">
        <Button 
          size="sm" 
          className="px-2 py-1 text-xs font-medium flex items-center gap-1"
        >
          {getEventIcon(type)}
          {type === "virtual" ? "Join Event" : type === "meeting" ? "Join Meeting" : "View Details"}
        </Button>
        
        <Button 
          size="sm"
          variant="outline"
          className="px-2 py-1 text-xs font-medium"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
}
