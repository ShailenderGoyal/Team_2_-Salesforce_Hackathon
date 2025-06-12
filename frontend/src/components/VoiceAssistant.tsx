
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff, MessageSquare, Image, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onToggle }) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [inputText, setInputText] = useState('');

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock voice recognition
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'user',
          content: 'Show me my credit score breakdown',
          timestamp: new Date()
        }]);
        setIsListening(false);
        
        // Mock assistant response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'assistant',
            content: 'Your current credit score is based on 5 key factors. Payment history is your strongest area at 4/5, while credit history length needs improvement at 2/5. Would you like me to explain how to improve it?',
            timestamp: new Date()
          }]);
        }, 1000);
      }, 2000);
    }
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Hi! I\'m your personal finance assistant. I can help you understand your credit score, find loan options, or discover government schemes. How can I help you today?',
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        type: 'user',
        content: inputText,
        timestamp: new Date()
      }]);
      setInputText('');
      
      // Mock response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: 'I understand you want to know more about that. Let me analyze your profile and provide personalized recommendations.',
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className={cn(
          "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
          "border-2 border-white/20"
        )}
        size="icon"
      >
        <Phone className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 bg-gray-900 border-gray-700 shadow-2xl animate-scale-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              )} />
              <span className="text-white font-medium">Finance Assistant</span>
            </div>
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-lg text-sm",
                  message.type === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100 border border-gray-700"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2 mb-3">
            <Button
              onClick={handleConnect}
              variant={isConnected ? "default" : "outline"}
              size="sm"
              className={cn(
                isConnected 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "border-gray-600 text-gray-300"
              )}
            >
              {isConnected ? 'Connected' : 'Connect'}
            </Button>
            <Button
              onClick={toggleListening}
              variant="outline"
              size="sm"
              className={cn(
                "border-gray-600",
                isListening 
                  ? "bg-red-600 text-white border-red-600 animate-pulse" 
                  : "text-gray-300"
              )}
              disabled={!isConnected}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300" disabled={!isConnected}>
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300" disabled={!isConnected}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:border-blue-500"
              disabled={!isConnected}
            />
            <Button 
              onClick={sendMessage}
              size="sm"
              disabled={!isConnected || !inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VoiceAssistant;
