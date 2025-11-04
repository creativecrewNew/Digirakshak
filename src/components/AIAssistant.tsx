import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChatMessage, Language } from '../types';
import { t } from '../utils/translations';
import { generateAIResponse } from '../utils/aiResponses';
import { toast } from 'sonner@2.0.3';

interface AIAssistantProps {
  language: Language;
}

export function AIAssistant({ language }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingMessageId, setCurrentSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with greeting
    const greeting: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: t('aiGreeting', language),
      timestamp: new Date(),
      language,
    };
    setMessages([greeting]);

    // Initialize Speech Recognition - only when user explicitly requests
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      const languageMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        pa: 'pa-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        bn: 'bn-IN',
        gu: 'gu-IN',
        bho: 'hi-IN',
        hne: 'hi-IN',
      };
      
      // IMPORTANT: Set the language for speech recognition
      const recognitionLang = languageMap[language] || 'en-IN';
      recognitionRef.current.lang = recognitionLang;
      
      console.log('Speech recognition language set to:', recognitionLang);

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized text:', transcript);
        setInput(transcript);
        setIsListening(false);
        
        // Show success toast
        toast.success(
          language === 'hi' 
            ? `सुना गया: ${transcript}` 
            : `Heard: ${transcript}`,
          { duration: 3000 }
        );
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          const errorMessages: Record<Language, Record<string, string>> = {
            hi: {
              'no-speech': 'कोई आवाज़ नहीं सुनी गई',
              'audio-capture': 'माइक्रोफ़ोन एक्सेस नहीं मिला',
              'not-allowed': 'माइक्रोफ़ोन की अनुमति अस्वीकृत',
              'network': 'नेटवर्क त्रुटि',
              default: 'आवाज़ पहचान त्रुटि'
            },
            en: {
              'no-speech': 'No speech detected',
              'audio-capture': 'Microphone not accessible',
              'not-allowed': 'Microphone permission denied',
              'network': 'Network error',
              default: 'Voice recognition error'
            }
          };
          
          const messages = errorMessages[language] || errorMessages.en;
          const errorMsg = messages[event.error] || messages.default;
          toast.error(errorMsg);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started for language:', recognitionLang);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]); // Re-initialize when language changes

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (text: string, messageId: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error(language === 'hi' ? 'आवाज़ समर्थित नहीं है' : 'Speech not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // If clicking on already speaking message, stop it
    if (isSpeaking && currentSpeakingMessageId === messageId) {
      setIsSpeaking(false);
      setCurrentSpeakingMessageId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const languageMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      pa: 'pa-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      bho: 'hi-IN',
      hne: 'hi-IN',
    };
    utterance.lang = languageMap[language] || 'en-IN';
    utterance.rate = 0.9;
    
    setIsSpeaking(true);
    setCurrentSpeakingMessageId(messageId);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(userInput, language),
        timestamp: new Date(),
        language,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error(language === 'hi' ? 'आवाज़ पहचान समर्थित नहीं है' : 'Voice recognition not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Request microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          toast.success(language === 'hi' ? 'सुन रहा हूं...' : 'Listening...', { duration: 2000 });
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          setIsListening(false);
        }
      })
      .catch((error) => {
        console.error('Microphone permission denied:', error);
        toast.error(
          language === 'hi' 
            ? 'माइक्रोफोन की अनुमति आवश्यक है' 
            : 'Microphone permission required',
          { duration: 3000 }
        );
      });
  };

  const exampleQuestions = [
    t('q1', language),
    t('q2', language),
    t('q3', language),
    t('q4', language),
  ];

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background via-yellow-50/30 to-background dark:from-background dark:via-yellow-950/5 dark:to-background">
      {/* Header */}
      <div className="p-4 border-b bg-card/95 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-yellow-500 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="flex items-center gap-2">
                {t('chatWithAI', language)}
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </h2>
              <p className="text-xs text-muted-foreground">{language === 'hi' ? 'आपके सवालों के जवाब' : 'Answers to your questions'}</p>
            </div>
          </div>
          {/* Language Badge */}
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
            <Mic className="w-3 h-3 mr-1" />
            {language.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
        <div className="space-y-4 max-w-3xl mx-auto pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="p-2 bg-gradient-to-br from-primary/10 to-yellow-500/10 rounded-lg h-fit flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              
              <div className="flex flex-col gap-2 max-w-[80%]">
                <Card
                  className={`p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md'
                      : 'bg-card border-yellow-200/50 dark:border-yellow-900/30'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>

                {/* Voice button for assistant messages */}
                {message.role === 'assistant' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className={`self-start ${
                      isSpeaking && currentSpeakingMessageId === message.id
                        ? 'bg-primary/10 border-primary text-primary'
                        : ''
                    }`}
                    onClick={() => speakMessage(message.content, message.id)}
                  >
                    {isSpeaking && currentSpeakingMessageId === message.id ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'रोकें' : 'Stop'}
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        {language === 'hi' ? 'सुनें' : 'Listen'}
                      </>
                    )}
                  </Button>
                )}
              </div>

              {message.role === 'user' && (
                <div className="p-2 bg-secondary/50 rounded-lg h-fit flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="p-2 bg-gradient-to-br from-primary/10 to-yellow-500/10 rounded-lg h-fit">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <Card className="p-4 bg-card">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="max-w-3xl mx-auto mt-6">
            <p className="text-sm mb-3 text-center">{t('exampleQuestions', language)}</p>
            <div className="grid grid-cols-1 gap-3">
              {exampleQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="text-left justify-start h-auto py-4 px-4 border-2 border-yellow-200 dark:border-yellow-900/30 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 hover:border-primary"
                  onClick={() => handleExampleClick(question)}
                >
                  <span className="text-base">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="p-4 border-t bg-card/95 backdrop-blur-sm flex-shrink-0">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Button
            variant="outline"
            size="lg"
            className={`shrink-0 ${
              isListening 
                ? 'bg-red-100 dark:bg-red-950/20 border-red-300 dark:border-red-900 animate-pulse' 
                : 'border-yellow-200 dark:border-yellow-900/30'
            }`}
            onClick={toggleVoiceInput}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-red-500" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('askQuestion', language)}
            className="text-base py-6 border-yellow-200 dark:border-yellow-900/30 focus:border-primary"
          />
          
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="lg"
            className="shrink-0 bg-gradient-to-r from-primary to-primary/90 px-6"
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
        {isListening && (
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <p className="text-sm text-center text-muted-foreground">
              {language === 'hi' ? 'सुन रहा हूं... अभी बोलें' : 'Listening... Speak now'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}