/**
 * Financial Saathi - Multilingual Financial Assistant
 * A comprehensive voice and text chatbot for financial assistance
 * Supports: Hindi, Telugu, Tamil, English, Bengali, Gujarati, Marathi, Punjabi, Urdu
 */

class FinancialSaathi {
    constructor(config = {}) {
        // Configuration
        this.config = {
            openaiApiKey: config.openaiApiKey || '',
            defaultLanguage: config.defaultLanguage || 'hi',
            enableDebug: config.enableDebug || false,
            maxConversationHistory: config.maxConversationHistory || 6,
            ...config
        };

        // Core components
        this.translator = null;
        this.chatbot = null;
        this.voiceAssistant = null;

        // State management
        this.currentLanguage = this.config.defaultLanguage;
        this.isVoiceChatActive = false;
        this.micPermissionGranted = false;
        this.debugLogs = [];

        // UI elements (will be set during initialization)
        this.elements = {};

        // Supported languages
        this.supportedLanguages = {
            'hi': 'हिंदी / Hindi',
            'te': 'తెలుగు / Telugu', 
            'ta': 'தமிழ் / Tamil',
            'bn': 'বাংলা / Bengali',
            'gu': 'ગુજરાતી / Gujarati',
            'mr': 'मराठी / Marathi',
            'pa': 'ਪੰਜਾਬੀ / Punjabi',
            'ur': 'اردو / Urdu',
            'en': 'English'
        };
    }

    /**
     * Initialize the Financial Saathi system
     * @param {Object} elementIds - Object containing DOM element IDs
     */
    async init(elementIds = {}) {
        try {
            this.logDebug('Initializing Financial Saathi...', 'INIT');

            // Validate API key
            if (!this.config.openaiApiKey || this.config.openaiApiKey === 'your-openai-api-key-here') {
                throw new Error('Valid OpenAI API key required');
            }

            // Set up DOM elements
            this.setupDOMElements(elementIds);

            // Initialize core components
            await this.initializeComponents();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize UI
            await this.updateUIForLanguage();

            this.updateStatus(this.getLocalizedText('ready'));
            this.logDebug('Financial Saathi initialized successfully', 'SUCCESS');

            return true;
        } catch (error) {
            this.logDebug(`Initialization failed: ${error.message}`, 'ERROR');
            this.updateStatus(`Initialization failed: ${error.message}`, 'error');
            return false;
        }
    }

    /**
     * Set up DOM element references
     */
    setupDOMElements(elementIds) {
        const defaultIds = {
            chatContainer: 'chat-container',
            textInput: 'text-input',
            sendBtn: 'send-btn',
            startCallBtn: 'start-call-btn',
            endCallBtn: 'end-call-btn',
            statusElement: 'status',
            languageDisplay: 'language-display',
            selectedLangText: 'selected-lang-text',
            listeningIndicator: 'listening-indicator',
            debugInfo: 'debug-info',
            debugContent: 'debug-content'
        };

        this.elements = { ...defaultIds, ...elementIds };

        // Validate required elements exist
        const requiredElements = ['chatContainer', 'textInput', 'sendBtn'];
        for (const elementKey of requiredElements) {
            const element = document.getElementById(this.elements[elementKey]);
            if (!element) {
                throw new Error(`Required element not found: ${this.elements[elementKey]}`);
            }
        }
    }

    /**
     * Initialize core AI components
     */
    async initializeComponents() {
        this.translator = new SmartTranslationSystem(this.config.openaiApiKey);
        this.chatbot = new OptimizedChatbot(this.config.openaiApiKey, this.config.maxConversationHistory);
        this.voiceAssistant = new EnhancedVoiceAssistant(this.chatbot, this.translator, this);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        this.logDebug('Setting up event listeners...', 'INIT');

        // Text input events
        const sendBtn = document.getElementById(this.elements.sendBtn);
        const textInput = document.getElementById(this.elements.textInput);

        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (textInput) textInput.addEventListener('keypress', (e) => this.handleKeyPress(e));

        // Voice control events
        const startCallBtn = document.getElementById(this.elements.startCallBtn);
        const endCallBtn = document.getElementById(this.elements.endCallBtn);

        if (startCallBtn) startCallBtn.addEventListener('click', () => this.startVoiceChat());
        if (endCallBtn) endCallBtn.addEventListener('click', () => this.endVoiceChat());

        // Custom events for voice states
        document.addEventListener('voiceStateChanged', (event) => this.handleVoiceStateChange(event));
        document.addEventListener('userTranscript', (event) => this.handleUserTranscript(event));
        document.addEventListener('interimTranscript', (event) => this.handleInterimTranscript(event));
    }

    /**
     * Select a language for the assistant
     */
    async selectLanguage(langCode) {
        if (!this.supportedLanguages[langCode]) {
            this.logDebug(`Unsupported language: ${langCode}`, 'WARNING');
            return false;
        }

        this.logDebug(`Language selected: ${langCode}`, 'LANG');
        this.currentLanguage = langCode;

        // Update UI
        this.updateLanguageButtons(langCode);
        await this.updateUIForLanguage();

        // Update voice recognition language if active
        if (this.voiceAssistant && this.voiceAssistant.recognition) {
            this.voiceAssistant.recognition.lang = this.voiceAssistant.getRecognitionLanguage(langCode);
            this.logDebug(`Voice recognition updated to: ${this.voiceAssistant.recognition.lang}`, 'VOICE');
        }

        return true;
    }

    /**
     * Update language selection buttons
     */
    updateLanguageButtons(selectedLang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === selectedLang) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Update UI text for selected language
     */
    async updateUIForLanguage() {
        // Update language display
        const selectedLangText = document.getElementById(this.elements.selectedLangText);
        if (selectedLangText) {
            selectedLangText.textContent = `Selected: ${this.supportedLanguages[this.currentLanguage]}`;
        }

        // Update placeholder text
        const textInput = document.getElementById(this.elements.textInput);
        if (textInput) {
            textInput.placeholder = this.getLocalizedText('placeholder');
        }

        this.logDebug(`UI updated for language: ${this.currentLanguage}`, 'UI');
    }

    /**
     * Send a text message
     */
    async sendMessage() {
        const textInput = document.getElementById(this.elements.textInput);
        const message = textInput.value.trim();

        if (!message || !this.chatbot) return;

        textInput.value = '';
        this.addMessage(message, 'user');
        this.logDebug(`Text message sent: ${message.substring(0, 30)}...`, 'USER');

        try {
            this.updateStatus(this.getLocalizedText('processing'), 'processing');

            const result = await this.chatbot.chat(message, this.currentLanguage);
            this.addMessage(result.response, 'assistant');
            this.updateStatus(this.getLocalizedText('ready'));

            this.logDebug('Text response generated successfully', 'SUCCESS');
        } catch (error) {
            this.logDebug(`Text processing error: ${error.message}`, 'ERROR');
            const errorMsg = this.getLocalizedText('error_response');
            this.addMessage(errorMsg, 'assistant');
            this.updateStatus(this.getLocalizedText('ready'));
        }
    }

    /**
     * Handle keyboard input
     */
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    }

    /**
     * Start voice chat
     */
    async startVoiceChat() {
        if (!this.voiceAssistant) {
            this.logDebug('Voice assistant not available', 'ERROR');
            return false;
        }

        this.isVoiceChatActive = true;
        this.updateVoiceButtons(true);

        const success = await this.voiceAssistant.startVoiceChat();
        if (success) {
            this.logDebug('Voice chat started successfully', 'SUCCESS');
        }
        return success;
    }

    /**
     * End voice chat
     */
    endVoiceChat() {
        if (!this.voiceAssistant) return;

        this.isVoiceChatActive = false;
        this.voiceAssistant.endVoiceChat();
        this.updateVoiceButtons(false);
        this.showListeningIndicator(false);

        this.logDebug('Voice chat ended', 'INFO');
    }

    /**
     * Update voice control buttons
     */
    updateVoiceButtons(isActive) {
        const startBtn = document.getElementById(this.elements.startCallBtn);
        const endBtn = document.getElementById(this.elements.endCallBtn);

        if (startBtn) startBtn.style.display = isActive ? 'none' : 'flex';
        if (endBtn) endBtn.style.display = isActive ? 'flex' : 'none';
    }

    /**
     * Handle voice state changes
     */
    handleVoiceStateChange(event) {
        const { state, data } = event.detail;
        this.logDebug(`Voice state: ${state}`, 'VOICE');

        switch(state) {
            case 'listening':
                this.updateStatus(this.getLocalizedText('listening'), 'listening');
                this.showListeningIndicator(true);
                break;
            case 'processing':
                this.updateStatus(this.getLocalizedText('processing'), 'processing');
                this.showListeningIndicator(false);
                break;
            case 'speaking':
                this.updateStatus(this.getLocalizedText('speaking'), 'speaking');
                break;
            case 'ready':
                this.updateStatus(this.getLocalizedText('ready'));
                this.showListeningIndicator(false);
                break;
            case 'error':
                this.updateStatus(`${this.getLocalizedText('error')}: ${data}`, 'error');
                this.showListeningIndicator(false);
                break;
        }
    }

    /**
     * Handle user transcript from voice
     */
    handleUserTranscript(event) {
        const text = event.detail;
        this.addMessage(text, 'user');
        this.logDebug(`User spoke: ${text.substring(0, 50)}...`, 'USER');
    }

    /**
     * Handle interim transcript
     */
    handleInterimTranscript(event) {
        this.showInterimMessage(event.detail);
    }

    /**
     * Add message to chat
     */
    addMessage(text, sender) {
        const container = document.getElementById(this.elements.chatContainer);
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Show interim voice recognition message
     */
    showInterimMessage(text) {
        this.removeInterimMessage();

        const container = document.getElementById(this.elements.chatContainer);
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message interim';
        messageDiv.id = 'interim-message';
        messageDiv.textContent = text;
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Remove interim message
     */
    removeInterimMessage() {
        const interimMessage = document.getElementById('interim-message');
        if (interimMessage) {
            interimMessage.remove();
        }
    }

    /**
     * Update status display
     */
    updateStatus(message, className = '') {
        const statusElement = document.getElementById(this.elements.statusElement);
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status ${className}`;
        }
    }

    /**
     * Show/hide listening indicator
     */
    showListeningIndicator(show) {
        const indicator = document.getElementById(this.elements.listeningIndicator);
        if (indicator) {
            indicator.style.opacity = show ? '1' : '0';
        }
    }

    /**
     * Get localized text for current language
     */
    getLocalizedText(key) {
        const texts = {
            'hi': {
                'ready': 'तैयार हूं! आप बात करना शुरू कर सकते हैं',
                'listening': 'सुन रहा हूं...',
                'processing': 'समझ रहा हूं...',
                'speaking': 'जवाब दे रहा हूं...',
                'error': 'त्रुटि',
                'placeholder': 'हिंदी में अपना सवाल लिखें या बोलें...',
                'error_response': 'माफ करें, कुछ समस्या हुई।',
                'mic_permission_error': 'माइक्रोफोन की अनुमति दें'
            },
            'te': {
                'ready': 'సిద్ధంగా ఉన్నాను! మీరు మాట్లాడటం ప్రారంభించవచ్చు',
                'listening': 'వింటున్నాను...',
                'processing': 'అర్థం చేసుకుంటున్నాను...',
                'speaking': 'జవాబు చెబుతున్నాను...',
                'error': 'లోపం',
                'placeholder': 'తెలుగులో మీ ప్రశ్న రాయండి లేదా మాట్లాడండి...',
                'error_response': 'క్షమించండి, ఏదో సమస్య వచ్చింది।',
                'mic_permission_error': 'మైక్రోఫోన్ అనుమతి ఇవ్వండి'
            },
            'ta': {
                'ready': 'தயாராக இருக்கிறேன்! நீங்கள் பேசத் தொடங்கலாம்',
                'listening': 'கேட்டுக்கொண்டிருக்கிறேன்...',
                'processing': 'புரிந்துகொள்கிறேன்...',
                'speaking': 'பதில் சொல்கிறேன்...',
                'error': 'பிழை',
                'placeholder': 'தமிழில் உங்கள் கேள்வியை எழுதுங்கள் அல்லது பேசுங்கள்...',
                'error_response': 'மன்னிக்கவும், ஏதோ பிரச்சனை வந்தது।',
                'mic_permission_error': 'மைக்ரோஃபோன் அனுமதி கொடுங்கள்'
            },
            'bn': {
                'ready': 'প্রস্তুত! আপনি কথা বলা শুরু করতে পারেন',
                'listening': 'শুনছি...',
                'processing': 'বুঝতে চেষ্টা করছি...',
                'speaking': 'উত্তর দিচ্ছি...',
                'error': 'ত্রুটি',
                'placeholder': 'বাংলায় আপনার প্রশ্ন লিখুন বা বলুন...',
                'error_response': 'দুঃখিত, কিছু সমস্যা হয়েছে।',
                'mic_permission_error': 'মাইক্রোফোনের অনুমতি দিন'
            },
            'gu': {
                'ready': 'તૈયાર છું! તમે વાત કરવાનું શરૂ કરી શકો છો',
                'listening': 'સાંભળી રહ્યો છું...',
                'processing': 'સમજવાનો પ્રયાસ કરી રહ્યો છું...',
                'speaking': 'જવાબ આપી રહ્યો છું...',
                'error': 'ભૂલ',
                'placeholder': 'ગુજરાતીમાં તમારો પ્રશ્ન લખો અથવા બોલો...',
                'error_response': 'માફ કરજો, કંઈક સમસ્યા આવી છે।',
                'mic_permission_error': 'માઇક્રોફોનની પરવાનગી આપો'
            },
            'en': {
                'ready': 'Ready! You can start speaking or typing',
                'listening': 'Listening...',
                'processing': 'Processing...',
                'speaking': 'Speaking response...',
                'error': 'Error',
                'placeholder': 'Type or speak your financial question...',
                'error_response': 'Sorry, something went wrong.',
                'mic_permission_error': 'Please allow microphone access'
            }
        };

        return texts[this.currentLanguage]?.[key] || texts['en'][key] || key;
    }

    /**
     * Debug logging system
     */
    logDebug(message, category = 'INFO') {
        if (!this.config.enableDebug) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${category}: ${message}`;
        this.debugLogs.push(logEntry);

        // Keep only last 10 logs
        if (this.debugLogs.length > 10) {
            this.debugLogs = this.debugLogs.slice(-10);
        }

        // Update debug display
        const debugContent = document.getElementById(this.elements.debugContent);
        if (debugContent) {
            debugContent.innerHTML = this.debugLogs.join('<br>');
            debugContent.scrollTop = debugContent.scrollHeight;
        }

        console.log(logEntry);
    }

    /**
     * Get current state of the assistant
     */
    getState() {
        return {
            currentLanguage: this.currentLanguage,
            isVoiceChatActive: this.isVoiceChatActive,
            micPermissionGranted: this.micPermissionGranted,
            isInitialized: !!(this.translator && this.chatbot && this.voiceAssistant)
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.voiceAssistant) {
            this.voiceAssistant.endVoiceChat();
        }
        this.logDebug('Financial Saathi destroyed', 'INFO');
    }
}

// ========================================
// SMART TRANSLATION SYSTEM
// ========================================
class SmartTranslationSystem {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.cache = new Map();
        this.supportedLanguages = {
            'en': 'English',
            'hi': 'Hindi', 
            'te': 'Telugu',
            'ta': 'Tamil',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'mr': 'Marathi',
            'pa': 'Punjabi',
            'ur': 'Urdu'
        };
    }

    async detectLanguage(text) {
        if (!text || text.trim().length < 3) return 'en';
        
        // Enhanced pattern matching for Indian languages
        const patterns = {
            'hi': /[\u0900-\u097F]|(?:है|हूं|आप|मैं|यह|वह|और|से|को|का|की|के|में|पर|नहीं|हां|कैसे|क्या|कहां|कब|क्यों)/,
            'te': /[\u0C00-\u0C7F]|(?:అని|ఉంది|వున్నది|చేస్తున్న|వచ్చింది|ఉన్నాను|ఎలా|ఎక్కడ|ఎప్పుడు|ఎందుకు)/,
            'ta': /[\u0B80-\u0BFF]|(?:இருக்கிறது|வருகிறது|செய்கிறது|என்ன|எப்படி|எங்கே|எப்போது|ஏன்)/,
            'bn': /[\u0980-\u09FF]|(?:আছে|করছে|যাচ্ছে|কি|কেমন|কোথায়|কখন|কেন)/,
            'gu': /[\u0A80-\u0AFF]|(?:છે|કરે|આવે|શું|કેવી|ક્યાં|ક્યારે|કેમ)/,
            'mr': /[\u0900-\u097F]|(?:आहे|करतो|येतो|काय|कसे|कुठे|केव्हा|का)/,
            'pa': /[\u0A00-\u0A7F]|(?:ਹੈ|ਕਰਦਾ|ਆਉਂਦਾ|ਕੀ|ਕਿਵੇਂ|ਕਿੱਥੇ|ਕਦੋਂ|ਕਿਉਂ)/,
            'ur': /[\u0600-\u06FF]|(?:ہے|کر|آ|کیا|کیسے|کہاں|کب|کیوں)/
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) {
                return lang;
            }
        }

        if (/^[a-zA-Z\s.,!?'"()-]+$/.test(text)) {
            return 'en';
        }

        return await this.apiDetectLanguage(text);
    }

    async apiDetectLanguage(text) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: `Detect language and respond with 2-letter code only (hi, te, ta, bn, gu, mr, pa, ur, en): "${text}"`
                    }],
                    temperature: 0,
                    max_tokens: 5
                })
            });

            const data = await response.json();
            const detected = data.choices[0].message.content.trim().toLowerCase();
            return this.supportedLanguages[detected] ? detected : 'en';
        } catch (error) {
            console.error('Language detection error:', error);
            return 'en';
        }
    }

    async translateIfNeeded(text, targetLang) {
        if (!text || targetLang === 'en') return text;
        
        const cacheKey = `${text}_${targetLang}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: `Translate to ${this.supportedLanguages[targetLang]}, return only translation: "${text}"`
                    }],
                    temperature: 0.2,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            const translation = data.choices[0].message.content.trim();
            
            this.cache.set(cacheKey, translation);
            return translation;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }
}

// ========================================
// OPTIMIZED CHATBOT
// ========================================
class OptimizedChatbot {
    constructor(apiKey, maxHistory = 6) {
        this.apiKey = apiKey;
        this.conversationHistory = [];
        this.requestInProgress = false;
        this.maxHistory = maxHistory;
    }

    async chat(message, userLanguage = 'en') {
        if (this.requestInProgress) {
            return { 
                response: 'मैं अभी भी सोच रहा हूं... / Still thinking, please wait...',
                detectedLanguage: userLanguage
            };
        }

        this.requestInProgress = true;

        try {
            this.conversationHistory.push({ role: 'user', content: message });
            
            if (this.conversationHistory.length > this.maxHistory) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
            }

            const systemPrompt = {
                role: 'system',
                content: `You are a helpful financial advisor for underprivileged users in India. Always respond in ${this.getLanguageName(userLanguage)}. Be warm, simple, and practical. Focus on savings, budgeting, credit, and financial inclusion. Keep responses under 100 words and use everyday language.`
            };

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [systemPrompt, ...this.conversationHistory],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            const aiResponse = data.choices[0].message.content;
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            return { response: aiResponse, detectedLanguage: userLanguage };
        } catch (error) {
            console.error('Chat error:', error);
            return { 
                response: userLanguage === 'hi' 
                    ? 'माफ करें, मुझे कुछ समस्या हुई। कृपया दोबारा कोशिश करें।'
                    : 'Sorry, I had an issue. Please try again.',
                detectedLanguage: userLanguage,
                isError: true
            };
        } finally {
            this.requestInProgress = false;
        }
    }

    getLanguageName(code) {
        const names = {
            'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil',
            'bn': 'Bengali', 'gu': 'Gujarati', 'mr': 'Marathi', 'pa': 'Punjabi', 'ur': 'Urdu'
        };
        return names[code] || 'English';
    }
}

// ========================================
// ENHANCED VOICE ASSISTANT
// ========================================
class EnhancedVoiceAssistant {
    constructor(chatbot, translator, parent) {
        this.chatbot = chatbot;
        this.translator = translator;
        this.parent = parent;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.shouldKeepListening = false;
        this.processingInput = false;
        
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.dispatchStateChange('error', 'Voice not supported in this browser');
            return;
        }
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = this.getRecognitionLanguage(this.parent.currentLanguage);
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.dispatchStateChange('listening');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (interimTranscript) {
                    document.dispatchEvent(new CustomEvent('interimTranscript', { detail: interimTranscript }));
                }
                
                if (finalTranscript.trim()) {
                    this.handleVoiceInput(finalTranscript.trim());
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                
                if (event.error === 'not-allowed') {
                    this.dispatchStateChange('error', 'Please allow microphone access');
                } else {
                    this.dispatchStateChange('error', `Voice error: ${event.error}`);
                }
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                
                if (this.shouldKeepListening && !this.isSpeaking && !this.processingInput) {
                    setTimeout(() => this.startListening(), 1000);
                }
            };
        } catch (error) {
            console.error('Speech recognition init error:', error);
            this.dispatchStateChange('error', 'Failed to initialize voice');
        }
    }

    async handleVoiceInput(transcript) {
        if (this.processingInput) return;
        
        this.processingInput = true;
        this.dispatchStateChange('processing');
        
        document.dispatchEvent(new CustomEvent('userTranscript', { detail: transcript }));
        this.parent.removeInterimMessage();
        
        try {
            const result = await this.chatbot.chat(transcript, this.parent.currentLanguage);
            
            if (result.response) {
                this.parent.addMessage(result.response, 'assistant');
                
                this.dispatchStateChange('speaking');
                await this.speak(result.response, this.parent.currentLanguage);
            }
            
            this.dispatchStateChange('ready');
        } catch (error) {
            console.error('Voice processing error:', error);
            this.dispatchStateChange('error', 'Processing failed');
            
            const errorMsg = this.parent.getLocalizedText('error_message');
            await this.speak(errorMsg, this.parent.currentLanguage);
            
            this.dispatchStateChange('ready');
        } finally {
            this.processingInput = false;
        }
    }

    async speak(text, language = 'en') {
        if (!text.trim() || this.isSpeaking) return;
        
        this.isSpeaking = true;
        
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
            await this.synthesizeSpeech(text, language);
        } catch (error) {
            console.error('Speech synthesis error:', error);
        } finally {
            this.isSpeaking = false;
        }
    }

    async synthesizeSpeech(text, language) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getVoiceLanguage(language);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            const voices = this.synthesis.getVoices();
            const langVoice = voices.find(voice => 
                voice.lang.startsWith(utterance.lang.split('-')[0])
            );
            
            if (langVoice) {
                utterance.voice = langVoice;
            }
            
            utterance.onend = () => resolve();
            utterance.onerror = (error) => reject(error);
            
            this.synthesis.speak(utterance);
            
            setTimeout(() => {
                if (this.isSpeaking) resolve();
            }, 10000);
        });
    }

    async startVoiceChat() {
        if (!this.parent.micPermissionGranted) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                this.parent.micPermissionGranted = true;
            } catch (error) {
                this.dispatchStateChange('error', 'Microphone access required');
                return false;
            }
        }
        
        this.shouldKeepListening = true;
        this.startListening();
        return true;
    }

    startListening() {
        if (!this.recognition || this.isListening || this.isSpeaking) return;
        
        try {
            this.recognition.lang = this.getRecognitionLanguage(this.parent.currentLanguage);
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start listening:', error);
            if (error.name === 'InvalidStateError') {
                this.isListening = true;
            }
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        this.isListening = false;
    }

    endVoiceChat() {
        this.shouldKeepListening = false;
        this.stopListening();
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.dispatchStateChange('ready');
    }

    getRecognitionLanguage(code) {
        const langCodes = {
            'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN', 'bn': 'bn-IN',
            'gu': 'gu-IN', 'mr': 'mr-IN', 'pa': 'pa-IN', 'ur': 'ur-IN', 'en': 'en-IN'
        };
        return langCodes[code] || 'hi-IN';
    }

    getVoiceLanguage(code) {
        const langCodes = {
            'hi': 'hi-IN', 'te': 'te-IN', 'ta': 'ta-IN', 'bn': 'bn-IN',
            'gu': 'gu-IN', 'mr': 'mr-IN', 'pa': 'pa-IN', 'ur': 'ur-IN', 'en': 'en-IN'
        };
        return langCodes[code] || 'hi-IN';
    }

    dispatchStateChange(state, data = null) {
        document.dispatchEvent(new CustomEvent('voiceStateChanged', { 
            detail: { state, data } 
        }));
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FinancialSaathi;
} else {
    window.FinancialSaathi = FinancialSaathi;
}