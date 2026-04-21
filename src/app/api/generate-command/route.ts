import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Mock mode
      console.warn("No Gemini API key found. Using mock response.");
      let cmd = 'echo "API key not configured"';
      if (prompt.includes('list') || prompt.includes('show')) cmd = 'ls -la';
      if (prompt.includes('delete') || prompt.includes('remove')) cmd = 'rm -rf ./temp';
      return NextResponse.json({ command: cmd });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a Linux command generator. Convert the user input into a safe bash command. Avoid destructive operations unless explicitly requested. Output ONLY the command, no markdown formatting, no backticks, no explanations.",
        temperature: 0,
      }
    });

    const command = response.text?.trim() || '';
    return NextResponse.json({ command });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
