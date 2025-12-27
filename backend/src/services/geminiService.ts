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

type ListModelsResponse = {
  models?: Array<{
    name?: string;
    supportedGenerationMethods?: string[];
  }>;
};

const DEFAULT_SYSTEM_INSTRUCTION = `
You are MermaidGenie Assistant. When given a user description of a UML class diagram, output ONLY the Mermaid diagram code.
Start with \`\`\`mermaid\` and end with \`\`\`.
Do not include any extra explanation. Your response MUST be a valid Mermaid code block that can be rendered in a Mermaid diagram viewer.
It MUST be a complete and valid Mermaid code block - you must NOT return invalid or malformed Mermaid code.
`;

const MODEL_LIST_ENDPOINT = "https://generativelanguage.googleapis.com/v1/models";
const MODEL_CACHE_TTL_MS = 5 * 60 * 1000;
const MODEL_NAME_PREFIX = "models/";
const DISALLOWED_MODEL_MARKERS = ["embedding", "-pro"];

let cachedModels: string[] | null = null;
let cachedModelsAt = 0;
let modelCursor = 0;

const isUsableGeminiModel = (model: {
  name?: string;
  supportedGenerationMethods?: string[];
}): model is { name: string; supportedGenerationMethods?: string[] } => {
  if (!model.name) return false;
  const lowerName = model.name.toLowerCase();
  if (!lowerName.includes("gemini")) return false;
  if (DISALLOWED_MODEL_MARKERS.some((marker) => lowerName.includes(marker)))
    return false;
  if (
    Array.isArray(model.supportedGenerationMethods) &&
    !model.supportedGenerationMethods.includes("generateContent")
  )
    return false;
  return true;
};

const normalizeModelName = (name: string) =>
  name.startsWith(MODEL_NAME_PREFIX)
    ? name.slice(MODEL_NAME_PREFIX.length)
    : name;

const fetchAvailableGeminiModels = async (
  apiKey: string,
): Promise<string[]> => {
  const response = await fetch(
    `${MODEL_LIST_ENDPOINT}?key=${encodeURIComponent(apiKey)}`,
  );
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const suffix = body ? ` - ${body}` : "";
    throw new Error(
      `Failed to list Gemini models: ${response.status} ${response.statusText}${suffix}`,
    );
  }

  const data = (await response.json()) as ListModelsResponse;
  const rawModels = Array.isArray(data.models) ? data.models : [];
  const names: string[] = [];
  const seen = new Set<string>();

  for (const model of rawModels) {
    if (!isUsableGeminiModel(model)) continue;
    const normalized = normalizeModelName(model.name);
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    names.push(normalized);
  }

  if (!names.length) {
    throw new Error("No usable Gemini models found from API");
  }

  return names;
};

const getAvailableGeminiModels = async (apiKey: string): Promise<string[]> => {
  const now = Date.now();
  if (cachedModels && now - cachedModelsAt < MODEL_CACHE_TTL_MS) {
    return cachedModels;
  }

  try {
    const models = await fetchAvailableGeminiModels(apiKey);
    cachedModels = models;
    cachedModelsAt = now;
    if (modelCursor >= models.length) modelCursor = 0;
    return models;
  } catch (err) {
    if (cachedModels && cachedModels.length) {
      return cachedModels;
    }
    throw err;
  }
};

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
  const models = await getAvailableGeminiModels(apiKey);
  if (!models.length) {
    throw new Error("No available Gemini models to try");
  }

  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 8192,
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

  let lastError: unknown;
  const startIndex = modelCursor % models.length;

  for (let offset = 0; offset < models.length; offset += 1) {
    const modelName = models[(startIndex + offset) % models.length];
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
      });

      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history,
      });

      const result = await chatSession.sendMessage(prompt);
      const raw = result.response?.text;
      if (!raw) {
        throw new Error(`Failed to get text response from Gemini (${modelName})`);
      }

      modelCursor = (startIndex + offset + 1) % models.length;
      return raw().trim();
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${modelName} failed, trying next model.`, err);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("All Gemini models failed");
}
