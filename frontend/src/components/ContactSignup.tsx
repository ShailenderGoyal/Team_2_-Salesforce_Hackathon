
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ContactSignupProps {
  onSignupComplete: () => void;
}

const ContactSignup: React.FC<ContactSignupProps> = ({ onSignupComplete }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock voice input
      setTimeout(() => {
        setPhone('9876543210');
        setIsListening(false);
        toast({
          title: "Voice input received",
          description: "Phone number captured via voice"
        });
      }, 2000);
    }
  };

  const handleGetOtp = () => {
    if (phone.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }
    
    setIsOtpSent(true);
    toast({
      title: "OTP Sent!",
      description: `Verification code sent to +91 ${phone}. Use 1234 for demo.`
    });
  };

  const handleVerifyOtp = () => {
    if (otp === '1234') {
      toast({
        title: "Verification successful!",
        description: "Welcome to your financial dashboard"
      });
      onSignupComplete();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code (1234 for demo)",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-300">
            {isOtpSent 
              ? 'Enter the verification code sent to your phone'
              : 'Enter your phone number to get started'
            }
          </p>
        </div>

        {!isOtpSent ? (
          <div className="space-y-6">
            <div className="relative">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-12"
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

            <Button
              onClick={handleGetOtp}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-300 hover:scale-105"
              disabled={phone.length !== 10}
            >
              Get OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Input
              type="text"
              placeholder="Enter 6-digit OTP (use 1234 for demo)"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 text-center text-xl tracking-widest"
              maxLength={6}
            />

            <div className="flex gap-3">
              <Button
                onClick={() => setIsOtpSent(false)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyOtp}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium transition-all duration-300 hover:scale-105"
                disabled={otp.length < 4}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Voice-enabled • Secure • Fast
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ContactSignup;
