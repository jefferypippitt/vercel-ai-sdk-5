"use client";

import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
    id: "chat",
    experimental_throttle: 50,
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm here to help you. What would you like to know?",
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="mx-auto flex h-screen max-w-5xl flex-col">
      {/* Messages Area */}
      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className="mb-2 font-medium">
                  {message.role === "user" ? "You" : "AI"}:
                </div>
                <div className="space-y-2">
                  {message.role === "user" ? (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  ) : (
                    <MemoizedMarkdown
                      id={message.id}
                      content={message.content}
                    />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Subtle blur overlay at the bottom */}
        <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t to-transparent" />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
            <Input
              className="flex-1"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <Button type="submit" className="group" disabled={isLoading}>
              {isLoading ? (
                <>
                  Please wait
                  <Loader2 className="animate-spin" size={16} />
                </>
              ) : (
                <>
                  Send
                  <ChevronRight
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
