import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { command } = await req.json();
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ explanation: `This is a mock explanation for '${command}'. It would normally describe the flags and actions.` });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: command,
      config: {
        systemInstruction: "You are a helpful assistant. Explain the following bash command in simple terms for a beginner. Keep it under 3 sentences.",
        temperature: 0.3,
      }
    });

    const explanation = response.text?.trim() || '';
    return NextResponse.json({ explanation });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
