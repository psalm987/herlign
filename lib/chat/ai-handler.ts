/**
 * AI Handler
 * 
 * Manages AI provider integration for chat bot responses
 * Supports OpenAI, Gemini, and DeepSeek
 */

import { Database } from '../supabase/database.types';

type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    content: string;
    error?: string;
}

/**
 * System prompt for the AI bot
 */
const SYSTEM_PROMPT = `You are a helpful career coach for Herlign, a women's career community platform. Your role is to:

- Provide supportive and empowering career advice for women
- Answer questions about career development, job searching, and professional growth
- Share insights about workshops, events, and resources available on Herlign
- Maintain a warm, professional, and encouraging tone
- If you don't know something specific about Herlign, be honest and suggest contacting support
- Keep responses concise and actionable

Always prioritize being helpful, respectful, and empowering to women in their career journeys.`;

/**
 * Converts chat messages to AI format
 * 
 * @param messages - Database chat messages
 * @returns AI-formatted messages
 */
function convertMessagesToAIFormat(messages: ChatMessage[]): AIMessage[] {
    return messages.map((msg) => ({
        role: msg.sender_type === 'guest' ? 'user' : 'assistant',
        content: msg.content,
    }));
}

/**
 * Gets AI response using OpenAI
 * 
 * @param messages - Conversation history
 * @returns AI response
 */
async function getOpenAIResponse(messages: AIMessage[]): Promise<AIResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'OpenAI API key not configured' };
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            return { content: '', error: `OpenAI error: ${error}` };
        }

        const data = await response.json();
        return {
            content: data.choices[0]?.message?.content || 'No response generated',
        };
    } catch (error) {
        return {
            content: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Gets AI response using Google Gemini
 * 
 * @param messages - Conversation history
 * @returns AI response
 */
async function getGeminiResponse(messages: AIMessage[]): Promise<AIResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'Gemini API key not configured' };
    }

    try {
        // Combine system prompt with conversation
        const prompt = `${SYSTEM_PROMPT}\n\n${messages
            .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n')}\n\nAssistant:`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            return { content: '', error: `Gemini error: ${error}` };
        }

        const data = await response.json();
        return {
            content:
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                'No response generated',
        };
    } catch (error) {
        return {
            content: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Gets AI response using DeepSeek
 * 
 * @param messages - Conversation history
 * @returns AI response
 */
async function getDeepSeekResponse(messages: AIMessage[]): Promise<AIResponse> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'DeepSeek API key not configured' };
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages,
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            return { content: '', error: `DeepSeek error: ${error}` };
        }

        const data = await response.json();
        return {
            content: data.choices[0]?.message?.content || 'No response generated',
        };
    } catch (error) {
        return {
            content: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Gets AI response using the configured provider
 * 
 * @param chatMessages - Database chat messages
 * @returns AI response
 */
export async function getAIResponse(
    chatMessages: ChatMessage[]
): Promise<AIResponse> {
    const messages = convertMessagesToAIFormat(chatMessages);

    // Determine which AI provider to use based on available API keys
    if (process.env.OPENAI_API_KEY) {
        return getOpenAIResponse(messages);
    } else if (process.env.GEMINI_API_KEY) {
        return getGeminiResponse(messages);
    } else if (process.env.DEEPSEEK_API_KEY) {
        return getDeepSeekResponse(messages);
    } else {
        return {
            content: '',
            error: 'No AI provider configured. Please set an API key.',
        };
    }
}

/**
 * Gets a fallback response when AI is unavailable
 * 
 * @returns Fallback message
 */
export function getFallbackResponse(): string {
    return "I'm currently unavailable. Please try again later or contact our support team for assistance.";
}
