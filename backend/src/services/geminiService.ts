// src/services/geminiService.ts
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from "@google/generative-ai";

export type ChatPart = { text: string };
export type ChatMessage = {
  role: "user" | "assistant";
  parts: ChatPart[];
};

const DEFAULT_SYSTEM_INSTRUCTION = `
You are MermaidGenie Assistant. When given a user description of a UML class diagram, output ONLY the Mermaid diagram code.
Start with \`\`\`mermaid\` and end with \`\`\`.
Do not include any extra explanation.
`;

export async function generateMermaidCode(
  prompt: string,
  history: ChatMessage[] = [],
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_AI_API_KEY in environment variables");
  }

  // Initialize the Gemini client
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
  });

  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  // Start the chat session.
  // Note: we pass only user/assistant history here, *not* the system instruction.
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history,
  });

  // Send the user's prompt
  const result = await chatSession.sendMessage(prompt);

  // Extract and return the text
  const raw = result.response?.text;
  if (!raw) {
    throw new Error("Failed to get text response from Gemini");
  }
  // text() is a function
  return raw().trim();
}
