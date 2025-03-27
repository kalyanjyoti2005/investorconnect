import React, { createContext, useState, useContext, useEffect } from 'react';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import { useAuth } from '@/hooks/use-auth';

type OnboardingContextType = {
  showOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STORAGE_KEY = 'startupmatch-onboarding-completed';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  
  // Check if onboarding should be shown when the user logs in
  useEffect(() => {
    if (user) {
      const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
      if (!hasCompletedOnboarding) {
        // Delay showing the onboarding to ensure the dashboard is loaded first
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);
  
  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    setShowOnboarding(false);
  };
  
  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setShowOnboarding(true);
  };
  
  return (
    <OnboardingContext.Provider
      value={{ showOnboarding, completeOnboarding, resetOnboarding }}
    >
      {children}
      {showOnboarding && user && (
        <OnboardingWizard
          onComplete={completeOnboarding}
          userRole={user.role}
        />
      )}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}