import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  Calendar,
  Trophy,
  Users,
  MessageSquare,
  Video,
  Clock,
  ArrowRight,
  Star,
  Award,
  Flag,
  ThumbsUp,
  Lightbulb,
  Zap,
  Flame
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// Define types
interface Hackathon {
  id: number;
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  prize: string;
  participants: number;
  image: string;
}

interface Winner {
  id: number;
  name: string;
  description: string;
  founderName: string;
  investment: string;
  hackathon: string;
  image: string;
}

interface CommunityPost {
  id: number;
  author: string;
  role: string;
  title: string;
  excerpt: string;
  upvotes: number;
  comments: number;
  time: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  speaker: string;
  speakerRole: string;
  image: string;
}

// Helper to calculate remaining time
const getTimeRemaining = (endTime: string) => {
  const total = Date.parse(endTime) - Date.now();
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  
  return {
    total,
    days,
    hours,
    minutes,
  };
};

// Empty data arrays
const upcomingHackathons: Hackathon[] = [];

const pastWinners: Winner[] = [];

const communityPosts: CommunityPost[] = [];

const upcomingEvents: Event[] = [];

export default function HackathonSection() {
  const [nextHackathonTime, setNextHackathonTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0
  });
  
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });
  
  const [activeTab, setActiveTab] = useState("upcoming");

  // Set a default countdown for demonstration purposes
  useEffect(() => {
    // Set a default countdown for 30 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const timer = setInterval(() => {
      const timeRemaining = getTimeRemaining(futureDate.toISOString());
      setNextHackathonTime({
        days: timeRemaining.days,
        hours: timeRemaining.hours,
        minutes: timeRemaining.minutes
      });
    }, 60000); // Update every minute
    
    // Initial calculation
    const timeRemaining = getTimeRemaining(futureDate.toISOString());
    setNextHackathonTime({
      days: timeRemaining.days,
      hours: timeRemaining.hours,
      minutes: timeRemaining.minutes
    });
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-background/70">
      {/* Hero Banner */}
      <motion.div 
        className="container px-4 mx-auto mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative px-6 py-20 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary-600 text-primary-foreground">
          {/* 3D Rocket Animation Placeholder */}
          <motion.div 
            className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden md:block"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Rocket className="w-32 h-32 text-white/90" />
          </motion.div>
          
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
              🚀 Join the Next Startup Hackathon
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Build, Innovate, Win!
              </span>
            </h2>
            
            <p className="mb-8 text-xl text-primary-foreground/80">
              Showcase your ideas, connect with investors, and launch your startup in just 48 hours of innovation.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <motion.div 
                className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold">{nextHackathonTime.days}</span>
                <span className="text-xs">Days</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold">{nextHackathonTime.hours}</span>
                <span className="text-xs">Hours</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-bold">{nextHackathonTime.minutes}</span>
                <span className="text-xs">Minutes</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-center ml-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-100 rounded-full">
                  Next: AI Innovations Hackathon
                </span>
              </motion.div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                Register Now
              </Button>
              
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                View Hackathon Rules
              </Button>
              
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                Past Winners
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Tabs Section */}
      <div className="container px-4 mx-auto">
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold tracking-tight">Hackathon & Community</h2>
              <p className="text-muted-foreground">Connect, build and grow with entrepreneurs and investors</p>
            </div>
            
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="upcoming">Hackathons</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="events">Live Events</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent 
            value="upcoming" 
            ref={ref}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView && activeTab === "upcoming" ? "visible" : "hidden"}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {upcomingHackathons.length > 0 ? (
                upcomingHackathons.map((hackathon) => (
                  <motion.div key={hackathon.id} variants={itemVariants}>
                    <Card className="overflow-hidden h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={hackathon.image} 
                          alt={hackathon.title} 
                          className="object-cover w-full h-full transition-transform hover:scale-105"
                        />
                        <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent">
                          <Badge variant="outline" className="bg-black/50 text-white border-none">
                            {hackathon.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{hackathon.title}</span>
                          <Badge variant="default" className="bg-primary/90">
                            Prize: {hackathon.prize}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(hackathon.startDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} - {new Date(hackathon.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{hackathon.participants} participants</span>
                          </div>
                          <div className="text-sm font-medium">
                            Registration Open
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Starts in:</span>
                          <span className="font-medium">{getTimeRemaining(hackathon.startDate).days} days</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter>
                        <Button className="w-full">Register Now</Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={itemVariants} className="col-span-full py-16 text-center">
                  <Calendar className="mx-auto w-16 h-16 opacity-20 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Hackathons Scheduled</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Our team is working on new hackathon events. Check back soon for upcoming opportunities.
                  </p>
                  <Button variant="outline">Get Notified of New Events</Button>
                </motion.div>
              )}
            </motion.div>
            
            {/* How It Works Section */}
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={inView && activeTab === "upcoming" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="mb-2 text-2xl font-bold">How Hackathons Work</h3>
              <p className="mx-auto mb-8 text-muted-foreground md:w-2/3">From idea to funded startup in three simple steps</p>
              
              <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
                <motion.div 
                  className="flex flex-col items-center p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Flag className="w-8 h-8" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">1. Sign Up & Choose Track</h4>
                  <p className="text-sm text-muted-foreground">
                    Register your team and select from AI, FinTech, HealthTech or other innovation tracks
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">2. Build Your Idea</h4>
                  <p className="text-sm text-muted-foreground">
                    Work with mentors to develop your concept into a viable product in 48 hours
                  </p>
                </motion.div>
                
                <motion.div 
                  className="flex flex-col items-center p-6"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">3. Pitch & Win</h4>
                  <p className="text-sm text-muted-foreground">
                    Present to investors and win funding, mentorship, and launch support
                  </p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Past Winners */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={inView && activeTab === "upcoming" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Past Hackathon Winners</h3>
                <Button variant="ghost" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {pastWinners.length > 0 ? (
                  pastWinners.map((winner) => (
                    <motion.div 
                      key={winner.id} 
                      className="overflow-hidden border rounded-lg"
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)"
                      }}
                    >
                      <div className="relative h-40">
                        <img 
                          src={winner.image} 
                          alt={winner.name} 
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            <Trophy className="w-3 h-3 mr-1" /> Winner
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h4 className="text-lg font-semibold">{winner.name}</h4>
                        <p className="mb-3 text-sm text-muted-foreground">{winner.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Founded by:</span> {winner.founderName}
                          </div>
                          <div className="font-medium text-primary">
                            {winner.investment}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          {winner.hackathon}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={itemVariants} className="col-span-full py-16 text-center">
                    <Trophy className="mx-auto w-16 h-16 opacity-20 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Past Winners Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Our first cohort of hackathon winners will be announced after the completion of upcoming events.
                    </p>
                    <Button variant="outline">Apply for Next Hackathon</Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Community Discussions</h3>
                  <Button variant="outline" size="sm">Start a Discussion</Button>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeTab === "community" ? "visible" : "hidden"}
                  className="space-y-4"
                >
                  {communityPosts.length > 0 ? (
                    communityPosts.map((post) => (
                      <motion.div 
                        key={post.id} 
                        variants={itemVariants}
                        className="p-5 transition-shadow border rounded-lg hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{post.author}</div>
                              <div className="text-xs text-muted-foreground">{post.role}</div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        
                        <div className="mb-3">
                          <h4 className="mb-2 text-base font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="w-4 h-4" /> {post.upvotes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageSquare className="w-4 h-4" /> {post.comments}
                          </Button>
                          <div className="flex-grow"></div>
                          <Button variant="link" size="sm" className="gap-1">
                            Read More <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={itemVariants} className="py-16 text-center">
                      <MessageSquare className="mx-auto w-16 h-16 opacity-20 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Join the Conversation</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Be the first to start a discussion and connect with entrepreneurs and investors in our community.
                      </p>
                      <Button>Start a Discussion</Button>
                    </motion.div>
                  )}
                </motion.div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Load More Discussions</Button>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-bold">Community Highlights</h3>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Connect & Collaborate</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>5,200+ Entrepreneurs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-primary" />
                        <span>920+ Investors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>12,450+ Discussions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary" />
                        <span>250+ Success Stories</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Join Community</Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <div>
                  <h3 className="mb-4 text-xl font-bold">Top Contributors</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center p-3 border rounded-lg">
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarFallback>
                            {String.fromCharCode(64 + i)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {["Emma Rodriguez", "David Kim", "Priya Sharma"][i-1]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {["56 solutions shared", "42 startups mentored", "38 AMAs hosted"][i-1]}
                          </div>
                        </div>
                        <div className="flex ml-auto">
                          {[...Array(Math.min(i+2, 5))].map((_, j) => (
                            <Star key={j} className="w-3 h-3 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={activeTab === "events" ? "visible" : "hidden"}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Upcoming Live Events</h3>
                <Button variant="outline" size="sm">View Calendar</Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <motion.div 
                      key={event.id}
                      variants={itemVariants}
                      className="overflow-hidden border rounded-lg"
                    >
                      <div className="relative h-48">
                        <img 
                          src={event.image}
                          alt={event.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="default" className="bg-background/90 text-foreground hover:bg-background/80">
                            {event.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h4 className="mb-2 text-lg font-semibold">{event.title}</h4>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{event.date} • {event.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{event.speaker[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">
                            <span className="font-medium">{event.speaker}</span>
                            <span className="ml-1 text-muted-foreground">• {event.speakerRole}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button variant="outline" className="gap-1">
                            <Calendar className="w-4 h-4" /> Add to Calendar
                          </Button>
                          <Button className="gap-1">
                            Register <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={itemVariants} className="col-span-full py-16 text-center">
                    <Video className="mx-auto w-16 h-16 opacity-20 mb-4" />
                    <h3 className="text-xl font-medium mb-2">Events Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      We're planning exciting live events with industry experts. Subscribe to be notified when new events are scheduled.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button variant="outline">Subscribe to Updates</Button>
                      <Button>Suggest an Event</Button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-5 mt-8 text-center border rounded-lg bg-background">
                <h4 className="mb-3 text-xl font-semibold">Host Your Own Event</h4>
                <p className="mx-auto mb-4 text-muted-foreground md:w-2/3">
                  Are you an investor or industry expert? Share your knowledge with our community.
                </p>
                <Button>Submit Event Proposal</Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}