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
import { Startup } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const isInvestor = user?.role === "investor";

  // Fetch trending startups
  const { data: startups, isLoading: startupsLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  // Example data for the dashboard
  const investorStats = [
    {
      title: "Portfolio Value",
      value: "$6,389,400",
      change: "+12.5%",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "green",
    },
    {
      title: "Active Investments",
      value: "23",
      change: "4 new this month",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
      color: "blue",
    },
    {
      title: "Deal Flow",
      value: "47",
      change: "12 new views",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "yellow",
    },
    {
      title: "Avg. ROI",
      value: "24.5%",
      change: "+3.2% increase",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "purple",
    },
  ];

  const founderStats = [
    {
      title: "Current Funding",
      value: "$2,850,000",
      change: "+15% this month",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "green",
    },
    {
      title: "Investor Interest",
      value: "37",
      change: "8 new this month",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
        </svg>
      ),
      color: "blue",
    },
    {
      title: "NDA Requests",
      value: "18",
      change: "5 pending",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "yellow",
    },
    {
      title: "Pitch Views",
      value: "210",
      change: "+12% increase",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      color: "purple",
    },
  ];

  // Recommendation data
  const recommendations = [
    {
      id: 1,
      name: "HealthAI Solutions",
      description: "AI-powered healthcare diagnostics",
      logo: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120&q=80",
      matchPercentage: 98,
      reason: "Based on your interest in healthcare technology and previous investments in early-stage medical startups.",
    },
    {
      id: 2,
      name: "GreenTech Energy",
      description: "Renewable energy storage solutions",
      logo: "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120&q=80",
      matchPercentage: 94,
      reason: "Matches your interest in sustainable technology and recent portfolio diversification into clean energy.",
    },
    {
      id: 3,
      name: "FinTech Innovate",
      description: "Blockchain payment infrastructure",
      logo: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120&q=80",
      matchPercentage: 85,
      reason: "Aligns with your fintech portfolio and interest in decentralized finance solutions.",
    },
  ];

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      type: "investment",
      title: "New investment made in RoboTech Solutions",
      time: "10 minutes ago",
      icon: "plus",
      color: "primary",
    },
    {
      id: 2,
      type: "message",
      title: "New message from Sarah Wilson at HealthAI",
      time: "2 hours ago",
      icon: "message",
      color: "blue",
    },
    {
      id: 3,
      type: "nda",
      title: "NDA signed with FinTech Innovate",
      time: "5 hours ago",
      icon: "info",
      color: "yellow",
    },
    {
      id: 4,
      type: "payment",
      title: "Milestone payment of $150,000 released to EcoTech",
      time: "1 day ago",
      icon: "dollar",
      color: "green",
    },
  ];

  // Upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Virtual Pitch Night: AI & Machine Learning",
      time: "7:00 PM - 9:00 PM EST",
      date: "Today",
      details: "8 startups presenting",
      type: "virtual",
      color: "primary",
    },
    {
      id: 2,
      title: "1:1 Meeting with GreenTech Energy Founders",
      time: "10:30 AM - 11:30 AM EST",
      date: "Tomorrow",
      details: "Virtual Meeting",
      type: "meeting",
      color: "blue",
    },
    {
      id: 3,
      title: "Investor Syndicate Meeting: Healthcare Tech",
      time: "2:00 PM - 3:30 PM EST",
      date: "In 3 days",
      details: "5 investors confirmed",
      type: "syndicate",
      color: "purple",
    },
  ];

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
              {(isInvestor ? investorStats : founderStats).map((stat, index) => (
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
            
            {/* AI Recommendations & Portfolio Performance */}
            <div className="grid gap-6 mb-8 md:grid-cols-2">
              {/* AI Recommendations */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    AI-Powered Recommendations
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full dark:bg-primary-700 dark:text-primary-100">AI-Powered</span>
                    <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View All</a>
                  </div>
                </div>
                
                {/* Recommendation Cards */}
                <div className="space-y-4">
                  {recommendations.map((recommendation) => (
                    <AiRecommendationCard
                      key={recommendation.id}
                      name={recommendation.name}
                      description={recommendation.description}
                      logo={recommendation.logo}
                      matchPercentage={recommendation.matchPercentage}
                      reason={recommendation.reason}
                    />
                  ))}
                </div>
              </div>
              
              {/* Portfolio Performance */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Portfolio Performance
                </h4>
                <div className="relative" style={{ height: "300px" }}>
                  <PortfolioChart />
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
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      title={activity.title}
                      time={activity.time}
                      icon={activity.icon}
                      color={activity.color}
                    />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View All Activity</a>
                </div>
              </div>
              
              {/* Upcoming Events */}
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Upcoming Events
                </h4>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
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
                </div>
                <div className="mt-6 text-center">
                  <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View Full Calendar</a>
                </div>
              </div>
            </div>
            
            {/* Trending Startups */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Trending Startups
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
                        <th className="px-4 py-3">Trend Score</th>
                        <th className="px-4 py-3">Funding Goal</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                      {startups?.slice(0, 3).map((startup) => (
                        <TrendingStartupRow
                          key={startup.id}
                          startup={startup}
                        />
                      ))}
                      {startupsLoading && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            Loading startups...
                          </td>
                        </tr>
                      )}
                      {!startupsLoading && (!startups || startups.length === 0) && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                            No startups found. Be the first to create one!
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
          <p>&copy; 2023 StartupMatch. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
