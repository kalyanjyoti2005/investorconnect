import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { FiArrowRight, FiCheck, FiLock, FiDollarSign, FiUsers, FiBriefcase, FiDatabase, FiShield } from "react-icons/fi";
import { SiBlockchaindotcom } from "react-icons/si";

import LottieAnimation from "@/components/ui/lottie-animation";
import handshakeAnimation from "@/assets/animations/handshake.json";
import aiAnalysisAnimation from "@/assets/animations/ai-analysis.json";
import blockchainAnimation from "@/assets/animations/blockchain.json";
import escrowAnimation from "@/assets/animations/escrow.json";
import communityAnimation from "@/assets/animations/community.json";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation variants
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut" 
    }
  }
};

const staggerChildrenVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseVariants: Variants = {
  idle: { scale: 1 },
  pulse: { 
    scale: 1.05, 
    boxShadow: "0px 0px 15px rgba(74, 222, 128, 0.6)",
    transition: { 
      duration: 0.3, 
      yoyo: Infinity,
      ease: "easeInOut" 
    } 
  }
};

const HeroSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Particle animation setup
  const particleContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!particleContainerRef.current) return;
    
    const container = particleContainerRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = 30;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full bg-primary/20';
      const size = Math.random() * 10 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = `${Math.random() * 0.5 + 0.2}`;
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    particles.forEach(particle => {
      gsap.to(particle, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: 'random(3, 8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 pt-20">
      {/* Particles background */}
      <div ref={particleContainerRef} className="absolute inset-0 z-0" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <motion.div 
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={staggerChildrenVariants}
            className="flex-1 space-y-6"
          >
            <motion.h1 
              variants={fadeInUpVariants} 
              className="text-4xl md:text-6xl font-bold text-foreground"
            >
              Connecting <span className="text-primary">Startups</span> & <span className="text-primary">Investors</span> Securely
            </motion.h1>
            
            <motion.p 
              variants={fadeInUpVariants}
              className="text-xl text-muted-foreground" 
            >
              Find the right investor. Discover high-potential startups. Invest with trust.
            </motion.p>
            
            <motion.div 
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                initial="idle"
                whileHover="pulse"
                variants={pulseVariants}
              >
                <Button size="lg" className="bg-primary font-medium text-primary-foreground w-full sm:w-auto">
                  Join as a Startup <FiArrowRight className="ml-2" />
                </Button>
              </motion.div>
              
              <motion.div
                initial="idle"
                whileHover="pulse"
                variants={pulseVariants}
              >
                <Button size="lg" variant="outline" className="font-medium w-full sm:w-auto">
                  Join as an Investor <FiArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex-1 max-w-md"
          >
            <LottieAnimation animationData={handshakeAnimation} />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-primary flex justify-center items-start p-1">
            <motion.div 
              className="w-1.5 h-3 bg-primary rounded-full"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { 
      title: "Sign up & verify identity", 
      description: "Create your profile and complete verification to ensure trust and security on the platform.",
      icon: <FiUsers className="w-6 h-6" />
    },
    { 
      title: "Browse startups or investors", 
      description: "Discover opportunities that align with your interests, industry preferences, and investment criteria.",
      icon: <FiBriefcase className="w-6 h-6" /> 
    },
    { 
      title: "Sign NDA for full details", 
      description: "Access comprehensive information by signing secure, legally binding non-disclosure agreements.",
      icon: <FiLock className="w-6 h-6" /> 
    },
    { 
      title: "Securely invest using escrow", 
      description: "Make milestone-based investments with funds held in secure escrow until conditions are met.",
      icon: <FiDollarSign className="w-6 h-6" /> 
    }
  ];

  // Refs for GSAP animations
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!sectionRef.current || stepsRef.current.length === 0 || !lineRef.current) return;

    // Timeline for steps animation
    const stepTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      }
    });

    // Animate each step
    stepsRef.current.forEach((step, index) => {
      stepTimeline.from(step, {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.5,
        ease: "power2.out",
      }, index * 0.2);
    });

    // Animate the connecting line
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength();
      
      gsap.set(lineRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
      
      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "center center",
          scrub: 0.5,
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-background to-background/95">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            Our streamlined process makes connecting startups and investors simpler, more secure, and more effective.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <svg 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-full" 
            style={{ zIndex: 0 }}
          >
            <path
              ref={lineRef}
              d="M50,20 Q50,50 50,100 Q50,150 50,200 Q50,250 50,300 Q50,350 50,400"
              className="stroke-primary"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Steps */}
          <div className="relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={el => el && (stepsRef.current[index] = el)}
                className={`flex items-center gap-6 mb-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className={`bg-card shadow-lg rounded-xl p-6 border border-border 
                    ${index % 2 === 1 ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <span className="inline-block w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center z-10">
                  <div className="text-primary">
                    {step.icon}
                  </div>
                </div>
                
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const KeyFeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered SWOT Analysis",
      description: "Get detailed insights about startups with AI-generated SWOT analyses based on comprehensive data points.",
      icon: <LottieAnimation animationData={aiAnalysisAnimation} />,
      stat: "87%",
      statText: "of investors make more informed decisions"
    },
    {
      title: "Blockchain-Backed NDA Protection",
      description: "Your sensitive data stays protected with our immutable blockchain-secured NDA system.",
      icon: <LottieAnimation animationData={blockchainAnimation} />,
      stat: "100%",
      statText: "secure data protection"
    },
    {
      title: "Milestone-Based Escrow Funding",
      description: "Protect investments with our milestone-based escrow system that releases funds as startups achieve verified goals.",
      icon: <LottieAnimation animationData={escrowAnimation} />,
      stat: "$14M+",
      statText: "safely invested through our platform"
    },
    {
      title: "Live Investor-Startup Community",
      description: "Connect with a vibrant community of entrepreneurs and investors to share insights and opportunities.",
      icon: <LottieAnimation animationData={communityAnimation} />,
      stat: "5,000+",
      statText: "active members in our community"
    }
  ];

  const featureVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Key Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            Our platform offers unique tools and features designed specifically for the startup-investor ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              variants={featureVariants}
              className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 h-24 flex items-center">
                  <div className="w-20 h-20">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold ml-4">{feature.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 flex-grow">{feature.description}</p>
                
                <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                  <div className="text-2xl font-bold text-primary mr-3">{feature.stat}</div>
                  <div className="text-sm text-primary/80">{feature.statText}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "StartupMatch helped me secure my first $100K in funding within just two months of joining the platform.",
      name: "Sarah Chen",
      role: "Founder, TechNova",
      image: ""
    },
    {
      quote: "I discovered an incredible AI startup before their public launch. The platform's NDA system gave me exclusive early access.",
      name: "Michael Rodriguez",
      role: "Angel Investor",
      image: ""
    },
    {
      quote: "The milestone-based funding system gives me peace of mind as an investor. I can track real progress before releasing funds.",
      name: "Jennifer Kim",
      role: "VC Partner, FutureFund",
      image: ""
    },
    {
      quote: "StartupMatch's AI analysis helped us refine our pitch and connect with investors who truly understand our vision.",
      name: "David Martinez",
      role: "Co-founder, EcoSolutions",
      image: ""
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Pause auto-scrolling on hover
  const pauseAutoScroll = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.style.animationPlayState = 'paused';
    }
  };

  const resumeAutoScroll = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            Hear from entrepreneurs and investors who have found success on our platform.
          </motion.p>
        </div>

        <div 
          className="relative max-w-4xl mx-auto overflow-hidden" 
          ref={testimonialsRef}
          onMouseEnter={pauseAutoScroll}
          onMouseLeave={resumeAutoScroll}
        >
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-8 shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-24 h-24 md:w-32 md:h-32 relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse" />
                    {testimonials[currentIndex].image ? (
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover rounded-full border-4 border-primary" 
                      />
                    ) : (
                      <div className="w-full h-full rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl text-primary">
                          {testimonials[currentIndex].name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-4xl text-primary/30 mb-2">"</div>
                    <p className="text-lg mb-4 italic">
                      {testimonials[currentIndex].quote}
                    </p>
                    <div>
                      <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex ? 'bg-primary w-6' : 'bg-primary/30'
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LivePreviewSection = () => {
  // Simulated data for startups and investors
  const startups = [
    {
      name: "EcoTech Solutions",
      industry: "Cleantech",
      funding: "$500K",
      stage: "Seed",
      logo: "🌱"
    },
    {
      name: "HealthAI",
      industry: "Healthcare",
      funding: "$1.2M",
      stage: "Series A",
      logo: "🏥"
    },
    {
      name: "FinanceFlow",
      industry: "Fintech",
      funding: "$300K",
      stage: "Pre-seed",
      logo: "💰"
    }
  ];

  const investors = [
    {
      name: "Tech Ventures",
      focus: "SaaS, AI",
      investments: 12,
      range: "$100K - $500K",
      logo: "🚀"
    },
    {
      name: "Green Capital",
      focus: "Sustainability",
      investments: 8,
      range: "$250K - $1M",
      logo: "🌍"
    },
    {
      name: "Health Innovations Fund",
      focus: "Biotech, Health",
      investments: 15,
      range: "$500K - $2M",
      logo: "💊"
    }
  ];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut" 
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    flip: {
      rotateY: 180,
      transition: { duration: 0.6 }
    }
  };

  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});

  const flipCard = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Live Platform Activity
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            See what's happening right now on StartupMatch.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Latest Startups
              <div className="inline-block ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full animate-pulse">
                Live Updates
              </div>
            </h3>
            
            <div className="space-y-4">
              {startups.map((startup, i) => (
                <motion.div
                  key={`startup-${i}`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  variants={cardVariants}
                  viewport={{ once: true, amount: 0.3 }}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm cursor-pointer relative"
                  style={{ perspective: '1000px' }}
                  onClick={() => flipCard(`startup-${i}`)}
                >
                  <motion.div
                    animate={flippedCards[`startup-${i}`] ? "flip" : ""}
                    variants={cardVariants}
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      transform: flippedCards[`startup-${i}`] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {!flippedCards[`startup-${i}`] ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{startup.logo}</div>
                          <div>
                            <h4 className="font-semibold">{startup.name}</h4>
                            <p className="text-sm text-muted-foreground">{startup.industry}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-primary">{startup.funding}</div>
                          <div className="text-xs bg-primary/10 rounded px-2 py-1">{startup.stage}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="transform rotate-y-180">
                        <h4 className="font-semibold mb-2">{startup.name} Details</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Traction:</span>
                            <span>Growing 20% MoM</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Team:</span>
                            <span>5 members</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>San Francisco, CA</span>
                          </li>
                          <li className="mt-3 text-center">
                            <span className="text-xs text-primary">Sign NDA to view complete details</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                  <div className="absolute bottom-1 right-1">
                    <div className="text-xs text-muted-foreground">Updated 2h ago</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6">
              Active Investors
              <div className="inline-block ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full animate-pulse">
                Live Updates
              </div>
            </h3>
            
            <div className="space-y-4">
              {investors.map((investor, i) => (
                <motion.div
                  key={`investor-${i}`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  variants={cardVariants}
                  viewport={{ once: true, amount: 0.3 }}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm cursor-pointer relative"
                  style={{ perspective: '1000px' }}
                  onClick={() => flipCard(`investor-${i}`)}
                >
                  <motion.div
                    animate={flippedCards[`investor-${i}`] ? "flip" : ""}
                    variants={cardVariants}
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d',
                      transform: flippedCards[`investor-${i}`] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {!flippedCards[`investor-${i}`] ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">{investor.logo}</div>
                          <div>
                            <h4 className="font-semibold">{investor.name}</h4>
                            <p className="text-sm text-muted-foreground">{investor.focus}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-primary">{investor.investments} deals</div>
                          <div className="text-xs">{investor.range}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="transform rotate-y-180">
                        <h4 className="font-semibold mb-2">{investor.name} Profile</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Preferred Stages:</span>
                            <span>Seed, Series A</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Recent Activity:</span>
                            <span>3 investments this month</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-muted-foreground">Response Rate:</span>
                            <span>92%</span>
                          </li>
                          <li className="mt-3 text-center">
                            <span className="text-xs text-primary">Connect to view portfolio</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                  <div className="absolute bottom-1 right-1">
                    <div className="text-xs text-muted-foreground">Active now</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">Join now to see the full platform activity</p>
          <Button>
            View All Opportunities <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

const CallToActionSection = () => {
  const [, navigate] = useLocation();
  
  return (
    <section className="py-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="absolute h-full w-full opacity-30">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl p-8 md:p-16 shadow-xl max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Build the Future?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs and investors already connecting on StartupMatch and transform how you build relationships in the startup ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                initial="idle"
                whileHover="pulse"
                variants={pulseVariants}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full sm:w-auto"
                  onClick={() => navigate("/auth")}
                >
                  Create Startup Profile <FiArrowRight className="ml-2" />
                </Button>
              </motion.div>
              
              <motion.div
                initial="idle"
                whileHover="pulse"
                variants={pulseVariants}
                className="w-full sm:w-auto"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate("/auth")}
                >
                  Start Investing <FiArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="border border-border rounded-lg p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <FiShield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Transactions</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security for all financial transactions with encrypted data storage
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <SiBlockchaindotcom className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Contracts</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain-powered smart contracts for transparent milestone verification
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <FiDatabase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered analytics to help you make informed investment decisions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function LandingPageAnimated() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-primary">
                StartupMatch
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-4">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="hidden md:inline-flex"
              >
                Log In
              </Button>
              <Button onClick={() => navigate("/auth")}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <HowItWorksSection />
        <KeyFeaturesSection />
        <TestimonialsSection />
        <LivePreviewSection />
        <CallToActionSection />
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">StartupMatch</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting innovative startups with strategic investors in a secure and transparent ecosystem.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides & Tutorials</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Press Kit</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Legal</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest updates and features.
              </p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="bg-background/50 border border-border rounded-l-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} StartupMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}