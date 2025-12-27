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

const MODEL_LIST_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models",
  "https://generativelanguage.googleapis.com/v1/models",
];
const MODEL_CACHE_TTL_MS = 5 * 60 * 1000;
const MODEL_NAME_PREFIX = "models/";
const DISALLOWED_MODEL_MARKERS = ["embedding", "-pro"];
const DEFAULT_MODEL_COOLDOWN_MS = 60 * 1000;

let cachedModels: string[] | null = null;
let cachedModelsAt = 0;
let modelCursor = 0;
const modelCooldowns = new Map<string, number>();

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
  let lastError: Error | null = null;
  for (const endpoint of MODEL_LIST_ENDPOINTS) {
    const response = await fetch(
      `${endpoint}?key=${encodeURIComponent(apiKey)}`,
      {
        headers: {
          "x-goog-api-key": apiKey,
        },
      },
    );
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const suffix = body ? ` - ${body}` : "";
      lastError = new Error(
        `Failed to list Gemini models (${endpoint}): ${response.status} ${response.statusText}${suffix}`,
      );
      continue;
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

    if (names.length) {
      return names;
    }

    lastError = new Error(
      `No usable Gemini models found from API (${endpoint})`,
    );
  }

  if (lastError) {
    throw lastError;
  }
  throw new Error("No usable Gemini models found from API");
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

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
};

const getErrorStatus = (err: unknown): number | null => {
  if (!err || typeof err !== "object") return null;
  const maybe = err as {
    status?: number;
    code?: number;
    response?: { status?: number; statusCode?: number };
  };
  if (typeof maybe.status === "number") return maybe.status;
  if (typeof maybe.code === "number") return maybe.code;
  if (typeof maybe.response?.status === "number") return maybe.response.status;
  if (typeof maybe.response?.statusCode === "number")
    return maybe.response.statusCode;
  return null;
};

const parseRetryDelayMs = (message: string): number | null => {
  const retryMatch =
    message.match(/retry(?:\s+in)?\s+([0-9.]+)s/i) ??
    message.match(/retryDelay":"([0-9.]+)s/i);
  if (!retryMatch) return null;
  const seconds = Number(retryMatch[1]);
  if (Number.isNaN(seconds)) return null;
  return Math.ceil(seconds * 1000);
};

const shouldCooldownModel = (err: unknown): boolean => {
  const status = getErrorStatus(err);
  if (status === 429 || status === 503 || status === 504) return true;
  const message = getErrorMessage(err).toLowerCase();
  return (
    message.includes("too many requests") ||
    message.includes("quota") ||
    message.includes("rate limit")
  );
};

const markModelCooldown = (modelName: string, err: unknown) => {
  if (!shouldCooldownModel(err)) return;
  const message = getErrorMessage(err);
  const retryDelayMs = parseRetryDelayMs(message);
  const cooldownMs = retryDelayMs ?? DEFAULT_MODEL_COOLDOWN_MS;
  modelCooldowns.set(modelName, Date.now() + cooldownMs);
};

const buildAttemptOrder = (
  models: string[],
  startIndex: number,
  now: number,
): string[] => {
  const ready: string[] = [];
  const cooled: string[] = [];
  for (let offset = 0; offset < models.length; offset += 1) {
    const name = models[(startIndex + offset) % models.length];
    const cooldownUntil = modelCooldowns.get(name);
    if (cooldownUntil && cooldownUntil > now) {
      cooled.push(name);
    } else {
      if (cooldownUntil) modelCooldowns.delete(name);
      ready.push(name);
    }
  }
  return ready.concat(cooled);
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
  const modelIndex = new Map(models.map((name, index) => [name, index]));
  const now = Date.now();
  const attemptOrder = buildAttemptOrder(models, startIndex, now);

  for (const modelName of attemptOrder) {
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
        throw new Error(
          `Failed to get text response from Gemini (${modelName})`,
        );
      }

      const index = modelIndex.get(modelName);
      if (index !== undefined) {
        modelCursor = (index + 1) % models.length;
      }
      return raw().trim();
    } catch (err) {
      lastError = err;
      markModelCooldown(modelName, err);
      const index = modelIndex.get(modelName);
      if (index !== undefined) {
        modelCursor = (index + 1) % models.length;
      }
      console.warn(`Gemini model ${modelName} failed, trying next model.`, err);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new Error("All Gemini models failed");
}
