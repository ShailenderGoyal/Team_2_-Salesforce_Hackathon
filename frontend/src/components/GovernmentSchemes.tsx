
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Info, CheckCircle, Users } from 'lucide-react';
import schemesData from '@/data/schemes.json';

const GovernmentSchemes: React.FC = () => {
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSchemeModal = (scheme: any) => {
    setSelectedScheme(scheme);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheme(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gray-900 border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Government Schemes</h2>
            <p className="text-gray-400">Discover financial programs you're eligible for</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {schemesData.government_schemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-4 bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => openSchemeModal(scheme)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white text-lg">{scheme.name}</h3>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{scheme.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
                  {scheme.eligibility}
                </Badge>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  openSchemeModal(scheme);
                }}
              >
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Scheme Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
          {selectedScheme && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  {selectedScheme.name}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About This Scheme</h3>
                  <p className="text-gray-300">{selectedScheme.description}</p>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Eligibility</h3>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {selectedScheme.eligibility}
                  </Badge>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Key Benefits</h3>
                  <div className="space-y-2">
                    {selectedScheme.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personalized Recommendations */}
                <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-4 rounded-lg border border-blue-700/50">
                  <h3 className="text-lg font-semibold text-white mb-2">Personalized Recommendations</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>You appear eligible based on your profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Your current financial status qualifies for this program</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-400" />
                      <span>Consider applying within the next 30 days for optimal benefits</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(selectedScheme.link, '_blank')}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Official Website
                  </Button>
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GovernmentSchemes;
