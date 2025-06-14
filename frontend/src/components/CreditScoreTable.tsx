import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CreditScoreTable: React.FC = () => {
  const [analysisData] = useState({
    analysis: [
      {
        parameter_name: "cdr_call_frequency",
        current_situation: 4,
        remark: "Good performance, minor optimizations needed. Continue maintaining regular, positive call patterns and ensure consistent communication habits."
      },
      {
        parameter_name: "cdr_call_duration",
        current_situation: 3,
        remark: "Fair performance, focused improvement required. Aim to optimize call durations to reflect stable and trustworthy social interactions."
      },
      {
        parameter_name: "network_centrality",
        current_situation: 1,
        remark: "Critical area, immediate action required. Proactively expand your social and professional network to strengthen your credit profile."
      },
      {
        parameter_name: "upi_transaction_frequency",
        current_situation: 5,
        remark: "Excellent performance, maintain and leverage this strength. Keep up the regular use of UPI for transactions to further enhance your financial credibility."
      },
      {
        parameter_name: "avg_mobile_wallet_balance",
        current_situation: 4,
        remark: "Good performance, minor optimizations needed. Continue managing your wallet balance responsibly and try to maintain or slightly increase average balances."
      },
      {
        parameter_name: "bill_payment_timeliness",
        current_situation: 5,
        remark: "Excellent performance, maintain and leverage this strength. Consistently timely bill payments are highly favorable—keep up this excellent habit."
      },
      {
        parameter_name: "residential_stability",
        current_situation: 3,
        remark: "Fair performance, focused improvement required. Consider increasing your residential stability, as longer stays at a single address can positively impact your credit profile."
      },
      {
        parameter_name: "health_insurance",
        current_situation: 2,
        remark: "Needs attention, significant improvement needed. Explore options to increase your health insurance coverage for better financial security and creditworthiness."
      },
      {
        parameter_name: "age_years",
        current_situation: 4,
        remark: "Good performance, minor optimizations needed. Your age is favorable for lending; continue building stable financial habits to maximize your profile."
      },
      {
        parameter_name: "num_dependents",
        current_situation: 3,
        remark: "Fair performance, focused improvement required. Manage your finances carefully to ensure dependents do not strain your resources."
      },
      {
        parameter_name: "land_holdings_acres",
        current_situation: 5,
        remark: "Excellent performance, maintain and leverage this strength. Land ownership is a strong asset—use it to further strengthen your financial standing."
      }
    ],
    action_summary: "- Expand your social and professional network to improve network centrality.\n- Optimize call durations to reflect stable, trustworthy interactions.\n- Increase residential stability by minimizing address changes.\n- Enhance your health insurance coverage for better financial security.\n- Carefully manage finances to ensure dependents do not strain your resources.\n- Maintain strong habits in UPI transactions, bill payments, land holdings, and mobile wallet balance.\n- Continue cultivating positive communication patterns and stable financial practices."
  });

  const [attributes] = useState(analysisData.analysis);

  const getScoreColor = (score: number) => {
    switch (score) {
      case 1: return 'text-[#FF4D4F] bg-[#FF4D4F]/10 border-[#FF4D4F]/30';
      case 2: return 'text-[#FA8C16] bg-[#FA8C16]/10 border-[#FA8C16]/30';
      case 3: return 'text-[#FADB14] bg-[#FADB14]/10 border-[#FADB14]/30';
      case 4: return 'text-[#A0D911] bg-[#A0D911]/10 border-[#A0D911]/30';
      case 5: return 'text-[#52C41A] bg-[#52C41A]/10 border-[#52C41A]/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1: return 'Critical';
      case 2: return 'Needs Attention';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Unknown';
    }
  };

  const formatParameterName = (paramName: string) => {
    return paramName.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const calculateOverallScore = () => {
    const totalScore = attributes.reduce((sum, attr) => sum + attr.current_situation, 0);
    const maxScore = attributes.length * 5;
    return Math.round((totalScore / maxScore) * 100);
  };

  const overallScore = calculateOverallScore();

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Credit Score Analysis</h2>

        {/* Speedometer */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted-foreground opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={
                  overallScore >= 80 ? '#52C41A' :
                  overallScore >= 60 ? '#A0D911' :
                  overallScore >= 40 ? '#FADB14' :
                  overallScore >= 20 ? '#FA8C16' : '#FF4D4F'
                }
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${overallScore * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{overallScore}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Credit Score</div>
        </div>
      </div>

      <div className="space-y-4">
        {attributes.map((attr) => (
          <div
            key={attr.parameter_name}
            className={cn(
              "p-4 rounded-lg border transition-colors",
              getScoreColor(attr.current_situation)
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {formatParameterName(attr.parameter_name)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{attr.remark}</p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium border",
                  getScoreColor(attr.current_situation)
                )}>
                  {attr.current_situation}/5 • {getScoreLabel(attr.current_situation)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Action Summary</h3>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {analysisData.action_summary}
            </div>
          </div>
          <div className={cn(
            "text-2xl font-bold px-4 py-2 rounded-lg border",
            getScoreColor(Math.round(overallScore / 20))
          )}>
            {overallScore}/100
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreditScoreTable;
