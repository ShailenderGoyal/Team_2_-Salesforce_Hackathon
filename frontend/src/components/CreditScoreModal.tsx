import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreditAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, any>;
}

const CreditAnalysisModal: React.FC<CreditAnalysisModalProps> = ({ isOpen, onClose, formData }) => {
  const [creditData, setCreditData] = useState({
    // Loan Parameters
    loan_amount: formData.loan_amount || '',
    interest_rate: formData.interest_rate || '',
    loan_duration: formData.loan_duration || '',
    loan_purpose: formData.loan_purpose || '',
    
    // Credit History Parameters
    credit_score: formData.credit_score || '',
    payment_history: formData.payment_history || '',
    credit_utilization: formData.credit_utilization || '',
    existing_loans: formData.existing_loans || '',
    
    // Financial Parameters
    monthly_income: formData.monthly_income || '',
    monthly_expenses: formData.monthly_expenses || '',
    debt_to_income_ratio: formData.debt_to_income_ratio || '',
    employment_stability: formData.employment_stability || '',
    
    // Collateral & Security
    collateral_value: formData.collateral_value || '',
    collateral_type: formData.collateral_type || '',
    
    // Risk Factors
    industry_risk: formData.industry_risk || '',
    market_conditions: formData.market_conditions || ''
  });

  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setCreditData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEMI = (principal: number, rate: number, duration: number) => {
    const monthlyRate = rate / (12 * 100);
    const months = duration * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const calculateCreditRisk = () => {
    const loanAmount = parseFloat(creditData.loan_amount) || 0;
    const creditScore = parseFloat(creditData.credit_score) || 0;
    const debtToIncome = parseFloat(creditData.debt_to_income_ratio) || 0;
    const creditUtilization = parseFloat(creditData.credit_utilization) || 0;
    
    // Probability of Default calculation based on credit parameters
    let pd = 0.05; // Base 5% default rate
    
    if (creditScore < 600) pd += 0.15;
    else if (creditScore < 700) pd += 0.08;
    else if (creditScore > 750) pd -= 0.02;
    
    if (debtToIncome > 40) pd += 0.10;
    else if (debtToIncome < 20) pd -= 0.02;
    
    if (creditUtilization > 80) pd += 0.08;
    else if (creditUtilization < 30) pd -= 0.02;
    
    // Loss Given Default (typically 40-60% for unsecured loans)
    const lgd = creditData.collateral_value ? 0.3 : 0.5;
    
    // Expected Loss
    const expectedLoss = pd * loanAmount * lgd;
    
    return { pd: pd * 100, lgd: lgd * 100, expectedLoss };
  };

  const submitForAnalysis = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const loanAmount = parseFloat(creditData.loan_amount) || 0;
      const interestRate = parseFloat(creditData.interest_rate) || 0;
      const duration = parseFloat(creditData.loan_duration) || 0;
      const monthlyIncome = parseFloat(creditData.monthly_income) || 0;
      
      const emi = calculateEMI(loanAmount, interestRate, duration);
      const totalInterest = (emi * duration * 12) - loanAmount;
      const riskMetrics = calculateCreditRisk();
      
      // Credit score calculation based on multiple parameters
      let calculatedScore = 300;
      
      // Payment history (35% weightage)
      const paymentHistory = parseFloat(creditData.payment_history) || 0;
      calculatedScore += (paymentHistory / 5) * 175;
      
      // Credit utilization (30% weightage)
      const utilization = parseFloat(creditData.credit_utilization) || 0;
      calculatedScore += (100 - utilization) * 1.5;
      
      // Credit duration (15% weightage)
      const employmentStability = parseFloat(creditData.employment_stability) || 0;
      calculatedScore += (employmentStability / 10) * 82.5;
      
      // Credit mix and other factors (20% weightage)
      calculatedScore += Math.random() * 110;
      
      calculatedScore = Math.min(850, Math.max(300, Math.round(calculatedScore)));
      
      const mockAnalysis = {
        credit_score: calculatedScore,
        loan_details: {
          amount: loanAmount,
          interest_rate: interestRate,
          duration: duration,
          emi: emi.toFixed(2),
          total_interest: totalInterest.toFixed(2),
          total_amount: (loanAmount + totalInterest).toFixed(2)
        },
        risk_assessment: {
          probability_of_default: riskMetrics.pd.toFixed(2),
          loss_given_default: riskMetrics.lgd.toFixed(2),
          expected_loss: riskMetrics.expectedLoss.toFixed(2),
          risk_level: riskMetrics.pd < 5 ? 'Low' : riskMetrics.pd < 10 ? 'Medium' : 'High'
        },
        affordability: {
          emi_to_income_ratio: ((emi / monthlyIncome) * 100).toFixed(2),
          affordability_status: (emi / monthlyIncome) < 0.4 ? 'Affordable' : 'Stretched'
        },
        recommendations: [
          calculatedScore < 650 ? 'Improve credit score before applying' : 'Good credit profile',
          (emi / monthlyIncome) > 0.4 ? 'Consider longer tenure to reduce EMI' : 'EMI is manageable',
          riskMetrics.pd > 10 ? 'High risk - consider collateral' : 'Acceptable risk level',
          'Maintain consistent payment history'
        ],
        approval_probability: calculatedScore > 700 ? 'High (85-95%)' : 
                            calculatedScore > 650 ? 'Medium (60-80%)' : 'Low (30-50%)'
      };
      
      setAnalysis(mockAnalysis);
      setIsLoading(false);
      
      toast({
        title: "Credit Analysis Complete",
        description: `Credit score: ${calculatedScore}, Risk: ${mockAnalysis.risk_assessment.risk_level}`
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'High': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Comprehensive Credit Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loan Parameters */}
          <Card className="bg-card/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Loan Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-foreground">Loan Amount (₹)</label>
                  <Input
                    type="number"
                    value={creditData.loan_amount}
                    onChange={(e) => handleInputChange('loan_amount', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Interest Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={creditData.interest_rate}
                    onChange={(e) => handleInputChange('interest_rate', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Duration (Years)</label>
                  <Input
                    type="number"
                    value={creditData.loan_duration}
                    onChange={(e) => handleInputChange('loan_duration', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Loan Purpose</label>
                  <Input
                    value={creditData.loan_purpose}
                    onChange={(e) => handleInputChange('loan_purpose', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit History Parameters */}
          <Card className="bg-card/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Credit History & Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-foreground">Parameter</TableHead>
                    <TableHead className="text-foreground">Value</TableHead>
                    <TableHead className="text-foreground">Parameter</TableHead>
                    <TableHead className="text-foreground">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-foreground">Current Credit Score</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="300"
                        max="850"
                        value={creditData.credit_score}
                        onChange={(e) => handleInputChange('credit_score', e.target.value)}
                        className="bg-background border-gray-600 text-foreground max-w-24"
                      />
                    </TableCell>
                    <TableCell className="text-foreground">Payment History (1-5)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={creditData.payment_history}
                        onChange={(e) => handleInputChange('payment_history', e.target.value)}
                        className="bg-background border-gray-600 text-foreground max-w-24"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-gray-700">
                    <TableCell className="text-foreground">Credit Utilization (%)</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={creditData.credit_utilization}
                        onChange={(e) => handleInputChange('credit_utilization', e.target.value)}
                        className="bg-background border-gray-600 text-foreground max-w-24"
                      />
                    </TableCell>
                    <TableCell className="text-foreground">Existing Loans Count</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={creditData.existing_loans}
                        onChange={(e) => handleInputChange('existing_loans', e.target.value)}
                        className="bg-background border-gray-600 text-foreground max-w-24"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Financial Parameters */}
          <Card className="bg-card/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Financial Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-foreground">Monthly Income (₹)</label>
                  <Input
                    type="number"
                    value={creditData.monthly_income}
                    onChange={(e) => handleInputChange('monthly_income', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Monthly Expenses (₹)</label>
                  <Input
                    type="number"
                    value={creditData.monthly_expenses}
                    onChange={(e) => handleInputChange('monthly_expenses', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Debt-to-Income Ratio (%)</label>
                  <Input
                    type="number"
                    value={creditData.debt_to_income_ratio}
                    onChange={(e) => handleInputChange('debt_to_income_ratio', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Employment Stability (Years)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={creditData.employment_stability}
                    onChange={(e) => handleInputChange('employment_stability', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collateral & Risk Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Collateral Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-foreground">Collateral Value (₹)</label>
                  <Input
                    type="number"
                    value={creditData.collateral_value}
                    onChange={(e) => handleInputChange('collateral_value', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Collateral Type</label>
                  <Input
                    value={creditData.collateral_type}
                    onChange={(e) => handleInputChange('collateral_type', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                    placeholder="Property, Vehicle, FD, etc."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Risk Assessment Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-foreground">Industry Risk (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={creditData.industry_risk}
                    onChange={(e) => handleInputChange('industry_risk', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">Market Conditions (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={creditData.market_conditions}
                    onChange={(e) => handleInputChange('market_conditions', e.target.value)}
                    className="bg-background border-gray-600 text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button
              onClick={submitForAnalysis}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isLoading ? 'Analyzing Credit Parameters...' : 'Perform Comprehensive Analysis'}
            </Button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Credit Score & Risk Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Credit Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(analysis.credit_score)}`}>
                        {analysis.credit_score}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Approval Probability: {analysis.approval_probability}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Level:</span>
                        <div className="flex items-center gap-2">
                          {getRiskIcon(analysis.risk_assessment.risk_level)}
                          <span className="text-foreground">{analysis.risk_assessment.risk_level}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Default Probability:</span>
                        <span className="text-foreground">{analysis.risk_assessment.probability_of_default}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Expected Loss:</span>
                        <span className="text-foreground">₹{analysis.risk_assessment.expected_loss}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Affordability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">EMI to Income:</span>
                        <span className="text-foreground">{analysis.affordability.emi_to_income_ratio}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <span className={`${analysis.affordability.affordability_status === 'Affordable' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {analysis.affordability.affordability_status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Loan Details */}
              <Card className="bg-card/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Loan Calculation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">₹{analysis.loan_details.amount}</div>
                      <div className="text-sm text-muted-foreground">Principal Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">₹{analysis.loan_details.emi}</div>
                      <div className="text-sm text-muted-foreground">Monthly EMI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">₹{analysis.loan_details.total_interest}</div>
                      <div className="text-sm text-muted-foreground">Total Interest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">₹{analysis.loan_details.total_amount}</div>
                      <div className="text-sm text-muted-foreground">Total Repayment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">{analysis.loan_details.duration} Yrs</div>
                      <div className="text-sm text-muted-foreground">Loan Duration</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-card/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">Analysis Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="bg-background/50 p-3 rounded-lg border border-gray-700">
                        <div className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          {rec}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditAnalysisModal;
