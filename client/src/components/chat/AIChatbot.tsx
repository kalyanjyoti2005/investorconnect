import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAI, MessageHistory } from "@/hooks/use-ai";
import {
  Bot,
  Send,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  FileText,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Loader2,
} from "lucide-react";

// Define the types for messages
interface MessageBase {
  id: string;
  text: string;
  timestamp: Date;
}

interface BotMessage extends MessageBase {
  type: 'bot';
  suggestions?: string[];
  links?: {
    text: string;
    url: string;
  }[];
}

interface UserMessage extends MessageBase {
  type: 'user';
}

type Message = BotMessage | UserMessage;

// Type guard functions
function isBotMessage(message: Message): message is BotMessage {
  return message.type === 'bot';
}

// Utility functions
const isUserMessage = (message: Message): message is UserMessage => {
  return !isBotMessage(message);
};

// Sample starter messages and suggestions
const starterMessages: BotMessage[] = [
  {
    id: 'welcome',
    type: 'bot',
    text: "👋 Hi there! I'm your StartupMatch AI Assistant. I can help with investment tips, startup questions, or connect you with mentors. What can I help you with today?",
    timestamp: new Date(),
    suggestions: [
      "How to improve my pitch deck?",
      "Tips for finding investors",
      "Ways to value my startup",
      "Help with financial projections"
    ]
  }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use the AI hook
  const { chatbotMutation, generateSuggestionsMutation, isLoading } = useAI();
  
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  // Convert messages to the format required by the AI API
  const getMessageHistory = (): MessageHistory[] => {
    return messages
      .filter(msg => msg.id !== 'welcome') // Skip the welcome message
      .map(msg => ({
        role: isUserMessage(msg) ? 'user' : 'assistant',
        content: msg.text
      }));
  };
  
  // Generate suggestions based on message history
  const generateSuggestions = async () => {
    if (messages.length < 2) return; // Need at least one exchange
    
    try {
      const messageTexts = messages.map(msg => msg.text);
      const suggestions = await generateSuggestionsMutation.mutateAsync(messageTexts);
      
      // Update the last bot message with new suggestions
      setMessages(prev => {
        const lastBotMessageIndex = [...prev].reverse().findIndex(msg => !isUserMessage(msg));
        if (lastBotMessageIndex === -1) return prev;
        
        const actualIndex = prev.length - 1 - lastBotMessageIndex;
        const updatedMessages = [...prev];
        const lastBotMessage = updatedMessages[actualIndex] as BotMessage;
        
        updatedMessages[actualIndex] = {
          ...lastBotMessage,
          suggestions
        };
        
        return updatedMessages;
      });
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    }
  };
  
  // Handle sending a message
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: UserMessage = {
      type: 'user',
      id: `user-${Date.now()}`,
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate bot typing
    setIsTyping(true);
    
    try {
      // Get message history for context
      const history = getMessageHistory();
      
      // Call the AI API
      const response = await chatbotMutation.mutateAsync({
        prompt: text,
        history
      });
      
      // Create bot response
      const botResponse: BotMessage = {
        type: 'bot',
        id: `bot-${Date.now()}`,
        text: response,
        timestamp: new Date(),
        suggestions: [] // Will be filled by generateSuggestions
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Generate suggestions for the response
      setTimeout(() => {
        generateSuggestions();
      }, 500);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Fallback response in case of error
      const errorResponse: BotMessage = {
        type: 'bot',
        id: `bot-${Date.now()}`,
        text: "I'm sorry, I encountered an error processing your request. Please try again later.",
        timestamp: new Date(),
        suggestions: ["Try a different question", "Talk to a human", "Refresh the page"]
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Animation variants
  const chatWindowVariants = {
    open: { 
      opacity: 1, 
      y: 0,
      height: 'auto',
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
    closed: { 
      opacity: 0, 
      y: 20,
      height: 0,
      transition: { duration: 0.2 }
    },
    minimized: {
      opacity: 1,
      height: '60px',
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Render message bubbles
  const renderMessage = (message: Message, index: number) => {
    const isUser = isUserMessage(message);
    
    return (
      <motion.div
        key={message.id}
        initial="hidden"
        animate="visible"
        variants={fadeInUpVariants}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`
          max-w-[85%] p-3 rounded-lg
          ${isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted rounded-tl-none'}
        `}>
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          
          {!isUser && isBotMessage(message) && message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion: string, i: number) => (
                <Button 
                  key={i} 
                  variant="secondary" 
                  size="sm"
                  className="text-xs py-1 h-auto"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
          
          {!isUser && isBotMessage(message) && message.links && message.links.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.links.map((link: {text: string, url: string}, i: number) => (
                <a 
                  key={i} 
                  href={link.url}
                  className="text-sm text-blue-500 hover:underline block"
                >
                  {link.text} →
                </a>
              ))}
            </div>
          )}
          
          <div className="mt-1 text-right">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        {isUser && (
          <Avatar className="h-8 w-8 ml-2 mt-1 flex-shrink-0">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
    );
  };
  
  return (
    <>
      {/* Floating button to open chatbot */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Button 
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full"
            size="icon"
          >
            <Bot className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
      
      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate={isMinimized ? "minimized" : "open"}
            exit="closed"
            variants={chatWindowVariants}
            className="fixed bottom-4 right-4 w-80 md:w-96 bg-background border rounded-lg shadow-lg overflow-hidden z-50 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary-foreground text-primary">AI</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">StartupMatch Assistant</h3>
                  <div className="flex items-center text-xs opacity-90">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                    Online
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 hover:bg-primary-foreground/10"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <ChevronUp className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 hover:bg-primary-foreground/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Chat content */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-3 max-h-[400px]">
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {(isTyping || isLoading) && (
                    <div className="flex mb-4">
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg inline-flex rounded-tl-none">
                        <motion.div
                          className="flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                {/* Chat input */}
                <div className="p-3 border-t">
                  <form 
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(inputValue);
                    }}
                  >
                    <Input
                      placeholder="Ask a question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="hidden sm:inline">Powered by OpenAI</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}