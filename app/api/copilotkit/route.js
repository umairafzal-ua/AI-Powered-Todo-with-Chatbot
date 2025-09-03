import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

// Create an OpenAI SDK client that points to OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  // OpenRouter recommends these headers to identify your app
  defaultHeaders: {
    "HTTP-Referer": process.env.PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "AI Todo App",
  },
});

// Pick a widely-available, low-cost/free model on OpenRouter
const MODEL = "meta-llama/llama-3-8b-instruct"; // you can change later

const runtime = new CopilotRuntime();

// IMPORTANT: pass the OpenAI client instance to the adapter
const serviceAdapter = new OpenAIAdapter({
  openai,
  model: MODEL,
  keepSystemRole: true,
});

export const POST = async (req = new NextRequest()) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
