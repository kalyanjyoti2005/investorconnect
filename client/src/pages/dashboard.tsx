import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatsCard from "@/components/dashboard/stats-card";
import PortfolioChart from "@/components/dashboard/portfolio-chart";
import AiRecommendationCard from "@/components/dashboard/ai-recommendation-card";
import ActivityItem from "@/components/dashboard/activity-item";
import EventItem from "@/components/dashboard/event-item";
import TrendingStartupRow from "@/components/dashboard/trending-startup-row";
import { Startup, Investment, Message, Event, Notification } from "@shared/schema";
import { FiDollarSign, FiUsers, FiEye, FiFileText, FiBarChart2, FiInbox, FiClock, FiCheckCircle } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const isInvestor = user?.role === "investor";

  // Fetch necessary data for the dashboard
  const { data: startups, isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });
  
  const { data: investments, isLoading: investmentsLoading } = useQuery<Investment[]>({
    queryKey: ["/api/investments", isInvestor ? "investor" : "startup"],
  });
  
  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });
  
  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });
  
  const { data: notifications, isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  // Generate stats cards based on real data
  const investorStatsData = [
    {
      title: "Portfolio Value",
      value: investments?.length ? `$${investments.reduce((total, inv) => total + inv.amount, 0).toLocaleString()}` : "-",
      change: investments?.length ? `${investments.length} active` : "No investments yet",
      icon: <FiDollarSign className="w-5 h-5" />,
      color: "green",
    },
    {
      title: "Active Investments",
      value: investments?.length ? investments.length.toString() : "0",
      change: "Active investments",
      icon: <FiBarChart2 className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Startups Viewed",
      value: startups?.length ? startups.length.toString() : "0",
      change: "Available startups",
      icon: <FiEye className="w-5 h-5" />,
      color: "yellow",
    },
    {
      title: "Unread Messages",
      value: messages?.filter(m => m.status === "unread" && m.receiverId === user?.id)?.length.toString() || "0",
      change: "Awaiting response",
      icon: <FiInbox className="w-5 h-5" />,
      color: "purple",
    },
  ];

  const founderStatsData = [
    {
      title: "Total Funding",
      value: investments?.length ? `$${investments.reduce((total, inv) => total + inv.amount, 0).toLocaleString()}` : "$0",
      change: investments?.length ? `${investments.length} investments` : "No funding yet",
      icon: <FiDollarSign className="w-5 h-5" />,
      color: "green",
    },
    {
      title: "Investor Interest",
      value: startups?.length ? (startups[0]?.trendingScore?.toString() || "0") : "0",
      change: "Profile views",
      icon: <FiUsers className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Documents",
      value: "0",
      change: "Active NDAs",
      icon: <FiFileText className="w-5 h-5" />,
      color: "yellow",
    },
    {
      title: "Upcoming Events",
      value: events?.length?.toString() || "0",
      change: "Scheduled events",
      icon: <FiClock className="w-5 h-5" />,
      color: "purple",
    },
  ];

  // Generate recent activity items from notifications
  const recentActivityItems = notifications?.map(notification => ({
    id: notification.id,
    title: notification.content,
    time: formatTimeAgo(notification.createdAt),
    icon: getIconForNotificationType(notification.type),
    color: getColorForNotificationType(notification.type),
  })) || [];

  // Helper function to format time ago
  function formatTimeAgo(dateString: string | Date) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
  
  // Helper functions for notification icons and colors
  function getIconForNotificationType(type: string): string {
    switch (type) {
      case 'investment': return 'dollar';
      case 'message': return 'message';
      case 'event': return 'calendar';
      case 'milestone': return 'check';
      case 'nda': return 'file';
      default: return 'info';
    }
  }
  
  function getColorForNotificationType(type: string): string {
    switch (type) {
      case 'investment': return 'green';
      case 'message': return 'blue';
      case 'event': return 'purple';
      case 'milestone': return 'primary';
      case 'nda': return 'yellow';
      default: return 'gray';
    }
  }

  // Upcoming events from events data
  const upcomingEventsData = events?.map(event => ({
    id: event.id,
    title: event.title,
    time: formatEventTime(event.startTime, event.endTime),
    date: formatEventDate(event.startTime),
    details: event.description || "No additional details",
    type: "event", // Default event type
    color: "primary",
  })) || [];
  
  // Helper functions for event time and date formatting
  function formatEventTime(start: string | Date, end: string | Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  function formatEventDate(date: string | Date) {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (eventDate.toDateString() === today.toDateString()) return 'Today';
    if (eventDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    // Calculate days difference
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return eventDate.toLocaleDateString();
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header />
        
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {isInvestor ? "Investor Dashboard" : "Startup Founder Dashboard"}
            </h2>
            
            {/* Stats Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              {(isInvestor ? investorStatsData : founderStatsData).map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  icon={stat.icon}
                  color={stat.color}
                />
              ))}
            </div>
            
            {/* Portfolio Performance & AI Recommendations */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Portfolio Performance */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {isInvestor ? "Portfolio Performance" : "Funding Progress"}
                </h4>
                {investmentsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : investments && investments.length > 0 ? (
                  <div className="relative" style={{ height: "300px" }}>
                    <PortfolioChart data={investments} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
                    <FiDollarSign className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-lg mb-2">No {isInvestor ? "investment" : "funding"} data available.</p>
                    <p className="text-sm">
                      {isInvestor 
                        ? "Start investing in promising startups to track your portfolio performance."
                        : "Secure your first investment to track your funding progress."}
                    </p>
                  </div>
                )}
              </div>
              
              {/* AI Recommendations or Similar Feature */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {isInvestor ? "Startup Recommendations" : "Potential Investors"}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-700 dark:text-primary-100">Coming Soon</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
                  <FiCheckCircle className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg mb-2">AI-powered matching is on the way!</p>
                  <p className="text-sm">
                    We're building an intelligent system to match 
                    {isInvestor ? " startups with your investment criteria." : " your startup with the right investors."}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity & Upcoming Events */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* Recent Activity */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Recent Activity
                </h4>
                {notificationsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : recentActivityItems.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivityItems.slice(0, 4).map((activity) => (
                      <ActivityItem
                        key={activity.id}
                        title={activity.title}
                        time={activity.time}
                        icon={activity.icon}
                        color={activity.color}
                      />
                    ))}
                    <div className="mt-6 text-center">
                      <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View All Activity</a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
                    <FiInbox className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-lg mb-2">No recent activity</p>
                    <p className="text-sm">Your recent activities will appear here.</p>
                  </div>
                )}
              </div>
              
              {/* Upcoming Events */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Upcoming Events
                </h4>
                {eventsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : upcomingEventsData.length > 0 ? (
                  <div className="space-y-6">
                    {upcomingEventsData.slice(0, 3).map((event) => (
                      <EventItem
                        key={event.id}
                        title={event.title}
                        time={event.time}
                        date={event.date}
                        details={event.details}
                        type={event.type}
                        color={event.color}
                      />
                    ))}
                    <div className="mt-6 text-center">
                      <a href="/events" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View Full Calendar</a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500 dark:text-gray-400">
                    <FiClock className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-lg mb-2">No upcoming events</p>
                    <p className="text-sm">Schedule or join events to see them here.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Trending Startups */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  {isInvestor ? "Trending Startups" : "Your Startups"}
                </h4>
                <a href="/explore" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View All</a>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full whitespace-nowrap">
                    <thead>
                      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600">
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3">Industry</th>
                        <th className="px-4 py-3">Stage</th>
                        <th className="px-4 py-3">Funding Goal</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {startupsLoading ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex items-center justify-center py-4">
                              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                              Loading startups...
                            </div>
                          </td>
                        </tr>
                      ) : startups && startups.length > 0 ? (
                        startups.slice(0, 3).map((startup) => (
                          <TrendingStartupRow
                            key={startup.id}
                            startup={startup}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            <div className="flex flex-col items-center justify-center py-8">
                              <FiUsers className="w-10 h-10 mb-3 opacity-30" />
                              <p className="mb-1">No startups found.</p>
                              {isInvestor ? (
                                <p className="text-sm">Explore startups to find investment opportunities.</p>
                              ) : (
                                <p className="text-sm">Create your first startup to begin.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700">
          <p>&copy; {new Date().getFullYear()} StartupMatch. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
