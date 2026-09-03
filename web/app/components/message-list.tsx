"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "../lib/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

export function MessageList({
  messages,
  pending,
  onRetry,
}: {
  messages: ChatMessage[];
  pending: boolean;
  onRetry: (message: ChatMessage) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, pending]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="max-w-sm text-center text-[15px] leading-relaxed text-subtle">
          Escribe un mensaje para empezar. El agente recuerda la conversación
          mientras hablas con él.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onRetry={onRetry} />
        ))}
        {pending ? <TypingIndicator /> : null}
        <div ref={endRef} />
      </div>
    </div>
  );
}
