
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import CreditScoreModal from './CreditScoreModal';
import LoanEligibilityModal from './LoanEligibilityModal';
import fieldTypesData from '@/data/field_types.json';

interface OnboardingFormProps {
  onComplete: (data: Record<string, any>) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isListening, setIsListening] = useState(false);
  const [isCreditScoreModalOpen, setIsCreditScoreModalOpen] = useState(false);
  const [isLoanEligibilityModalOpen, setIsLoanEligibilityModalOpen] = useState(false);
  const { toast } = useToast();
  
  const steps = fieldTypesData.onboarding_steps;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentStepData = steps[currentStep];

  const toggleVoiceInput = (fieldId: string) => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        const field = currentStepData.fields.find(f => f.id === fieldId);
        let mockValue;
        
        if (field?.type === 'numerical') {
          const mockValues: Record<string, string> = {
            'age': '28',
            'dependents': '2',
            'residential_stability': '8',
            'wallet_balance': '15000',
            'land_holdings': '2',
            'gold_value': '50000',
            'two_wheelers': '1',
            'four_wheelers': '0',
            'upi_frequency': '25',
            'app_usage': '10',
            'livestock': '5',
            'subsidy_regularity': '4',
            'call_frequency': '15',
            'call_duration': '5',
            'shg_repayment': '4',
            'peer_default': '2',
            'formal_loans': '1',
            'informal_loans': '0',
            'network_centrality': '7'
          };
          mockValue = mockValues[fieldId] || '5';
        } else {
          mockValue = field?.options?.[0] || 'Yes';
        }
        
        setFormData(prev => ({ ...prev, [fieldId]: mockValue }));
        setIsListening(false);
        toast({
          title: "Voice input captured",
          description: `${field?.label} updated via voice`
        });
      }, 2000);
    }
  };

  const generateAISuggestion = (fieldId: string) => {
    const suggestions: Record<string, string> = {
      'age': '28 (Based on voice analysis)',
      'dependents': '2 (Average family size)',
      'residential_stability': '8 (Good stability)',
      'wallet_balance': '₹15,000 (Recommended minimum)',
      'health_insurance': 'Yes (Highly recommended)',
      'upi_frequency': '25 transactions/month (Good digital adoption)',
      'call_frequency': '15 calls/week (Normal usage)',
      'shg_repayment': '4 (Good consistency)',
      'network_centrality': '7 (Strong network)'
    };
    
    const suggestion = suggestions[fieldId];
    if (suggestion) {
      toast({
        title: "AI Suggestion",
        description: suggestion,
      });
    }
  };

  const handleNext = () => {
    const requiredFields = currentStepData.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.id]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderField = (field: any) => {
    const commonProps = {
      value: formData[field.id] || '',
      onChange: (value: string) => setFormData(prev => ({ ...prev, [field.id]: value })),
      className: "bg-background border-input text-foreground placeholder-muted-foreground text-lg py-3"
    };

    if (field.type === 'numerical') {
      return (
        <div className="relative">
          <Input
            type="number"
            placeholder={field.placeholder}
            value={commonProps.value}
            onChange={(e) => commonProps.onChange(e.target.value)}
            className={cn(commonProps.className, "pr-20")}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              onClick={() => generateAISuggestion(field.id)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => toggleVoiceInput(field.id)}
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isListening && "text-red-400 animate-pulse"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative">
          <Select
            value={commonProps.value}
            onValueChange={commonProps.onChange}
          >
            <SelectTrigger className={cn(commonProps.className, "pr-20")}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option} className="text-foreground focus:bg-accent focus:text-accent-foreground">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              onClick={() => generateAISuggestion(field.id)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => toggleVoiceInput(field.id)}
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isListening && "text-red-400 animate-pulse"
              )}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8 bg-card/80 backdrop-blur-sm border-border shadow-2xl animate-fade-in">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Setup Your Profile</h2>
            <span className="text-muted-foreground text-sm">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          
          <div className="relative mb-4">
            <Progress value={progress} className="h-3" />
          </div>
          
          {/* Step Navigation */}
          <div className="flex justify-between text-xs">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 transition-all duration-300",
                    index <= currentStep 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <span className="text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-2">{currentStepData.title}</h3>
            <p className="text-muted-foreground">Please provide the following information</p>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentStepData.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <p className="text-xs text-muted-foreground italic">"{field.voice_prompt}"</p>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Special Actions for Credit History Step */}
          {currentStepData.id === 'credit_history' && (
            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={() => setIsCreditScoreModalOpen(true)}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                Analyze Credit Score
              </Button>
              <Button
                onClick={() => setIsLoanEligibilityModalOpen(true)}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/10"
              >
                Check Loan Eligibility
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="flex-1 border-border text-muted-foreground hover:bg-accent disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:scale-105"
            >
              {currentStep === totalSteps - 1 ? 'Complete Setup' : 'Next'}
              {currentStep !== totalSteps - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Modals */}
        <CreditScoreModal
          isOpen={isCreditScoreModalOpen}
          onClose={() => setIsCreditScoreModalOpen(false)}
          formData={formData}
        />
        
        <LoanEligibilityModal
          isOpen={isLoanEligibilityModalOpen}
          onClose={() => setIsLoanEligibilityModalOpen(false)}
          formData={formData}
        />
      </Card>
    </div>
  );
};

export default OnboardingForm;
