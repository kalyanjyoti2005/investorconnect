import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "./use-toast";

// Type definitions
export type MessageRole = 'system' | 'user' | 'assistant';

export interface MessageHistory {
  role: MessageRole;
  content: string;
}

export interface ChatbotResponse {
  response: string;
}

export interface GenerateMessageResponse {
  message: string;
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface PitchAnalysis {
  strengths: string[];
  improvements: string[];
  score: number;
  summary: string;
}

export type MessagePurpose = 
  | 'introduction' 
  | 'follow_up' 
  | 'pitch' 
  | 'investment_interest' 
  | 'meeting_request';

// Hook for using AI services
export function useAI() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Chatbot mutation
  const chatbotMutation = useMutation({
    mutationFn: async ({
      prompt,
      context,
      history,
    }: {
      prompt: string;
      context?: string;
      history?: MessageHistory[];
    }) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/ai/chatbot", {
          prompt,
          context,
          history,
        });
        
        const data: ChatbotResponse = await response.json();
        return data.response;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "AI Chatbot Error",
        description: error.message || "Failed to get response from AI",
        variant: "destructive",
      });
    },
  });
  
  // Generate message mutation
  const generateMessageMutation = useMutation({
    mutationFn: async ({
      recipientName,
      purpose,
      additionalContext,
    }: {
      recipientName: string;
      purpose: MessagePurpose;
      additionalContext?: string;
    }) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/ai/generate-message", {
          recipientName,
          purpose,
          additionalContext,
        });
        
        const data: GenerateMessageResponse = await response.json();
        return data.message;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Message Generation Error",
        description: error.message || "Failed to generate message",
        variant: "destructive",
      });
    },
  });
  
  // Generate suggestions mutation
  const generateSuggestionsMutation = useMutation({
    mutationFn: async (messageHistory: string[]) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/ai/suggestions", {
          messageHistory,
        });
        
        const data: SuggestionsResponse = await response.json();
        return data.suggestions;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Suggestions Error",
        description: error.message || "Failed to generate suggestions",
        variant: "destructive",
      });
    },
  });
  
  // Analyze pitch mutation
  const analyzePitchMutation = useMutation({
    mutationFn: async (pitchText: string) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/ai/analyze-pitch", {
          pitchText,
        });
        
        const data: PitchAnalysis = await response.json();
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Pitch Analysis Error",
        description: error.message || "Failed to analyze pitch",
        variant: "destructive",
      });
    },
  });
  
  return {
    isLoading,
    chatbotMutation,
    generateMessageMutation,
    generateSuggestionsMutation,
    analyzePitchMutation,
  };
}