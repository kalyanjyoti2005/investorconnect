import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Lock,
  Handshake,
  Brain,
  ChevronRight,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeFeatureTab, setActiveFeatureTab] = useState("startups");
  const [visibleSection, setVisibleSection] = useState("");
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    document.querySelectorAll("section[id]").forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);
  
  // Generate random percentage for success metrics animation
  const getRandomPercentage = () => Math.floor(Math.random() * 61) + 40; // Random number between 40-100
  
  // Helper for staggered animations
  const staggeredChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const childAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold">StartupMatch</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" onClick={() => navigate("/auth?mode=login")}>
              Log in
            </Button>
            <Button variant="default" onClick={() => navigate("/auth?mode=register")}>
              Sign up
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content with padding for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 relative overflow-hidden py-12">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"></div>
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 text-center md:text-left"
              >
                <Badge className="mb-4 text-sm py-1.5 px-4 bg-primary/10 text-primary border-primary/20">
                  Startup-Investor Matchmaking Platform
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                  Where Vision Meets Investment 🚀
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0">
                  Secure, AI-powered matchmaking for startups & investors with milestone-based funding and blockchain protection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button 
                    size="lg" 
                    className="relative group overflow-hidden"
                    onClick={() => navigate("/auth?mode=register")}
                  >
                    <span className="relative z-10">Get Started</span>
                    <span className="absolute inset-0 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate("/explore")}
                  >
                    Explore Startups
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 relative max-w-md mx-auto"
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
                  <div className="bg-card border rounded-lg shadow-xl p-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Rocket className="text-primary" />
                        <h3 className="font-semibold">Featured Startup</h3>
                      </div>
                      <Badge>AI Powered</Badge>
                    </div>
                    <h4 className="text-lg font-bold mb-2">EcoTech Solutions</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Revolutionary green energy solutions for sustainable future
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">CleanTech</Badge>
                      <Badge variant="outline">Seed Stage</Badge>
                      <Badge variant="outline">$2M Target</Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Funding Progress</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[65%]"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-muted-foreground/30 flex items-center justify-center text-xs border-2 border-background">
                            {["JS", "KR", "LM"][i-1]}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +4
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-card border rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transform rotate-3">
                  <Shield className="text-primary mb-1 h-8 w-8" />
                  <div className="text-center">
                    <p className="text-xs font-semibold">NDA Protected</p>
                    <p className="text-[10px] text-muted-foreground">Blockchain Secured</p>
                  </div>
                </div>
                
                <div className="absolute -left-8 -top-8 w-28 h-28 bg-card border rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transform -rotate-6">
                  <Brain className="text-primary mb-1 h-8 w-8" />
                  <div className="text-center">
                    <p className="text-xs font-semibold">AI Matched</p>
                    <p className="text-[10px] text-muted-foreground">97% Compatibility</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
              {[
                { icon: Users, label: "500+ Startups", sublabel: "Registered" },
                { icon: Handshake, label: "300+ Investors", sublabel: "Active" },
                { icon: TrendingUp, label: "$50M+", sublabel: "Total Investments" },
                { icon: Shield, label: "100%", sublabel: "Secure Escrow" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <stat.icon className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-xl font-bold">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Problem & Solution Section */}
        <section 
          id="why-us" 
          className="py-20 bg-muted/30"
        >
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSection === "why-us" ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4">Why Choose StartupMatch?</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">The Problems We Solve</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Traditional startup funding is broken. We're fixing it with technology, security, and transparency.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  problem: "Hard to find trusted investors & scalable startups",
                  solution: "AI-powered startup-investor matchmaking",
                  icon: Brain
                },
                {
                  problem: "Funding scams & lack of milestone tracking",
                  solution: "Secure escrow-based milestone funding",
                  icon: Shield
                },
                {
                  problem: "No transparency in startup evaluation",
                  solution: "Blockchain-protected NDAs & KYC verification",
                  icon: Lock
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visibleSection === "why-us" ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 * i, duration: 0.5 }}
                  className="group h-64 relative perspective"
                >
                  <div className="relative preserve-3d w-full h-full duration-500 group-hover:rotate-y-180">
                    <div className="absolute inset-0 backface-hidden rounded-xl border bg-card shadow p-6 flex flex-col items-center justify-center text-center">
                      <XCircle className="h-12 w-12 text-destructive mb-4" />
                      <h3 className="font-bold text-lg mb-2">Problem</h3>
                      <p className="text-muted-foreground">{item.problem}</p>
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border bg-primary/5 shadow p-6 flex flex-col items-center justify-center text-center">
                      <item.icon className="h-12 w-12 text-primary mb-4" />
                      <h3 className="font-bold text-lg mb-2">Solution</h3>
                      <p className="text-muted-foreground">{item.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSection === "how-it-works" ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4">Process</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our step-by-step process ensures security and transparency for both startups and investors.
              </p>
            </motion.div>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-1/2 -ml-[1px] w-0.5 bg-border"></div>
              
              {[
                {
                  title: "Connect & Discover",
                  description: "Startups submit ideas, investors browse & sign NDAs",
                  icon: Users
                },
                {
                  title: "Communicate & Evaluate",
                  description: "Investors propose funding, chat & review startup insights",
                  icon: BarChart3
                },
                {
                  title: "Fund Securely",
                  description: "Escrow-based milestone funding ensures security",
                  icon: Lock
                },
                {
                  title: "Growth & Success",
                  description: "Funds are released on milestone completion",
                  icon: TrendingUp
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  animate={visibleSection === "how-it-works" ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 * i, duration: 0.5 }}
                  className="relative mb-12"
                >
                  <div className={`flex ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}>
                    <div className="w-1/2 px-4">
                      <div className={`px-6 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <Badge variant="outline">{`Step ${i + 1}`}</Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="absolute left-1/2 -ml-6 -mt-1 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10">
                      <step.icon className="text-primary h-6 w-6" />
                    </div>
                    
                    <div className="w-1/2 px-4">
                      {/* Empty section for layout */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features & Benefits Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSection === "features" ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Features & Benefits</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Custom-tailored features for both startup founders and investors.
              </p>
            </motion.div>
            
            <div className="mb-8">
              <Tabs
                defaultValue="startups"
                value={activeFeatureTab}
                onValueChange={setActiveFeatureTab}
                className="w-full"
              >
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="startups">For Startups</TabsTrigger>
                  <TabsTrigger value="investors">For Investors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="startups" className="mt-8">
                  <motion.div
                    variants={staggeredChildren}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {[
                      {
                        title: "Find Trusted Investors",
                        description: "Connect with verified investors who match your industry and stage",
                        icon: Users
                      },
                      {
                        title: "NDA Protection",
                        description: "Secure your idea with blockchain-verified NDAs before sharing details",
                        icon: Shield
                      },
                      {
                        title: "Milestone Funding",
                        description: "Receive secure, escrow-protected funding based on achieved milestones",
                        icon: TrendingUp
                      },
                      {
                        title: "AI Insights",
                        description: "Get AI-powered insights on your business plan and pitch deck",
                        icon: Brain
                      },
                      {
                        title: "Direct Communication",
                        description: "Chat directly with interested investors in a secure environment",
                        icon: MessageSquare
                      },
                      {
                        title: "Progress Tracking",
                        description: "Track your fundraising progress and milestone achievements",
                        icon: BarChart3
                      }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        variants={childAnimation}
                        className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
                      >
                        <feature.icon className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="investors" className="mt-8">
                  <motion.div
                    variants={staggeredChildren}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {[
                      {
                        title: "Verified Startups",
                        description: "Discover high-potential startups that have passed our verification process",
                        icon: CheckCircle2
                      },
                      {
                        title: "Secure Investments",
                        description: "Invest with escrow protection and milestone-based fund releases",
                        icon: Lock
                      },
                      {
                        title: "Detailed Analytics",
                        description: "Access comprehensive analytics and growth metrics for each startup",
                        icon: BarChart3
                      },
                      {
                        title: "Investor Community",
                        description: "Connect with other investors for co-investment opportunities",
                        icon: Users
                      },
                      {
                        title: "AI Matching",
                        description: "Get AI-powered recommendations based on your investment preferences",
                        icon: Brain
                      },
                      {
                        title: "Real-time Updates",
                        description: "Stay updated on startup progress and milestone achievements",
                        icon: TrendingUp
                      }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        variants={childAnimation}
                        className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow"
                      >
                        <feature.icon className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Community Section */}
        <section id="community" className="py-20">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSection === "community" ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4">Community</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Live Startup & Investor Community</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join a thriving ecosystem of founders and investors.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={visibleSection === "community" ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-xl border shadow-lg p-6 relative"
              >
                <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                  Live Now
                </div>
                
                <h3 className="text-xl font-bold mb-4">Trending Startup Pitches</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "GreenTech Solutions",
                      pitch: "Revolutionizing sustainable energy with AI-powered solar technology",
                      votes: 42
                    },
                    {
                      name: "MediConnect",
                      pitch: "Blockchain-based healthcare data management system",
                      votes: 38
                    },
                    {
                      name: "FinLearn",
                      pitch: "Financial education platform with gamified learning experience",
                      votes: 29
                    }
                  ].map((startup, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-background rounded-lg">
                      <div className="flex flex-col items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold">{startup.votes}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{startup.name}</h4>
                        <p className="text-sm text-muted-foreground">{startup.pitch}</p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline" className="text-xs">Seed Stage</Badge>
                          <Badge variant="outline" className="text-xs">Tech</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-6" variant="outline">
                  View All Pitches <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={visibleSection === "community" ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl"></div>
                <Card className="relative z-10 h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h3 className="text-xl font-bold mb-4">Recent Success Stories</h3>
                    
                    <div className="space-y-6 flex-grow">
                      {[
                        {
                          startup: "AI Health Solutions",
                          amount: "$2.5M",
                          investors: 5,
                          growth: 180
                        },
                        {
                          startup: "BlockFinance",
                          amount: "$1.8M",
                          investors: 3,
                          growth: 150
                        },
                        {
                          startup: "EduTech Innovations",
                          amount: "$3.2M",
                          investors: 7,
                          growth: 210
                        }
                      ].map((story, i) => (
                        <div key={i} className="relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{story.startup}</h4>
                              <p className="text-sm text-muted-foreground">Raised {story.amount} from {story.investors} investors</p>
                            </div>
                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              +{story.growth}% Growth
                            </div>
                          </div>
                          
                          <div className="mt-3 flex -space-x-2">
                            {Array(Math.min(4, story.investors)).fill(0).map((_, j) => (
                              <div key={j} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                {["VC", "JB", "EF", "LI"][j]}
                              </div>
                            ))}
                            
                            {story.investors > 4 && (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs border-2 border-background">
                                +{story.investors - 4}
                              </div>
                            )}
                          </div>
                          
                          {i < 2 && <div className="absolute -bottom-3 left-0 right-0 h-px bg-border"></div>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Platform Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold">{getRandomPercentage()}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg. ROI</p>
                          <p className="text-2xl font-bold">{getRandomPercentage() + 20}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section id="cta" className="py-24 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl"></div>
          </div>
          
          <div className="container px-4 mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={visibleSection === "cta" ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4">Get Started Today</Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Future of Startup Investment</h2>
              <p className="text-lg text-muted-foreground mb-10">
                Sign up now to get exclusive early access to our platform and connect with founders or investors.
              </p>
              
              <div className="bg-card border shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button
                    className="flex-1 h-auto py-6 text-lg relative overflow-hidden group"
                    onClick={() => navigate("/auth?mode=register&role=founder")}
                  >
                    <div className="relative z-10">
                      <Rocket className="h-6 w-6 mb-2 mx-auto" />
                      <span>Join as Founder</span>
                    </div>
                    <span className="absolute inset-0 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Button>
                  
                  <Button
                    className="flex-1 h-auto py-6 text-lg relative overflow-hidden group"
                    onClick={() => navigate("/auth?mode=register&role=investor")}
                  >
                    <div className="relative z-10">
                      <TrendingUp className="h-6 w-6 mb-2 mx-auto" />
                      <span>Join as Investor</span>
                    </div>
                    <span className="absolute inset-0 bg-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </Button>
                </div>
                
                <div className="flex justify-center items-center gap-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">Secure Transactions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">Verified Users</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
                </svg>
                <span className="ml-2 text-xl font-bold">StartupMatch</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting visionary startups with strategic investors through secure, AI-powered matchmaking.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">How it Works</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Security</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Startup Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Investor Guide</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StartupMatch. All rights reserved.
            </p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* CSS for 3D card effect - added in the global styles */}
    </div>
  );
}