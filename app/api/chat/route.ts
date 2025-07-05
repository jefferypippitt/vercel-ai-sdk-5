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
      "You are a helpful assistant. Respond to the user in Markdown format when appropriate. Use **bold** for emphasis, *italic* for subtle emphasis, `code` for inline code, ```code blocks``` for longer code examples, and # ## ### for headings when organizing information. Keep responses clear and well-structured.",
  });

  return result.toDataStreamResponse();
}
