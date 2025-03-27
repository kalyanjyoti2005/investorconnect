import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  Rocket, 
  Lightbulb,
  Users,
  TrendingUp,
  Shield,
  CheckCircle
} from 'lucide-react';
import LottieAnimation from '@/components/ui/lottie-animation';
import StartupJourneyStep from './startup-journey-step';

// Import Lottie animations
import startupIdeaAnimation from '@/assets/onboarding/startup-idea.json';
import teamBuildingAnimation from '@/assets/onboarding/team-building.json';
import investorMatchingAnimation from '@/assets/onboarding/investor-matching.json';
import growthAnimation from '@/assets/onboarding/growth.json';
import successAnimation from '@/assets/onboarding/success.json';

interface OnboardingWizardProps {
  onComplete: () => void;
  userRole?: 'founder' | 'investor';
}

const fadeVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to StartupMatch',
    description: "Your journey in the startup ecosystem begins here. Let's explore how we'll help you succeed.",
    animation: startupIdeaAnimation,
    icon: Lightbulb,
    founderContent: "As a founder, you'll connect with investors who believe in your vision.",
    investorContent: "As an investor, you'll discover promising startups aligned with your investment thesis."
  },
  {
    id: 'ecosystem',
    title: 'The Startup Ecosystem',
    description: 'Startups begin with an idea, grow through funding, and scale with the right support.',
    animation: teamBuildingAnimation,
    icon: Users,
    founderContent: 'Build your team, refine your product, and prepare to pitch to investors.',
    investorContent: 'Analyze startup teams, products, and market fit before making investment decisions.'
  },
  {
    id: 'matching',
    title: 'AI-Powered Matching',
    description: 'Our proprietary algorithm connects founders with the perfect investors for their startups.',
    animation: investorMatchingAnimation,
    icon: Shield,
    founderContent: "We'll match you with investors interested in your industry and stage.",
    investorContent: 'Receive recommendations for startups that match your investment criteria.'
  },
  {
    id: 'growth',
    title: 'Secure Growth Journey',
    description: 'Track progress through milestones and ensure secure, transparent investments.',
    animation: growthAnimation,
    icon: TrendingUp,
    founderContent: 'Set and achieve milestones with secured funding released as you progress.',
    investorContent: 'Monitor startup progress and release funds as milestones are achieved.'
  },
  {
    id: 'success',
    title: 'Ready for Success',
    description: "You're all set to begin your journey on StartupMatch!",
    animation: successAnimation,
    icon: CheckCircle,
    founderContent: 'Start creating your startup profile and connecting with investors.',
    investorContent: 'Start exploring startups and making strategic investments.'
  }
];

export default function OnboardingWizard({ onComplete, userRole = 'founder' }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-card w-full max-w-4xl rounded-xl shadow-lg border overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress bar */}
        <div className="w-full bg-muted h-1">
          <motion.div 
            className="bg-primary h-1"
            initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="p-6 md:p-8">
          {/* Step indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <motion.div 
                    className={`w-3 h-3 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                      setDirection(i > currentStep ? 1 : -1);
                      setCurrentStep(i);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-0.5 ${i < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`content-${currentStep}`}
                custom={direction}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col justify-center"
              >
                <Badge className="w-fit mb-4">{`Step ${currentStep + 1} of ${steps.length}`}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h2>
                <p className="text-muted-foreground mb-6">{step.description}</p>
                
                <StartupJourneyStep 
                  step={currentStep} 
                  content={userRole === 'founder' ? step.founderContent : step.investorContent}
                  icon={<step.icon className="h-5 w-5 text-primary" />}
                />
              </motion.div>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`animation-${currentStep}`}
                variants={fadeVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex items-center justify-center h-64 md:h-80"
              >
                <LottieAnimation
                  animationData={step.animation}
                  loop={true}
                  className="w-full h-full max-w-md"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-between items-center">
            <div>
              {!isFirstStep ? (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={handleSkip}
                >
                  Skip tour
                </Button>
              )}
            </div>
            
            <Button 
              onClick={handleNext}
              className="flex items-center"
            >
              {isLastStep ? 'Get Started' : 'Next'}
              {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}