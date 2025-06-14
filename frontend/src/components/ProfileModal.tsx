
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageSquare, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import scoreData from '@/data/score_review.json';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScoreBot: () => void;
  onOpenLoanAssistant: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenScoreBot, 
  onOpenLoanAssistant 
}) => {
  const getScoreColor = (score: number) => {
    switch (score) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-400';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const creditAttributes = scoreData.credit_attributes;
  const improvements = creditAttributes.filter(attr => attr.current_score <= 3);
  const strengths = creditAttributes.filter(attr => attr.current_score >= 4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Complete Financial Profile</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Credit Score Attributes */}
          <Card className="p-4 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Credit Score Attributes
            </h3>
            <div className="space-y-3">
              {creditAttributes.map((attr) => (
                <div key={attr.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{attr.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getScoreColor(attr.current_score))} />
                    <span className="text-sm font-medium">{attr.current_score}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Financial Behavior Insights */}
          <Card className="p-4 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Behavior Insights
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-900/30 rounded-lg border border-green-700">
                <div className="font-medium text-green-400 text-sm">Strengths</div>
                {strengths.map((attr) => (
                  <div key={attr.id} className="text-xs text-green-300 mt-1">
                    • {attr.label} performing well
                  </div>
                ))}
              </div>
              
              <div className="p-3 bg-blue-900/30 rounded-lg border border-blue-700">
                <div className="font-medium text-blue-400 text-sm">Spending Pattern</div>
                <div className="text-xs text-blue-300 mt-1">
                  • Housing: 38% of income (Healthy)
                  • Food: 18% of income (Good)
                  • Entertainment: 9% of income (Moderate)
                </div>
              </div>

              <div className="p-3 bg-purple-900/30 rounded-lg border border-purple-700">
                <div className="font-medium text-purple-400 text-sm">Financial Habits</div>
                <div className="text-xs text-purple-300 mt-1">
                  • Regular income flow ✓
                  • Low debt-to-income ratio ✓
                  • Room for investment growth
                </div>
              </div>
            </div>
          </Card>

          {/* What to Improve */}
          <Card className="p-4 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Areas to Improve
            </h3>
            <div className="space-y-3">
              {improvements.map((attr) => (
                <div key={attr.id} className="p-3 bg-orange-900/20 rounded-lg border border-orange-700">
                  <div className="font-medium text-orange-400 text-sm">{attr.label}</div>
                  <div className="text-xs text-orange-300 mt-1">{attr.description}</div>
                  <Badge variant="outline" className="mt-2 text-xs border-orange-500 text-orange-400">
                    Score: {attr.current_score}/5
                  </Badge>
                </div>
              ))}
              
              {improvements.length === 0 && (
                <div className="p-3 bg-green-900/20 rounded-lg border border-green-700 text-center">
                  <div className="text-green-400 text-sm">🎉 Excellent Profile!</div>
                  <div className="text-xs text-green-300 mt-1">All areas are performing well</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Assistant Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={onOpenScoreBot}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Bot className="h-4 w-4 mr-2" />
            ScoreBot Assistant
          </Button>
          <Button
            onClick={onOpenLoanAssistant}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Loan Eligibility Assistant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
