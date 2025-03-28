import OpenAI from 'openai';
import { log } from './vite';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Message history interface
interface MessageHistory {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// AI Service class to handle OpenAI interactions
export class AIService {
  // Generate a response using OpenAI's API
  static async generateResponse(prompt: string, context: string = '', history: MessageHistory[] = []): Promise<string> {
    try {
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant for StartupMatch, a platform connecting startup founders with investors. 
        ${context}
        Provide helpful, concise, and knowledgeable responses focused on startup growth, investment, and entrepreneurship.
        Be professional but conversational.`,
      };
      
      const messages = [
        systemMessage,
        ...history,
        { role: 'user', content: prompt },
      ];
      
      log(`Sending request to OpenAI: ${prompt.substring(0, 50)}...`, 'ai');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as any,
        max_tokens: 500,
        temperature: 0.7,
      });
      
      const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response at this time.';
      log(`Received response from OpenAI: ${response.substring(0, 50)}...`, 'ai');
      
      return response;
    } catch (error) {
      log(`Error in generateResponse: ${error}`, 'ai');
      return 'I apologize, but I encountered an error processing your request. Please try again later.';
    }
  }
  
  // Generate automated messages for a specific context
  static async generateAutomatedMessage(context: {
    recipientName: string;
    senderName: string;
    purpose: 'introduction' | 'follow_up' | 'pitch' | 'investment_interest' | 'meeting_request';
    additionalContext?: string;
  }): Promise<string> {
    try {
      const purposeDescriptions = {
        introduction: 'a professional introduction to establish initial connection',
        follow_up: 'following up on a previous conversation',
        pitch: 'pitching a startup idea or business',
        investment_interest: 'expressing interest in investment opportunity',
        meeting_request: 'requesting a meeting or call to discuss further',
      };
      
      const prompt = `Write a professional, concise message from ${context.senderName} to ${context.recipientName} for ${purposeDescriptions[context.purpose]}. ${context.additionalContext || ''}`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert assistant that writes professional, personalized messages for startup founders and investors. Write in a concise, clear and professional tone.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 250,
        temperature: 0.7,
      });
      
      return completion.choices[0]?.message?.content || 'Unable to generate message.';
    } catch (error) {
      log(`Error in generateAutomatedMessage: ${error}`, 'ai');
      return 'I apologize, but I encountered an error generating the message. Please try writing it manually.';
    }
  }
  
  // Generate suggestions based on message history
  static async generateSuggestions(messageHistory: string[]): Promise<string[]> {
    try {
      const prompt = `Based on the following conversation, generate 3 short, helpful response suggestions (each under 10 words):\n\n${messageHistory.join('\n')}`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that generates short, helpful reply suggestions for a business chat. Generate exactly 3 suggestions, each 2-10 words, separated by line breaks.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });
      
      const response = completion.choices[0]?.message?.content || '';
      const suggestions = response
        .split('\n')
        .map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 3);
      
      return suggestions;
    } catch (error) {
      log(`Error in generateSuggestions: ${error}`, 'ai');
      return ['Let\'s schedule a call', 'Tell me more', 'Sounds interesting'];
    }
  }
  
  // Analyze startup pitch for feedback
  static async analyzePitch(pitchText: string): Promise<{
    strengths: string[];
    improvements: string[];
    score: number;
    summary: string;
  }> {
    try {
      const prompt = `Analyze this startup pitch and provide feedback:\n\n${pitchText}\n\nProvide analysis in JSON format with the following structure:
      {
        "strengths": ["strength1", "strength2", "strength3"],
        "improvements": ["improvement1", "improvement2", "improvement3"],
        "score": (a number between 1-10),
        "summary": "A brief 2-3 sentence summary of overall feedback"
      }`;
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert startup pitch analyzer. Provide balanced, constructive feedback focused on helping founders improve.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });
      
      const response = completion.choices[0]?.message?.content || '';
      
      try {
        // Extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : '';
        const result = JSON.parse(jsonString);
        
        return {
          strengths: Array.isArray(result.strengths) ? result.strengths : [],
          improvements: Array.isArray(result.improvements) ? result.improvements : [],
          score: typeof result.score === 'number' ? result.score : 5,
          summary: typeof result.summary === 'string' ? result.summary : 'Analysis could not be completed.',
        };
      } catch (jsonError) {
        log(`Error parsing JSON response: ${jsonError}`, 'ai');
        return {
          strengths: ['Clear problem statement', 'Identified target market', 'Unique approach'],
          improvements: ['Add more details about traction', 'Clarify revenue model', 'Strengthen competitive analysis'],
          score: 6,
          summary: 'The pitch has solid fundamentals but needs refinement in specific areas mentioned above.'
        };
      }
    } catch (error) {
      log(`Error in analyzePitch: ${error}`, 'ai');
      return {
        strengths: ['Clear problem statement', 'Identified target market', 'Unique approach'],
        improvements: ['Add more details about traction', 'Clarify revenue model', 'Strengthen competitive analysis'],
        score: 6,
        summary: 'The pitch has solid fundamentals but needs refinement in specific areas mentioned above.'
      };
    }
  }
}