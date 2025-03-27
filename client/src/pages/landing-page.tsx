import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Shield, Users, TrendingUp, Brain, Rocket, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold">StartupMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth?mode=login")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/auth?mode=register")}>
              Sign up
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-grow flex items-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                Startup-Investor Matchmaking Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Where Vision Meets Investment 🚀
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Secure, AI-powered matchmaking for startups & investors with milestone-based funding and blockchain protection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="relative group overflow-hidden"
                  onClick={() => navigate("/auth?mode=register")}
                >
                  <span className="relative z-10">Get Started</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/auth?mode=register&role=investor")}
                >
                  Join as Investor
                </Button>
              </div>
            </div>
            
            <div className="relative mx-auto max-w-md">
              <div className="bg-card border shadow-lg rounded-lg p-6 relative">
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
                <Button className="w-full">View Details</Button>
              </div>
              
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-card border rounded-lg shadow-lg p-3 flex flex-col items-center justify-center">
                <Shield className="text-primary mb-1 h-6 w-6" />
                <div className="text-center">
                  <p className="text-xs font-semibold">NDA Protected</p>
                  <p className="text-[10px] text-muted-foreground">Blockchain Secured</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {[
              { icon: Users, label: "500+ Startups", sublabel: "Registered" },
              { icon: Brain, label: "AI Matching", sublabel: "Technology" },
              { icon: TrendingUp, label: "$50M+", sublabel: "Total Investments" },
              { icon: Shield, label: "100%", sublabel: "Secure Escrow" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <stat.icon className="h-10 w-10 text-primary mb-2" />
                <h3 className="text-xl font-bold">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Why Choose StartupMatch?</Badge>
            <h2 className="text-3xl font-bold mb-4">The Problems We Solve</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional startup funding is broken. We're fixing it with technology, security, and transparency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
              <Brain className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Connect with the perfect investors or startups based on your specific criteria and compatibility.
              </p>
            </div>
            
            <div className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Secure Funding</h3>
              <p className="text-muted-foreground">
                Milestone-based escrow ensures both founders and investors are protected throughout the funding process.
              </p>
            </div>
            
            <div className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Growth Tracking</h3>
              <p className="text-muted-foreground">
                Monitor startup progress with transparent metrics and milestone achievements.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Future of Startup Investment</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up now to get exclusive early access to our platform and connect with founders or investors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Button 
              size="lg" 
              className="flex-1 py-6 h-auto"
              onClick={() => navigate("/auth?mode=register&role=founder")}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Join as Founder
            </Button>
            
            <Button 
              size="lg" 
              className="flex-1 py-6 h-auto"
              onClick={() => navigate("/auth?mode=register&role=investor")}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Join as Investor
            </Button>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4">
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
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
              </svg>
              <span className="ml-2 text-xl font-bold">StartupMatch</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StartupMatch. All rights reserved.
            </p>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}