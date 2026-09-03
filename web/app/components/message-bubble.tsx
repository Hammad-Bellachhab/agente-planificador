import type { ChatMessage } from "../lib/types";

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 1.5 15 14.5H1L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.5v3.25"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function MessageBubble({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry: (message: ChatMessage) => void;
}) {
  if (message.role === "agent") {
    return (
      <div className="flex max-w-[85%] flex-col gap-1 border-l border-border pl-4 sm:max-w-[75%]">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
          {message.content}
        </p>
      </div>
    );
  }

  const isSending = message.status === "sending";
  const isError = message.status === "error";

  return (
    <div className="flex flex-col items-end gap-1.5 self-end">
      <div
        className={`max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[15px] leading-relaxed text-foreground transition-opacity duration-150 sm:max-w-[70%] ${
          isSending ? "opacity-60" : ""
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {isError ? (
        <div className="flex max-w-[85%] items-start gap-1.5 pr-1 sm:max-w-[70%]">
          <WarningIcon className="mt-0.5 h-3 w-3 shrink-0 text-subtle" />
          <p className="text-right text-xs leading-relaxed text-muted">
            {message.error ?? "No se pudo enviar."}{" "}
            <button
              type="button"
              onClick={() => onRetry(message)}
              className="font-medium text-foreground underline decoration-border underline-offset-2 transition-colors hover:decoration-foreground"
            >
              Reintentar
            </button>
          </p>
        </div>
      ) : null}
    </div>
  );
}
