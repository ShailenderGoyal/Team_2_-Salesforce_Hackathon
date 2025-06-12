
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Shield, TrendingUp, AlertCircle } from 'lucide-react';

interface LoanEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, any>;
}

const LoanEligibilityModal: React.FC<LoanEligibilityModalProps> = ({ isOpen, onClose, formData }) => {
  const [eligibility, setEligibility] = useState<any>(null);

  useEffect(() => {
    if (isOpen && formData) {
      // Calculate eligibility based on form data
      const calculateEligibility = () => {
        const score = Math.floor(Math.random() * 400) + 400; // Mock score
        const income = Number(formData.wallet_balance) || 0;
        const assets = (Number(formData.land_holdings) || 0) * 100000 + (Number(formData.gold_value) || 0);
        
        let maxLoanAmount = income * 12; // Basic calculation
        let eligibilityStatus = 'Eligible';
        let riskLevel = 'Low';
        
        if (score < 500) {
          eligibilityStatus = 'Not Eligible';
          riskLevel = 'High';
          maxLoanAmount = 0;
        } else if (score < 600) {
          eligibilityStatus = 'Conditionally Eligible';
          riskLevel = 'Medium';
          maxLoanAmount *= 0.5;
        }

        const mockEligibility = {
          status: eligibilityStatus,
          score: score,
          maxLoanAmount: Math.round(maxLoanAmount),
          riskLevel: riskLevel,
          interestRange: riskLevel === 'Low' ? '8-12%' : riskLevel === 'Medium' ? '12-16%' : '16-20%',
          recommendations: [
            riskLevel === 'Low' ? 'Excellent profile for loans' : 'Improve credit history',
            'Consider collateral-backed loans for better rates',
            'Maintain regular income documentation'
          ],
          eligibleProducts: [
            { name: 'Personal Loan', amount: Math.round(maxLoanAmount * 0.3), rate: '10-14%' },
            { name: 'Business Loan', amount: Math.round(maxLoanAmount * 0.7), rate: '12-16%' },
            { name: 'Agricultural Loan', amount: Math.round(maxLoanAmount * 0.5), rate: '8-12%' }
          ]
        };

        setEligibility(mockEligibility);
      };

      calculateEligibility();
    }
  }, [isOpen, formData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible': return 'bg-green-500';
      case 'Conditionally Eligible': return 'bg-yellow-500';
      case 'Not Eligible': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!eligibility) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Loan Eligibility Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Eligibility Status */}
          <Card className="bg-card/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Eligibility Status</h3>
                  <Badge className={`${getStatusColor(eligibility.status)} text-white mt-2`}>
                    {eligibility.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    ₹{eligibility.maxLoanAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Maximum Loan Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score and Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{eligibility.score}</div>
                <Progress value={(eligibility.score / 800) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Risk Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-xl font-semibold ${getRiskColor(eligibility.riskLevel)} flex items-center gap-2`}>
                  {eligibility.riskLevel === 'High' ? <AlertCircle className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                  {eligibility.riskLevel}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Interest Range</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {eligibility.interestRange}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Products */}
          <Card className="bg-card/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Eligible Loan Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {eligibility.eligibleProducts.map((product: any, index: number) => (
                  <div key={index} className="bg-background/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <div className="text-2xl font-bold text-blue-400 mt-2">
                      ₹{product.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Interest: {product.rate}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-card/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eligibility.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background/30 rounded-lg border border-gray-700">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoanEligibilityModal;
