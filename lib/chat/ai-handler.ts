/**
 * AI Handler
 * 
 * Manages AI provider integration for chat bot responses
 * Supports OpenAI, Gemini, and DeepSeek
 */

import { Database } from '../supabase/database.types';
import { buildDynamicContext, HERLIGN_KNOWLEDGE } from './context-builder';

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
const SYSTEM_PROMPT = `You are a helpful career coach and community assistant for Herlign Female Creatives (Herlign FC), a women's career community platform.

ABOUT HERLIGN FC:
${HERLIGN_KNOWLEDGE.mission}

${HERLIGN_KNOWLEDGE.tagline}

OUR 5 CORE VALUES:
${HERLIGN_KNOWLEDGE.values.map(v => `- ${v.name}: ${v.description}`).join('\n')}

WHO WE SERVE:
${HERLIGN_KNOWLEDGE.audience}

YOUR ROLE:
- Provide supportive and empowering career advice for women
- Answer questions about career development, job searching, and professional growth
- Recommend relevant events, workshops, resources, and podcasts from our platform
- Share insights about Herlign FC's mission, values, and community
- Maintain a warm, professional, and encouraging tone
- Keep responses concise and actionable (unless asked for detailed information)
- Always include relevant links when recommending content

RESPONSE GUIDELINES:
1. Be brief by default - provide short answers with relevant links
2. Only give extensive details if specifically requested
3. When recommending content, always include clickable links
4. Be context-aware - understand what the user is really asking for
5. Use a seamless, conversational flow
6. Prioritize being helpful, respectful, and empowering

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
 * @param dynamicContext - Dynamic context from database
 * @returns AI response
 */
async function getOpenAIResponse(messages: AIMessage[], dynamicContext: string): Promise<AIResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'OpenAI API key not configured' };
    }

    try {
        // Add dynamic context to system prompt if available
        const systemPrompt = dynamicContext
            ? `${SYSTEM_PROMPT}\n\nCONTEXT FOR THIS QUERY:${dynamicContext}`
            : SYSTEM_PROMPT;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
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
 * @param dynamicContext - Dynamic context from database
 * @returns AI response
 */
async function getGeminiResponse(messages: AIMessage[], dynamicContext: string): Promise<AIResponse> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'Gemini API key not configured' };
    }

    try {
        // Add dynamic context to system prompt if available
        const systemPrompt = dynamicContext
            ? `${SYSTEM_PROMPT}\n\nCONTEXT FOR THIS QUERY:${dynamicContext}`
            : SYSTEM_PROMPT;

        // Combine system prompt with conversation
        const prompt = `${systemPrompt}\n\n${messages
            .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n')}\n\nAssistant:`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
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
 * Get response from DeepSeek API
 * 
 * @param messages - Conversation history
 * @param dynamicContext - Dynamic context from database
 * @returns AI response
 */
async function getDeepSeekResponse(messages: AIMessage[], dynamicContext: string): Promise<AIResponse> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        return { content: '', error: 'DeepSeek API key not configured' };
    }

    try {
        // Add dynamic context to system prompt if available
        const systemPrompt = dynamicContext
            ? `${SYSTEM_PROMPT}\n\nCONTEXT FOR THIS QUERY:\n${dynamicContext}`
            : SYSTEM_PROMPT;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
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

    // Build dynamic context from latest user message
    const latestUserMessage = chatMessages.filter(m => m.sender_type === 'guest').pop();
    const dynamicContext = latestUserMessage
        ? await buildDynamicContext(latestUserMessage.content)
        : '';

    // Determine which AI provider to use based on available API keys
    if (process.env.OPENAI_API_KEY) {
        return getOpenAIResponse(messages, dynamicContext);
    } else if (process.env.GEMINI_API_KEY) {
        return getGeminiResponse(messages, dynamicContext);
    } else if (process.env.DEEPSEEK_API_KEY) {
        return getDeepSeekResponse(messages, dynamicContext);
    } else {
        return {
            content: '',
            error: 'No AI provider configured. Please set an API key.',
        };
    }
}

/**
 * Fallback messages for when AI is unavailable
 */
const FALLBACK_MESSAGES = [
    "I'm currently unavailable. Please try again later or contact our support team for assistance.",
    "Our AI assistant is taking a quick break. Please reach out to our support team for immediate help.",
    "I'm temporarily offline, but our support team is always here to assist you!",
    "Oops! I'm experiencing technical difficulties. Contact our support team for personalized assistance.",
    "I'm not available right now, but don't worry—our support team can help with your question.",
    "Our chatbot is currently unavailable. Please connect with our support team for expert guidance.",
    "I'm taking a moment to recharge. In the meantime, our support team is ready to help!",
    "Technical issues are preventing me from responding. Please reach out to our support team.",
    "I'm temporarily out of service. Contact our support team for immediate career guidance.",
    "Sorry for the inconvenience! Our support team is available to answer your questions.",
    "I'm currently offline. Please try again soon or contact our support team for help.",
    "Our AI is temporarily unavailable. Connect with our support team for personalized advice.",
    "I'm experiencing connectivity issues. Our support team is here to assist you right away.",
    "I'm not responding at the moment. Please reach out to our support team for guidance.",
    "Our chatbot is down temporarily. Contact our support team for expert assistance.",
    "I'm currently unavailable, but our amazing support team can help you out!",
    "Technical difficulties are affecting my responses. Please contact our support team.",
    "I'm offline right now. Our support team is standing by to help with your career questions.",
    "Sorry, I can't assist at the moment. Please reach out to our support team.",
    "I'm temporarily unavailable. Connect with our support team for immediate help.",
    "Our AI assistant is offline. Please contact our support team for personalized guidance.",
    "I'm experiencing issues right now. Our support team is ready to assist you!",
    "I'm not available at the moment. Please try again or contact our support team.",
    "Technical problems are preventing my response. Reach out to our support team for help.",
    "I'm currently down for maintenance. Contact our support team for immediate assistance.",
    "Sorry for the delay! Our support team can provide the help you need right now.",
    "I'm temporarily out of reach. Please connect with our support team for guidance.",
    "Our chatbot is experiencing difficulties. Contact our support team for expert advice.",
    "I'm offline temporarily. Our support team is available to answer your questions!",
    "I can't respond right now. Please reach out to our support team for assistance.",
    "Technical issues are affecting me. Contact our support team for personalized help.",
    "I'm currently unavailable. Our support team is here to support your career journey!",
    "Sorry, I'm not responding at the moment. Please contact our support team.",
    "I'm experiencing technical difficulties. Our support team can help you right away.",
    "I'm temporarily offline. Connect with our support team for immediate guidance.",
    "Our AI is currently down. Please reach out to our support team for assistance.",
    "I'm not available right now, but our support team is ready to help!",
    "Technical problems are preventing me from assisting. Contact our support team.",
    "I'm currently out of service. Our support team can provide expert guidance.",
    "Sorry for the inconvenience. Please connect with our support team for help.",
    "I'm temporarily unavailable. Our support team is standing by to assist you!",
    "Our chatbot is offline momentarily. Contact our support team for personalized advice.",
    "I'm experiencing connectivity issues. Reach out to our support team for help.",
    "I'm not responding at this time. Please contact our support team for assistance.",
    "Technical difficulties are affecting the chatbot. Our support team can help!",
    "I'm currently unavailable. Connect with our support team for immediate guidance.",
    "Sorry, I can't help right now. Please reach out to our support team.",
    "I'm temporarily offline. Our support team is here to answer your questions!",
    "Our AI assistant is down. Contact our support team for expert career advice.",
    "I'm experiencing issues. Please connect with our support team for help.",
    "I'm not available at the moment. Our support team is ready to assist you!",
    "Technical problems are affecting me. Please contact our support team.",
    "I'm currently offline for maintenance. Reach out to our support team for help.",
    "Sorry for the delay. Our support team can provide immediate assistance!",
    "I'm temporarily unavailable. Contact our support team for personalized guidance.",
    "Our chatbot is experiencing technical issues. Our support team is here to help!",
    "I'm offline right now. Please connect with our support team for expert advice.",
    "I can't respond currently. Our support team is available to assist you!",
    "Technical difficulties are preventing my response. Contact our support team.",
    "I'm temporarily out of service. Our support team can help with your questions!",
    "Sorry, I'm not available. Please reach out to our support team for guidance.",
    "I'm experiencing connectivity problems. Contact our support team for help.",
    "I'm currently down. Our support team is standing by to assist you!",
    "Our AI is temporarily offline. Please connect with our support team.",
    "I'm not responding at the moment. Our support team can provide expert help!",
    "Technical issues are affecting the chatbot. Contact our support team.",
    "I'm temporarily unavailable. Our support team is ready to guide you!",
    "Sorry for the trouble. Please reach out to our support team for assistance.",
    "I'm offline momentarily. Contact our support team for immediate help!",
    "Our chatbot is down. Our support team can provide personalized advice.",
    "I'm experiencing technical difficulties. Connect with our support team!",
    "I'm not available right now. Our support team is here to help you!",
    "Technical problems are affecting me. Please contact our support team.",
    "I'm currently unavailable. Reach out to our support team for guidance!",
    "Sorry, I can't assist now. Our support team is available for you!",
    "I'm temporarily offline. Contact our support team for expert assistance.",
    "Our AI assistant is experiencing issues. Our support team can help!",
    "I'm offline at the moment. Please connect with our support team.",
    "I can't respond right now. Our support team is ready to assist!",
    "Technical difficulties are preventing responses. Contact our support team.",
    "I'm temporarily down. Our support team can provide immediate help!",
    "Sorry for the inconvenience. Please reach out to our support team.",
    "I'm currently out of service. Contact our support team for guidance!",
    "Our chatbot is offline. Our support team is here to support you!",
    "I'm experiencing connectivity issues. Please contact our support team.",
    "I'm not available currently. Our support team can help right away!",
    "Technical issues are affecting me. Connect with our support team.",
    "I'm temporarily unavailable. Our support team is standing by!",
    "Sorry, I'm offline. Please reach out to our support team for help.",
    "I'm experiencing problems. Contact our support team for assistance!",
    "I'm currently down for updates. Our support team can help you!",
    "Our AI is temporarily offline. Please connect with our support team.",
    "I'm not responding now. Our support team is ready to guide you!",
    "Technical difficulties detected. Contact our support team for help.",
    "I'm temporarily out of reach. Our support team can assist you!",
    "Sorry for the disruption. Please reach out to our support team.",
    "I'm offline right now. Contact our support team for expert guidance!",
    "Our chatbot is unavailable. Our support team is here for you!",
    "I'm experiencing technical issues. Connect with our support team!",
];

/**
 * Gets a fallback response when AI is unavailable
 * 
 * @returns Randomized fallback message
 */
export function getFallbackResponse(): string {
    const randomIndex = Math.floor(Math.random() * FALLBACK_MESSAGES.length);
    return FALLBACK_MESSAGES[randomIndex];
}
