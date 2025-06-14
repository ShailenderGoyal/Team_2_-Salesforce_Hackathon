
import React, { useState } from 'react';
import ContactSignup from '@/components/ContactSignup';
import OnboardingForm from '@/components/OnboardingForm';
import Dashboard from '@/components/Dashboard';

type AppState = 'signup' | 'onboarding' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('signup');
  const [userData, setUserData] = useState<Record<string, any>>({});

  const handleSignupComplete = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = (data: Record<string, any>) => {
    setUserData(data);
    setAppState('dashboard');
  };

  switch (appState) {
    case 'signup':
      return <ContactSignup onSignupComplete={handleSignupComplete} />;
    case 'onboarding':
      return <OnboardingForm onComplete={handleOnboardingComplete} />;
    case 'dashboard':
      return <Dashboard />;
    default:
      return <ContactSignup onSignupComplete={handleSignupComplete} />;
  }
};

export default Index;
