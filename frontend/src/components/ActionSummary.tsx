
import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, DollarSign, CreditCard } from 'lucide-react';

const ActionSummary: React.FC = () => {
  const doActions = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      title: "Pay bills on time",
      description: "Maintain 100% on-time payment history to boost your credit score",
      priority: "high"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-green-400" />,
      title: "Increase emergency savings",
      description: "Build 6-month expense buffer for financial security",
      priority: "medium"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      title: "Invest surplus income",
      description: "Allocate 20% of income to mutual funds or SIPs",
      priority: "medium"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      title: "Review credit report monthly",
      description: "Monitor for errors and fraudulent activities",
      priority: "low"
    }
  ];

  const dontActions = [
    {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      title: "Don't max out credit cards",
      description: "Keep credit utilization below 30% of available limit",
      priority: "high"
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
      title: "Avoid multiple loan applications",
      description: "Hard inquiries can temporarily lower your credit score",
      priority: "high"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-red-400" />,
      title: "Don't close old credit accounts",
      description: "Length of credit history impacts your score positively",
      priority: "medium"
    },
    {
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      title: "Avoid lifestyle inflation",
      description: "Don't increase spending proportionally with income",
      priority: "medium"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/30 text-red-400 border-red-700';
      case 'medium':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'low':
        return 'bg-blue-900/30 text-blue-400 border-blue-700';
      default:
        return 'bg-gray-900/30 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* What TO DO */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-600 rounded-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">✅ What TO DO</h2>
            <p className="text-gray-400">Recommended actions to improve your financial health</p>
          </div>
        </div>

        <div className="space-y-4">
          {doActions.map((action, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-600 transition-colors">
              <div className="flex items-start gap-3">
                {action.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{action.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityBadge(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* What NOT TO DO */}
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-600 rounded-lg">
            <XCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">❌ What NOT TO DO</h2>
            <p className="text-gray-400">Actions that could harm your financial progress</p>
          </div>
        </div>

        <div className="space-y-4">
          {dontActions.map((action, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-red-600 transition-colors">
              <div className="flex items-start gap-3">
                {action.icon}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{action.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityBadge(action.priority)}`}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ActionSummary;
