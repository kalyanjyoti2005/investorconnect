import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BellIcon, Search, Menu, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // We could navigate to search results page, or handle the search in another way
      toast({
        title: "Search functionality",
        description: `Search for "${searchQuery}" will be implemented soon.`
      });
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      }
    });
  };

  return (
    <header className="z-10 py-4 bg-white shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between h-8 px-6 mx-auto">
        {/* Mobile Menu Button - controlled by sidebar component */}
        <button 
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-primary-400"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search */}
        <div className="flex justify-center flex-1 md:mr-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl mr-6 focus-within:text-primary-500">
            <div className="absolute inset-y-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
              className="w-full pl-10 pr-3 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none focus:border-primary-400 dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700"
              type="text"
              placeholder="Search startups, investors, or topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        
        {/* Right Nav Items */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Notifications */}
          <li className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative p-2 text-gray-500 align-middle rounded-md hover:text-white hover:bg-primary-600 dark:text-gray-400 dark:hover:text-white"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
          </li>
          
          {/* Profile */}
          <li className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.profileImage || undefined}
                      alt={user?.name || "User avatar"}
                    />
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden sm:inline-block">
                    {user?.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:text-red-600 focus:text-red-600" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </header>
  );
}
