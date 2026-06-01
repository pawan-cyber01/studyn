import { useAIStore } from "@/store/useAIStore";

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chat(message: string | AIMessage[], systemPrompt?: string) {
  const { provider, apiKeys, model: storedModel } = useAIStore.getState();
  const apiKey = apiKeys[provider];

  // Fix model mismatch if persisted state is wrong
  let model = storedModel;
  if (provider === 'groq' && model.startsWith('gemini')) {
    model = 'llama-3.3-70b-versatile';
  } else if (provider === 'gemini' && model.startsWith('llama')) {
    model = 'gemini-1.5-flash';
  }

  if (!apiKey) {
    throw new Error(`API Key for ${provider} is missing. Please add it in Settings.`);
  }

  try {
    switch (provider) {
      case 'gemini':
        return await callGemini(message, apiKey, model, systemPrompt);
      case 'groq':
        // Double check model safety here
        const safeModel = model.startsWith('gemini') ? 'llama-3.3-70b-versatile' : model;
        return await callGroq(message, apiKey, safeModel, systemPrompt);
      case 'openrouter':
        return await callOpenRouter(message, apiKey, model, systemPrompt);
      default:
        throw new Error('Unsupported provider');
    }
  } catch (error: unknown) {
    console.error(`AI Error (${provider}):`, error);
    throw error;
  }
}

export function useAI() {
  return { chat };
}

async function callGemini(message: string | AIMessage[], key: string, model: string, systemPrompt?: string) {
  // Support both string and array messages for flexibility
  const prompt = typeof message === 'string' ? message : JSON.stringify(message);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${systemPrompt ? systemPrompt + '\n\n' : ''}${prompt}` }]
      }]
    })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini Error');
  return data.candidates[0].content.parts[0].text;
}

async function callGroq(message: string | AIMessage[], key: string, model: string, systemPrompt?: string) {
  const messages = typeof message === 'string' 
    ? [...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []), { role: 'user', content: message }]
    : message;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Groq Error');
  return data.choices[0].message.content;
}

async function callOpenRouter(message: string | AIMessage[], key: string, model: string, systemPrompt?: string) {
  const messages = typeof message === 'string' 
    ? [...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []), { role: 'user', content: message }]
    : message;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://studyn.ai',
      'X-Title': 'Studyn OS'
    },
    body: JSON.stringify({
      model: model || 'google/gemini-flash-1.5',
      messages
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenRouter Error');
  return data.choices[0].message.content;
}
