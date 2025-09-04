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
  console.log("🔑 OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY ? "SET" : "MISSING");
  console.log("🌍 PUBLIC_APP_URL:", process.env.PUBLIC_APP_URL);

  try {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
    });

    return await handleRequest(req);
  } catch (err) {
    console.error("❌ CopilotKit API Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(err) }),
      { status: 500 }
    );
  }
};
w
