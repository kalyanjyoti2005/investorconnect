import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Shield, Users, TrendingUp, Brain, Rocket, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";

// Import Lottie animations
import startupInvestorAnimation from "@/assets/startup-investor-animation.json";
import handshakeAnimation from "@/assets/handshake-animation.json";
import secureFundingAnimation from "@/assets/secure-funding-animation.json";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

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
            <motion.div 
              className="text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.6,
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              <motion.div variants={fadeIn}>
                <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  Startup-Investor Matchmaking Platform
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                variants={fadeIn}
              >
                Where Vision Meets Investment <span className="inline-block animate-bounce">🚀</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
                variants={fadeIn}
              >
                Secure, AI-powered matchmaking for startups & investors with milestone-based funding and blockchain protection.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={fadeIn}
              >
                <Button 
                  size="lg" 
                  className="relative overflow-hidden group"
                  onClick={() => navigate("/auth?mode=register")}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started 
                    <svg 
                      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 hover:border-primary/50 transition-colors"
                  onClick={() => navigate("/auth?mode=register&role=investor")}
                >
                  Join as Investor
                </Button>
              </motion.div>
              
              <motion.div 
                className="hidden lg:flex items-center gap-2 mt-8 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Free to get started</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative mx-auto max-w-md"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="bg-card border shadow-lg rounded-lg p-6 relative">
                <div className="flex items-center justify-between mb-4">
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
                
                <div className="h-32 w-full mb-4 overflow-hidden rounded-lg">
                  <LottieAnimation 
                    animationData={startupInvestorAnimation} 
                    loop={true}
                    height="100%"
                    width="100%"
                    className="transform scale-110"
                  />
                </div>
                
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
                  <motion.div 
                    className="w-full bg-muted-foreground/20 rounded-full h-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
                <Button className="w-full">View Details</Button>
              </div>
              
              <motion.div 
                className="absolute -right-4 -bottom-4 w-24 h-24 bg-card border rounded-lg shadow-lg p-3 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Shield className="text-primary mb-1 h-6 w-6" />
                <div className="text-center">
                  <p className="text-xs font-semibold">NDA Protected</p>
                  <p className="text-[10px] text-muted-foreground">Blockchain Secured</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Users, label: "500+ Startups", sublabel: "Registered" },
              { icon: Brain, label: "AI Matching", sublabel: "Technology" },
              { icon: TrendingUp, label: "$50M+", sublabel: "Total Investments" },
              { icon: Shield, label: "100%", sublabel: "Secure Escrow" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center p-4 rounded-xl hover:bg-card transition-colors"
                variants={fadeIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <stat.icon className="h-12 w-12 text-primary mb-4" />
                <motion.h3 
                  className="text-2xl font-bold mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      type: "spring",
                      stiffness: 100,
                      delay: 0.1 + (i * 0.1)
                    }
                  }}
                  viewport={{ once: true }}
                >
                  {stat.label}
                </motion.h3>
                <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4">Why Choose StartupMatch?</Badge>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              The Problems We Solve
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Traditional startup funding is broken. We're fixing it with technology, security, and transparency.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-card rounded-xl border p-6 hover:shadow-md transition-all hover:border-primary/50 hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="h-32 mb-4">
                <LottieAnimation 
                  animationData={startupInvestorAnimation} 
                  loop={true}
                  className="h-full"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Connect with the perfect investors or startups based on your specific criteria and compatibility.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl border p-6 hover:shadow-md transition-all hover:border-primary/50 hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="h-32 mb-4">
                <LottieAnimation 
                  animationData={secureFundingAnimation} 
                  loop={true}
                  className="h-full"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Funding</h3>
              <p className="text-muted-foreground">
                Milestone-based escrow ensures both founders and investors are protected throughout the funding process.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-xl border p-6 hover:shadow-md transition-all hover:border-primary/50 hover:-translate-y-1"
              variants={fadeIn}
            >
              <div className="h-32 mb-4 flex items-center justify-center">
                <TrendingUp className="h-20 w-20 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Growth Tracking</h3>
              <p className="text-muted-foreground">
                Monitor startup progress with transparent metrics and milestone achievements.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute right-0 bottom-0 w-3/4 h-3/4">
            <div className="absolute right-0 top-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl transform -translate-y-1/2"></div>
            <div className="absolute right-40 bottom-20 w-60 h-60 rounded-full bg-primary/5 blur-2xl"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto max-w-xs">
                <LottieAnimation 
                  animationData={handshakeAnimation}
                  loop={true}
                  className="w-full h-64"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center lg:text-left lg:order-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                Ready to Get Started?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join the Future of Startup Investment
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Sign up now to get exclusive early access to our platform and connect with founders or investors.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto py-6 px-8 h-auto relative overflow-hidden group"
                    onClick={() => navigate("/auth?mode=register&role=founder")}
                  >
                    <span className="relative z-10 flex items-center">
                      <Rocket className="mr-2 h-5 w-5" />
                      Join as Founder
                    </span>
                    <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto py-6 px-8 h-auto border-2"
                    onClick={() => navigate("/auth?mode=register&role=investor")}
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Join as Investor
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "Secure Transactions",
                  "Verified Users",
                  "24/7 Support"
                ].map((item, i) => (
                  <motion.div
                    key={i} 
                    className="flex items-center"
                    variants={fadeIn}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <motion.footer 
        className="bg-muted py-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-8 8c0-2.66 5.33-4 8-4s8 1.34 8 4v2H8v-2z" />
                </svg>
                <span className="ml-2 text-xl font-bold">StartupMatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting visionary founders with strategic investors through AI-powered matchmaking.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    For Founders
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    For Investors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Funding 101
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} StartupMatch. All rights reserved.
            </p>
            
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}