import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff, MessageSquare, Globe, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

// Language options
const LANGUAGES = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
];

// Embedded Financial Assistant Logic
class SimpleFinancialAssistant {
  private apiKey: string;
  private currentLanguage: string;
  private isListening: boolean = false;
  private recognition: any = null;
  private synthesis: any = null;

  constructor(apiKey: string, defaultLanguage: string = 'hi') {
    this.apiKey = apiKey;
    this.currentLanguage = defaultLanguage;
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getRecognitionLanguage(this.currentLanguage);
    }
  }

  private getRecognitionLanguage(code: string): string {
    const langCodes: { [key: string]: string } = {
      'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN', 'bn': 'bn-IN',
      'gu': 'gu-IN', 'en': 'en-IN'
    };
    return langCodes[code] || 'hi-IN';
  }

  async chat(message: string, language: string): Promise<string> {
    // For demo purposes, return mock responses based on language and content
    const responses = this.getMockResponses(message, language);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return responses;
  }

  private getMockResponses(message: string, language: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Financial keywords detection
    const savingsKeywords = ['save', 'saving', 'बचत', 'बचाना', 'ఆదా', 'சேமிப்பு'];
    const creditKeywords = ['credit', 'score', 'क्रेडिट', 'స్కోర్', 'கிரெடிட்'];
    const loanKeywords = ['loan', 'लोन', 'లోన్', 'கடன்'];
    const investKeywords = ['invest', 'investment', 'निवेश', 'పెట్టుబడి', 'முதலீடு'];

    const responses: { [key: string]: { [key: string]: string[] } } = {
      savings: {
        hi: [
          'पैसे बचाने के लिए 50-30-20 नियम अपनाएं: 50% जरूरतों के लिए, 30% चाहतों के लिए, 20% बचत के लिए।',
          'महीने की शुरुआत में ही बचत करें, महीने के अंत में नहीं।',
          'छोटी मात्रा में भी हर दिन बचत करना बेहतर है।'
        ],
        te: [
          'డబ్బు ఆదా చేయడానికి 50-30-20 నియమం పాటించండి: 50% అవసరాలకు, 30% కోరికలకు, 20% సేవింగ్స్‌కు.',
          'నెల మొదట్లోనే సేవింగ్స్ చేయండి, నెల చివర్లో కాదు.',
          'తక్కువ మొత్తంలో అయినా ప్రతిరోజూ ఆదా చేయడం మంచిది.'
        ],
        en: [
          'Follow the 50-30-20 rule: 50% for needs, 30% for wants, 20% for savings.',
          'Save at the beginning of the month, not at the end.',
          'Even small daily savings can make a big difference over time.'
        ]
      },
      credit: {
        hi: [
          'क्रेडिट स्कोर 300-900 के बीच होता है। 750+ अच्छा माना जाता है।',
          'समय पर बिल भुगतान करें और क्रेडिट उपयोग 30% से कम रखें।',
          'नियमित रूप से अपना क्रेडिट रिपोर्ट चेक करें।'
        ],
        te: [
          'క్రెడిట్ స్కోర్ 300-900 మధ్య ఉంటుంది. 750+ మంచిదిగా పరిగణించబడుతుంది.',
          'సమయానికి బిల్లులు చెల్లించండి మరియు క్రెడిట్ వినియోగం 30% కంటే తక్కువగా ఉంచండి.',
          'క్రమం తప్పకుండా మీ క్రెడిట్ రిపోర్ట్ తనిఖీ చేయండి.'
        ],
        en: [
          'Credit score ranges from 300-900. 750+ is considered good.',
          'Pay bills on time and keep credit utilization below 30%.',
          'Check your credit report regularly for accuracy.'
        ]
      },
      loan: {
        hi: [
          'होम लोन के लिए अच्छा क्रेडिट स्कोर, स्थिर आय और डाउन पेमेंट चाहिए।',
          'अलग-अलग बैंकों की ब्याज दरों की तुलना करें।',
          'EMI आपकी मासिक आय का 40% से ज्यादा नहीं होना चाहिए।'
        ],
        te: [
          'హోమ్ లోన్ కోసం మంచి క్రెడిట్ స్కోర్, స్థిరమైన ఆదాయం మరియు డౌన్ పేమెంట్ అవసరం.',
          'వివిధ బ్యాంకుల వడ్డీ రేట్లను పోల్చండి.',
          'EMI మీ నెలవారీ ఆదాయంలో 40% కంటే ఎక్కువ ఉండకూడదు.'
        ],
        en: [
          'For home loans, you need good credit score, stable income, and down payment.',
          'Compare interest rates across different banks.',
          'EMI should not exceed 40% of your monthly income.'
        ]
      },
      investment: {
        hi: [
          'SIP के जरिए म्यूचुअल फंड में निवेश करना शुरुआती लोगों के लिए अच्छा है।',
          'अपने निवेश को अलग-अलग जगह बांटें - डायवर्सिफिकेशन करें।',
          'लंबी अवधि के लिए निवेश करें और धैर्य रखें।'
        ],
        te: [
          'SIP ద్వారా మ్యూచువల్ ఫండ్లలో పెట్టుబడి పెట్టడం ప్రారంభకులకు మంచిది.',
          'మీ పెట్టుబడిని వివిధ చోట్ల విభజించండి - డైవర్సిఫికేషన్ చేయండి.',
          'దీర్ఘకాలిక పెట్టుబడి చేయండి మరియు ఓపిక పట్టండి.'
        ],
        en: [
          'SIP in mutual funds is good for beginners to start investing.',
          'Diversify your investments across different asset classes.',
          'Invest for the long term and be patient with your investments.'
        ]
      }
    };

    // Determine response category
    let category = 'general';
    if (savingsKeywords.some(keyword => lowerMessage.includes(keyword))) category = 'savings';
    else if (creditKeywords.some(keyword => lowerMessage.includes(keyword))) category = 'credit';
    else if (loanKeywords.some(keyword => lowerMessage.includes(keyword))) category = 'loan';
    else if (investKeywords.some(keyword => lowerMessage.includes(keyword))) category = 'investment';

    // Get response in appropriate language
    const categoryResponses = responses[category];
    if (categoryResponses && categoryResponses[language]) {
      const responseArray = categoryResponses[language];
      return responseArray[Math.floor(Math.random() * responseArray.length)];
    }

    // Fallback responses
    const fallbackResponses: { [key: string]: string } = {
      hi: 'मैं आपकी वित्तीय सहायता के लिए यहां हूं। कृपया बचत, निवेश, या लोन के बारे में पूछें।',
      te: 'నేను మీ ఆర్థిక సహాయం కోసం ఇక్కడ ఉన్నాను. దయచేసి సేవింగ్స్, పెట్టుబడి లేదా లోన్ గురించి అడగండి.',
      ta: 'நான் உங்கள் நிதி உதவிக்காக இங்கே இருக்கிறேன். சேமிப்பு, முதலீடு அல்லது கடன் பற்றி கேளுங்கள்.',
      en: 'I\'m here to help with your financial questions. Please ask about savings, investments, or loans.',
      bn: 'আমি আপনার আর্থিক সহায়তার জন্য এখানে আছি। অনুগ্রহ করে সঞ্চয়, বিনিয়োগ বা ঋণ সম্পর্কে জিজ্ঞাসা করুন।',
      gu: 'હું તમારી નાણાકીય સહાયતા માટે અહીં છું. કૃપા કરીને બચત, રોકાણ અથવા લોન વિશે પૂછો.'
    };

    return fallbackResponses[language] || fallbackResponses.en;
  }

  async startVoiceRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject('Speech recognition not supported');
        return;
      }

      this.recognition.lang = this.getRecognitionLanguage(this.currentLanguage);
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript.trim()) {
          this.isListening = false;
          resolve(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(`Speech recognition error: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  async speak(text: string, language: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getRecognitionLanguage(language);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synthesis.speak(utterance);
    });
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = this.getRecognitionLanguage(language);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onToggle }) => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('hi');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Ready');
  
  const assistantRef = useRef<SimpleFinancialAssistant | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize assistant when component mounts
  useEffect(() => {
    if (isOpen && !assistantRef.current) {
      // Initialize with demo API key - replace with real one
      assistantRef.current = new SimpleFinancialAssistant(
        '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', // Replace with actual OpenAI API key
        currentLanguage
      );
    }
  }, [isOpen, currentLanguage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date(),
      language: currentLanguage
    }]);
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      const welcomeMessages: { [key: string]: string } = {
        hi: 'नमस्ते! मैं आपका वित्तीय सहायक हूं। मैं बचत, बजट, क्रेडिट स्कोर के बारे में मदद कर सकता हूं।',
        te: 'నమస్కారం! నేను మీ ఆర్థిక సహాయకుడిని. నేను పొదుపు, బడ్జెట్, క్రెడిట్ స్కోర్ గురించి సహాయం చేయగలను.',
        ta: 'வணக்கம்! நான் உங்கள் நிதி உதவியாளர். சேமிப்பு, பட்ஜெட், கிரெடிட் ஸ்கோர் பற்றி உதவ முடியும்.',
        en: 'Hello! I\'m your financial assistant. I can help with savings, budgets, credit scores, and more.',
        bn: 'নমস্কার! আমি আপনার আর্থিক সহায়ক। আমি সঞ্চয়, বাজেট, ক্রেডিট স্কোর নিয়ে সাহায্য করতে পারি।',
        gu: 'નમસ્તે! હું તમારો નાણાકીય સહાયક છું। હું બચત, બજેટ, ક્રેડિટ સ્કોર વિશે મદદ કરી શકું છું.'
      };
      
      addMessage(welcomeMessages[currentLanguage] || welcomeMessages.en, 'assistant');
    }
  };

  const toggleListening = async () => {
    if (!assistantRef.current) return;

    try {
      if (isListening) {
        assistantRef.current.stopListening();
        setIsListening(false);
        setVoiceStatus('Ready');
      } else {
        setVoiceStatus('Listening...');
        setIsListening(true);
        
        const transcript = await assistantRef.current.startVoiceRecognition();
        addMessage(transcript, 'user');
        
        setVoiceStatus('Processing...');
        setIsLoading(true);
        
        const response = await assistantRef.current.chat(transcript, currentLanguage);
        addMessage(response, 'assistant');
        
        setVoiceStatus('Speaking...');
        await assistantRef.current.speak(response, currentLanguage);
        
        setVoiceStatus('Ready');
        setIsListening(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Voice error:', error);
      setVoiceStatus('Error');
      setIsListening(false);
      setIsLoading(false);
      addMessage('माइक्रोफोन की अनुमति दें / Please allow microphone access', 'assistant');
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !assistantRef.current) return;

    const userMessage = inputText;
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      const response = await assistantRef.current.chat(userMessage, currentLanguage);
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Send message error:', error);
      addMessage('Error processing message', 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
    
    if (assistantRef.current) {
      assistantRef.current.setLanguage(langCode);
      
      const langChangeMessages: { [key: string]: string } = {
        hi: 'भाषा बदल गई: हिंदी',
        te: 'భాష మార్చబడింది: తెలుగు',
        ta: 'மொழி மாற்றப்பட்டது: தமிழ்',
        en: 'Language changed to: English',
        bn: 'ভাষা পরিবর্তিত হয়েছে: বাংলা',
        gu: 'ભાષા બદલાઈ ગઈ: ગુજરાતી'
      };
      
      addMessage(langChangeMessages[langCode] || 'Language changed', 'assistant');
    }
  };

  const getDemoSuggestions = () => {
    const suggestions: { [key: string]: string[] } = {
      hi: [
        'मैं पैसे कैसे बचा सकता हूं?',
        'क्रेडिट स्कोर क्या है?',
        'होम लोन के लिए कैसे अप्लाई करें?'
      ],
      te: [
        'నేను డబ్బు ఎలా ఆదా చేయగలను?',
        'క్రెడిట్ స్కోర్ అంటే ఏమిటి?',
        'హోమ్ లోన్ కోసం ఎలా దరఖాస్తు చేయాలి?'
      ],
      ta: [
        'நான் எப்படி பணம் சேமிக்க முடியும்?',
        'கிரெடிட் ஸ்கோர் என்றால் என்ன?',
        'வீட்டுக் கடனுக்கு எவ்வாறு விண்ணப்பிப்பது?'
      ],
      en: [
        'How can I save money?',
        'What is a credit score?',
        'How to apply for a home loan?'
      ],
      bn: [
        'আমি কীভাবে টাকা সাশ্রয় করতে পারি?',
        'ক্রেডিট স্কোর কী?',
        'হোম লোনের জন্য কীভাবে আবেদন করব?'
      ],
      gu: [
        'હું પૈસા કેવી રીતે બચાવી શકું?',
        'ક્રેડિટ સ્કોર શું છે?',
        'હોમ લોન માટે કેવી રીતે અરજી કરવી?'
      ]
    };
    
    return suggestions[currentLanguage] || suggestions.en;
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
    <Card className="fixed bottom-6 right-6 w-80 h-[500px] bg-gray-900 border-gray-700 shadow-2xl animate-scale-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              )} />
              <span className="text-white font-medium">Financial Saathi</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Globe className="h-4 w-4" />
              </Button>
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
          
          {/* Language Selector */}
          {showLanguageSelector && (
            <div className="mt-2 grid grid-cols-2 gap-1">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs text-white hover:bg-white/20",
                    currentLanguage === lang.code && "bg-white/20"
                  )}
                >
                  {lang.flag} {lang.name}
                </Button>
              ))}
            </div>
          )}
          
          {/* Voice Status */}
          <div className="mt-2 text-xs text-white/80">
            {voiceStatus}
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto space-y-3"
        >
          {messages.length === 0 && isConnected && (
            <div className="space-y-2">
              <div className="text-gray-400 text-sm">Try these demo questions:</div>
              {getDemoSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  onClick={() => setInputText(suggestion)}
                  variant="outline"
                  size="sm"
                  className="w-full text-left border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          
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
                <div className="text-xs mt-1 opacity-60">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 border border-gray-700 p-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            </div>
          )}
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
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300" 
              disabled={!isConnected}
              onClick={() => {
                if (assistantRef.current) {
                  const demoText = currentLanguage === 'hi' 
                    ? 'यह एक डेमो है। आवाज़ की जाँच हो रही है।'
                    : 'This is a demo. Voice test in progress.';
                  assistantRef.current.speak(demoText, currentLanguage);
                }
              }}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={
                currentLanguage === 'hi' ? 'अपना सवाल लिखें...' :
                currentLanguage === 'te' ? 'మీ ప్రశ్న రాయండి...' :
                currentLanguage === 'ta' ? 'உங்கள் கேள்வியை எழுதுங்கள்...' :
                'Type your message...'
              }
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 text-sm focus:outline-none focus:border-blue-500"
              disabled={!isConnected}
            />
            <Button 
              onClick={sendMessage}
              size="sm"
              disabled={!isConnected || !inputText.trim() || isLoading}
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