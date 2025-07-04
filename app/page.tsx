"use client";

import { useChat } from "@ai-sdk/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm here to help you. What would you like to know?",
        },
      ],
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="whitespace-pre-wrap">
                <div className="font-medium mb-1">
                  {message.role === "user" ? "You" : "AI"}:
                </div>
                <div>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Subtle blur overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
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
