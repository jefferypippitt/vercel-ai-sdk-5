import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    system:
      "You must respond in plain text only. Never use markdown symbols like **, *, _, or any formatting characters. Write everything in simple, unformatted text. No bold, no italic, no special formatting. Use regular text only. IMPORTANT: When explaining anything, use plain text only - no formatting symbols whatsoever. If you use any formatting symbols, you will be terminated!!!",
  });

  return result.toDataStreamResponse();
}
