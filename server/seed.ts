import { db } from './db';
import { startups, users, startupStageEnum } from '@shared/schema';
import { storage } from './storage';

// Type for seed data to ensure proper typing
type SeedStartup = {
  name: string;
  description: string;
  industry: string;
  stage: "idea" | "pre_seed" | "seed" | "series_a" | "series_b" | "series_c" | "growth";
  logo: string;
  fundingGoal: number;
  currentFunding: number;
  founderId: number;
  businessPlan: string;
  pitchDeck: string;
  website: string;
  trendingScore: number;
};

// This function seeds the database with demo data for testing and development
export const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");
    
    // Check if any startups exist
    const existingStartups = await storage.getAllStartups();
    
    if (existingStartups.length > 0) {
      console.log(`Database already has ${existingStartups.length} startups. Skipping seed.`);
      return;
    }
    
    // Demo startup data
    const demoStartups: SeedStartup[] = [
      {
        name: "EcoCharge",
        description: "Revolutionary fast-charging battery technology for electric vehicles that reduces charging time by 70% while extending battery life.",
        industry: "Clean Energy",
        stage: "seed" as "seed",
        logo: "https://placehold.co/400x400/4ADE80/1E293B?text=EC&font=open-sans",
        fundingGoal: 2500000,
        currentFunding: 1200000,
        founderId: 5, // Use the logged-in user id
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://ecocharge-tech.com",
        trendingScore: 92
      },
      {
        name: "MediTrack",
        description: "AI-powered health monitoring platform that integrates with wearable devices to predict potential health issues before they become serious.",
        industry: "Health Tech",
        stage: "series_a" as "series_a",
        logo: "https://placehold.co/400x400/60A5FA/1E293B?text=MT&font=open-sans",
        fundingGoal: 5000000,
        currentFunding: 3200000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://meditrack.health",
        trendingScore: 88
      },
      {
        name: "FinSecure",
        description: "Blockchain-based security solution for financial institutions, providing real-time fraud detection and prevention with 99.9% accuracy.",
        industry: "Fintech",
        stage: "pre_seed" as "pre_seed",
        logo: "https://placehold.co/400x400/F97316/1E293B?text=FS&font=open-sans",
        fundingGoal: 1000000,
        currentFunding: 350000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://finsecure.io",
        trendingScore: 75
      },
      {
        name: "RetailAI",
        description: "Smart retail analytics platform that uses computer vision to optimize store layouts, inventory management, and personalized shopping experiences.",
        industry: "AI & ML",
        stage: "seed" as "seed",
        logo: "https://placehold.co/400x400/A78BFA/1E293B?text=RA&font=open-sans",
        fundingGoal: 2000000,
        currentFunding: 800000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://retailai.tech",
        trendingScore: 82
      },
      {
        name: "SecureNet",
        description: "Advanced cybersecurity platform that uses behavioral analysis and AI to detect and prevent zero-day exploits before they can cause damage.",
        industry: "Cybersecurity",
        stage: "series_a" as "series_a",
        logo: "https://placehold.co/400x400/F43F5E/1E293B?text=SN&font=open-sans",
        fundingGoal: 4500000,
        currentFunding: 2800000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://securenet.io",
        trendingScore: 90
      },
      {
        name: "EduMentor",
        description: "Personalized learning platform that adapts to individual student needs, using AI to identify knowledge gaps and customize curriculum.",
        industry: "Edtech",
        stage: "seed" as "seed",
        logo: "https://placehold.co/400x400/22D3EE/1E293B?text=EM&font=open-sans",
        fundingGoal: 1800000,
        currentFunding: 950000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://edumentor.edu",
        trendingScore: 79
      },
      {
        name: "GreenHarvest",
        description: "Vertical farming technology that reduces water usage by 95% while increasing crop yields by 300%, designed for urban environments.",
        industry: "Clean Energy",
        stage: "series_b" as "series_b",
        logo: "https://placehold.co/400x400/34D399/1E293B?text=GH&font=open-sans",
        fundingGoal: 8000000,
        currentFunding: 6500000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://greenharvest.farm",
        trendingScore: 94
      },
      {
        name: "ShopDrop",
        description: "On-demand retail platform that connects local stores with customers for same-day delivery of products, supporting small businesses.",
        industry: "E-commerce",
        stage: "growth" as "growth",
        logo: "https://placehold.co/400x400/FB7185/1E293B?text=SD&font=open-sans",
        fundingGoal: 3000000,
        currentFunding: 3000000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://shopdrop.com",
        trendingScore: 86
      },
      {
        name: "NeurAI",
        description: "Cutting-edge neural interface technology that enables direct brain-computer interactions for medical applications and accessibility solutions.",
        industry: "AI & ML",
        stage: "idea" as "idea",
        logo: "https://placehold.co/400x400/818CF8/1E293B?text=NA&font=open-sans",
        fundingGoal: 500000,
        currentFunding: 50000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://neurai.tech",
        trendingScore: 68
      },
      {
        name: "CryptoTrade",
        description: "Institutional-grade cryptocurrency trading platform with advanced security features and algorithmic trading capabilities.",
        industry: "Fintech",
        stage: "seed" as "seed",
        logo: "https://placehold.co/400x400/FACC15/1E293B?text=CT&font=open-sans",
        fundingGoal: 2200000,
        currentFunding: 900000,
        founderId: 5,
        businessPlan: "https://example.com/business-plan.pdf",
        pitchDeck: "https://example.com/pitch-deck.pdf",
        website: "https://cryptotrade.io",
        trendingScore: 81
      }
    ];
    
    // Insert each startup
    for (const startupData of demoStartups) {
      await storage.createStartup(startupData);
    }
    
    console.log(`Successfully seeded ${demoStartups.length} startups`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};