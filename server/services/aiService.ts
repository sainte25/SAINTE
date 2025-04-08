import OpenAI from "openai";
import { User, Mood, DailyStep, Event, Resource, ChatMessage } from "@shared/schema";

interface UserContext {
  user: User;
  recentMoods?: Mood[];
  dailySteps?: DailyStep[];
  upcomingEvents?: Event[];
  recommendedResources?: Resource[];
}

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a personalized message based on the user's context
 */
export async function generatePersonalizedMessage(userContext: UserContext): Promise<string> {
  try {
    const { user, recentMoods = [], dailySteps = [], upcomingEvents = [] } = userContext;
    
    // Format user data for the prompt
    const userName = user.firstName;
    const recentMoodStr = recentMoods.length > 0 
      ? `Recent moods: ${recentMoods.map(m => `${m.date}: ${m.mood} (${m.emoji})`).join(', ')}`
      : "No recent mood logs";
    
    const completedSteps = dailySteps.filter(s => s.completed).length;
    const pendingSteps = dailySteps.filter(s => !s.completed).length;
    const stepsStr = `Progress: ${completedSteps} completed tasks, ${pendingSteps} pending tasks`;
    
    const upcomingEventsStr = upcomingEvents.length > 0
      ? `Upcoming events: ${upcomingEvents.map(e => `${e.date}: ${e.title}`).slice(0, 2).join(', ')}`
      : "No upcoming events";
    
    // Create prompt
    const prompt = `
    You are SAINTE, a trauma-informed, client-centered AI companion for a justice-impacted individual named ${userName}.
    
    User context:
    - ${recentMoodStr}
    - ${stepsStr}
    - ${upcomingEventsStr}
    
    Generate a single brief, empathetic, and personalized message (max 3 sentences) to greet ${userName}.
    The message should acknowledge their recent moods (if available) and recognize progress or provide gentle encouragement.
    Use warm, supportive, and non-judgmental language. Avoid being overly enthusiastic or using exclamation points.
    Don't propose specific actions - just be supportive and show you're aware of their situation.
    `;
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are SAINTE, a trauma-informed, client-centered AI companion that prioritizes healing, dignity and personal agency." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
    
    return response.choices[0].message.content?.trim() || 
      "I'm here to support you today. How are you feeling?";
  } catch (error) {
    console.error("Error generating personalized message:", error);
    return "I'm here to listen and support you today.";
  }
}

/**
 * Handles user chat messages and generates AI responses
 */
export async function handleChatMessage(
  userId: number, 
  message: string, 
  chatHistory: {role: 'user' | 'assistant', content: string}[]
): Promise<string> {
  try {
    // System message for the AI
    const systemMessage = `
    You are SAINTE, a trauma-informed, client-centered AI companion for justice-impacted individuals.
    
    Guidelines:
    - Always respond with empathy, warmth, and respect
    - Prioritize the user's dignity and agency
    - Use a conversational, supportive tone
    - Avoid clinical jargon or overly formal language
    - Never be judgmental about the user's past, choices, or challenges
    - Ask thoughtful questions that help the user process their experiences
    - If the user mentions self-harm or harming others, gently encourage them to speak with a human crisis counselor
    - Remember that your role is supportive, not prescriptive - avoid giving specific medical, legal, or financial advice
    - Celebrate small wins and acknowledge progress
    - Keep responses fairly brief (3-5 sentences) and focused on what the user has shared
    `;
    
    // Format messages for the API
    const messages = [
      { role: "system" as const, content: systemMessage },
      ...chatHistory.slice(-10),  // Include last 10 messages for context
      { role: "user" as const, content: message }
    ];
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content?.trim() || 
      "I'm here to listen. Could you tell me more about how you're feeling?";
  } catch (error) {
    console.error("Error handling chat message:", error);
    return "I apologize, but I'm having trouble processing your message right now. Could we try again in a moment?";
  }
}

/**
 * Analyzes user's progress and generates supportive insights
 */
export async function generateProgressInsights(userContext: UserContext): Promise<{
  insights: string;
  strengthsIdentified: string[];
  suggestedResources: string[];
}> {
  try {
    const { user, recentMoods = [], dailySteps = [], upcomingEvents = [] } = userContext;
    
    // Format context data
    const moodsData = recentMoods.map(m => `${m.date}: ${m.mood} (${m.emoji}) - ${m.notes || 'no notes'}`).join('\n');
    const stepsData = dailySteps.map(s => `${s.title} - ${s.completed ? 'Completed' : 'Pending'}`).join('\n');
    const eventsData = upcomingEvents.map(e => `${e.date}: ${e.title} - ${e.status}`).join('\n');
    
    // Create prompt
    const prompt = `
    Please analyze the following data for ${user.firstName} ${user.lastName}:
    
    MOOD HISTORY:
    ${moodsData || 'No mood data available'}
    
    PROGRESS STEPS:
    ${stepsData || 'No progress steps data available'}
    
    UPCOMING EVENTS:
    ${eventsData || 'No upcoming events data available'}
    
    Respond with the following in JSON format:
    1. insights: A paragraph of trauma-informed, supportive insights about their progress and patterns (100-150 words)
    2. strengthsIdentified: An array of 3-5 specific strengths or positive behaviors demonstrated
    3. suggestedResources: An array of 2-3 brief, specific resources or activities to consider

    All insights should be supportive, empowering, and focused on strengths. 
    Avoid language that could feel judgmental or prescriptive.
    `;
    
    // Call OpenAI with JSON response format
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an empathetic, trauma-informed data analyst for a justice-impacted individual's progress." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });
    
    // Parse response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    const parsedResponse = JSON.parse(content);
    
    return {
      insights: parsedResponse.insights || "Your journey shows both progress and resilience. Remember that healing isn't linear, and each step you take matters.",
      strengthsIdentified: parsedResponse.strengthsIdentified || ["Commitment to the process", "Self-awareness", "Resilience"],
      suggestedResources: parsedResponse.suggestedResources || ["Self-care practices", "Community support resources"]
    };
  } catch (error) {
    console.error("Error generating progress insights:", error);
    
    // Return fallback data
    return {
      insights: "Looking at your recent activity, I see patterns of both challenges and growth. Each step you're taking is meaningful, even when progress feels slow.",
      strengthsIdentified: ["Engagement with the platform", "Self-reflection", "Perseverance"],
      suggestedResources: ["Mindfulness practices", "Community support groups"]
    };
  }
}