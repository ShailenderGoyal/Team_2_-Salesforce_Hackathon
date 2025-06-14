import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, RotateCcw, Calculator, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreditScoreModal from './CreditScoreModal'; // ✅ Import the modal

const ActionPrompts: React.FC = () => {
  const { toast } = useToast();
  const [isCreditScoreModalOpen, setIsCreditScoreModalOpen] = useState(false); // ✅ Modal state
  const [formData, setFormData] = useState<Record<string, any>>({}); // Replace with actual form data if available

  const handleAnalyzeLoanTerms = () => {
    setIsCreditScoreModalOpen(true); // ✅ Open modal
  };

  const handleChangeParameter = () => {
    toast({
      title: "Parameter Change",
      description: "Select any parameter in the table below to modify and see real-time score impact"
    });
  };

  const prompts = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "📈 Analyze Loan Terms",
      action: handleAnalyzeLoanTerms,
      variant: "default" as const
    },
    {
      icon: <RotateCcw className="h-4 w-4" />,
      label: "🔄 Change a Parameter and Check Score",
      action: handleChangeParameter,
      variant: "secondary" as const
    }
  ];

  return (
    <>
      <Card className="p-4 bg-card border-border mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {prompts.map((prompt, index) => (
            <Button
              key={index}
              onClick={prompt.action}
              variant={prompt.variant}
              className="flex items-center gap-2 text-sm"
            >
              {prompt.icon}
              {prompt.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* ✅ Modal inclusion */}
      <CreditScoreModal
        isOpen={isCreditScoreModalOpen}
        onClose={() => setIsCreditScoreModalOpen(false)}
        formData={formData}
      />
    </>
  );
};

export default ActionPrompts;
