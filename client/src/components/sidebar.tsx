import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, Search, BanknoteIcon, MessageSquare, 
  Calendar, ArrowUpDown, Settings, HelpCircle, Moon, Sun,
  Menu, X, LightbulbIcon, BarChart3, Users
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/context/theme-context";
import { Message, Notification } from "@shared/schema";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const isInvestor = user?.role === "investor";

  const { data: unreadMessages } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    select: (messages) => messages.filter(msg => msg.receiverId === user?.id && msg.status === "unread"),
  });

  const { data: unreadNotifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    select: (notifications) => notifications.filter(notif => !notif.read),
  });

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const closeSidebar = () => {
    setExpanded(false);
  };

  const NavItem = ({ href, icon, label, count }: { href: string; icon: React.ReactNode; label: string; count?: number }) => {
    const isActive = location === href;
    
    return (
      <Link 
        href={href}
        onClick={closeSidebar}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150",
          isActive 
            ? "bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
      >
        {icon}
        <span className="ml-4">{label}</span>
        {count && count > 0 && (
          <Badge variant="default" className="ml-auto">
            {count}
          </Badge>
        )}
      </Link>
    );
  };

  const sidebarClasses = cn(
    "fixed inset-y-0 z-20 flex-shrink-0 w-64 overflow-y-auto bg-white border-r transition-transform dark:bg-gray-800 dark:border-gray-700 md:static md:block",
    expanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Mobile Overlay */}
      {expanded && (
        <div 
          className="fixed inset-0 z-10 bg-black/50 md:hidden" 
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    
      <aside className={sidebarClasses}>
        <div className="py-4">
          {/* Logo */}
          <div className="flex items-center justify-center px-4 mb-8">
            <div className="flex items-center">
              <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
              </svg>
              <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">StartupMatch</span>
            </div>
          </div>
          
          {/* User Badge */}
          <div className="flex items-center justify-center px-4 mb-4">
            <div className="p-3 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg shadow-md w-full">
              <div className="flex items-center justify-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage || undefined} alt={user?.name} />
                  <AvatarFallback className="bg-primary-200 text-primary-700">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user?.name}</div>
                  <div className="capitalize">{user?.role}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="mt-5 px-4 space-y-1">
            <NavItem 
              href="/" 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              count={unreadNotifications?.length}
            />
            
            <NavItem 
              href="/explore" 
              icon={<Search className="w-5 h-5" />} 
              label="Explore Startups" 
            />
            
            <NavItem 
              href="/investments" 
              icon={<BanknoteIcon className="w-5 h-5" />} 
              label={isInvestor ? "My Investments" : "Funding"} 
            />
            
            <NavItem 
              href="/messages" 
              icon={<MessageSquare className="w-5 h-5" />} 
              label="Messages" 
              count={unreadMessages?.length}
            />
            
            <NavItem 
              href="/events" 
              icon={<Calendar className="w-5 h-5" />} 
              label="Events" 
            />
            
            <NavItem 
              href="/voting" 
              icon={<ArrowUpDown className="w-5 h-5" />} 
              label="Voting Panel" 
            />

            {!isInvestor && (
              <NavItem 
                href="/submit-idea" 
                icon={<LightbulbIcon className="w-5 h-5" />} 
                label="Submit Idea" 
              />
            )}
            
            {isInvestor && (
              <NavItem 
                href="/investor" 
                icon={<BarChart3 className="w-5 h-5" />} 
                label="Investor Dashboard" 
              />
            )}
          </nav>
          
          {/* Settings and Help Section */}
          <div className="px-4 mt-6">
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <NavItem 
                href="/settings" 
                icon={<Settings className="w-5 h-5" />} 
                label="Settings" 
              />
              
              <NavItem 
                href="/help" 
                icon={<HelpCircle className="w-5 h-5" />} 
                label="Help Center" 
              />
              
              {/* Toggle Dark Mode */}
              <div 
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 transition-colors duration-150 rounded-lg cursor-pointer dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="ml-4">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                <div className="relative inline-block w-10 ml-auto align-middle select-none">
                  <div className={cn(
                    "block h-6 rounded-full cursor-pointer bg-gray-300 dark:bg-gray-700",
                    "after:block after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform",
                    theme === "dark" && "after:translate-x-4"
                  )}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 z-30 md:hidden shadow-lg bg-primary-600 text-white hover:bg-primary-700"
        onClick={toggleSidebar}
      >
        {expanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </>
  );
}
