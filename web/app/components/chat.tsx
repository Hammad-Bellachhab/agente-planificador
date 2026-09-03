"use client";

import { useCallback, useState } from "react";
import { enviarMensaje, NucleoApiError } from "../lib/api";
import type { ChatMessage } from "../lib/types";
import { ChatComposer } from "./chat-composer";
import { MessageList } from "./message-list";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);

  // Envía userMessage al backend y refleja el resultado en su propio estado.
  // Compartido por send() (mensaje nuevo) y retry() (reintento in situ).
  const deliver = useCallback(async (userMessage: ChatMessage) => {
    setPending(true);
    try {
      const { respuesta } = await enviarMensaje(userMessage.content);
      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === userMessage.id
            ? { ...m, status: "sent" as const, error: undefined }
            : m,
        ),
        {
          id: createId(),
          role: "agent" as const,
          content: respuesta,
          status: "sent" as const,
        },
      ]);
    } catch (err) {
      const reason =
        err instanceof NucleoApiError
          ? err.message
          : "Ocurrió un error inesperado.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id
            ? { ...m, status: "error" as const, error: reason }
            : m,
        ),
      );
    } finally {
      setPending(false);
    }
  }, []);

  const send = useCallback(
    (content: string) => {
      if (pending) return;
      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content,
        status: "sending",
      };
      setMessages((prev) => [...prev, userMessage]);
      void deliver(userMessage);
    },
    [pending, deliver],
  );

  const retry = useCallback(
    (message: ChatMessage) => {
      if (pending) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, status: "sending" as const } : m,
        ),
      );
      void deliver(message);
    },
    [pending, deliver],
  );

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background pt-14">
      <MessageList messages={messages} pending={pending} onRetry={retry} />
      <ChatComposer disabled={pending} onSend={send} />
    </div>
  );
}
