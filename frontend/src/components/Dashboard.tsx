
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User, Sparkles } from 'lucide-react';
import CreditScoreTable from './CreditScoreTable';
import FinancialChart from './FinancialChart';
import ProfileModal from './ProfileModal';
import GovernmentSchemes from './GovernmentSchemes';
import ActionSummary from './ActionSummary';
import VoiceAssistant from './VoiceAssistant';
import ActionPrompts from './ActionPrompts';
import ThemeToggle from './ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenScoreBot = () => {
    setIsProfileModalOpen(false);
    setIsVoiceAssistantOpen(true);
    toast({
      title: "ScoreBot activated",
      description: "Your personal credit score assistant is ready to help"
    });
  };

  const handleOpenLoanAssistant = () => {
    setIsProfileModalOpen(false);
    setIsVoiceAssistantOpen(true);
    toast({
      title: "Loan Assistant activated",
      description: "Get personalized loan recommendations and tips"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Financial Dashboard</h1>
            <p className="text-muted-foreground">Your complete financial health overview</p>
          </div>
          <div className="flex gap-3">
            <ThemeToggle />
            <Button
              onClick={() => setIsProfileModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <User className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
            <Button
              onClick={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)}
              variant="outline"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* Action Prompts */}
        <ActionPrompts />

        {/* Credit Score Table */}
        <CreditScoreTable />

        {/* Financial Chart */}
        <FinancialChart />

        {/* Government Schemes */}
        <GovernmentSchemes />

        {/* Action Summary */}
        <ActionSummary />

        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenScoreBot={handleOpenScoreBot}
          onOpenLoanAssistant={handleOpenLoanAssistant}
        />

        {/* Voice Assistant */}
        <VoiceAssistant
          isOpen={isVoiceAssistantOpen}
          onToggle={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
