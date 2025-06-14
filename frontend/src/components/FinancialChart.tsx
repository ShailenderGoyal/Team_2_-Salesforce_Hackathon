
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Mic, MicOff, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import scoreData from '@/data/score_review.json';

const FinancialChart: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(80000);
  const [spendingData, setSpendingData] = useState(scoreData.spending_categories);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const totalSpending = spendingData.reduce((sum, category) => sum + category.amount, 0);
  const spendingRatio = totalSpending / monthlyIncome;
  const isHealthy = spendingRatio < 0.7;

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setMonthlyIncome(85000);
        setIsListening(false);
        toast({
          title: "Voice input captured",
          description: "Monthly income updated via voice"
        });
      }, 2000);
    }
  };

  const updateCategory = (index: number, newAmount: number) => {
    setSpendingData(prev => prev.map((category, i) => 
      i === index ? { ...category, amount: newAmount } : category
    ));
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Income vs. Spending Analysis</h2>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          isHealthy ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
        )}>
          {isHealthy ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          <span className="font-semibold">
            {isHealthy ? "✅ Healthy Spending" : "⚠️ High Spending"}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="amount"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: 'white'
                }}
                formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
              <Legend 
                wrapperStyle={{ color: '#d1d5db' }}
                formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Controls and Summary */}
        <div className="space-y-6">
          {/* Income Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income</label>
            <div className="relative">
              <Input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white pr-12"
              />
              <Button
                onClick={toggleVoiceInput}
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white",
                  isListening && "text-red-400 animate-pulse"
                )}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Spending Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Spending Categories</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {spendingData.map((category, index) => (
                <div key={category.name} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-300 flex-1">{category.name}</span>
                  <Input
                    type="number"
                    value={category.amount}
                    onChange={(e) => updateCategory(index, Number(e.target.value))}
                    className="w-24 h-8 bg-gray-800 border-gray-600 text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Total Income:</span>
                <span className="text-green-400 font-semibold">₹{monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Total Spending:</span>
                <span className="text-red-400 font-semibold">₹{totalSpending.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Remaining:</span>
                <span className={cn(
                  "font-semibold",
                  monthlyIncome - totalSpending > 0 ? "text-green-400" : "text-red-400"
                )}>
                  ₹{(monthlyIncome - totalSpending).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-600">
                <p className={cn(
                  "text-sm font-medium",
                  isHealthy ? "text-green-400" : "text-orange-400"
                )}>
                  {isHealthy 
                    ? "✅ Great job! Consider increasing investments."
                    : "❌ Spending is high. Consider reducing discretionary expenses."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinancialChart;
