"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const MAX_HEIGHT_PX = 200;

export function ChatComposer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (content: string) => void;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  const submit = () => {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3 sm:px-6 sm:py-5">
      <form
        className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-border bg-surface px-3 py-2 transition-colors focus-within:border-border-strong"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          placeholder="Escribe tu mensaje…"
          aria-label="Mensaje"
          className="max-h-[200px] flex-1 resize-none bg-transparent px-1 py-1.5 text-[15px] leading-relaxed text-foreground placeholder:text-subtle focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-9 shrink-0 items-center justify-center rounded-full bg-foreground px-4 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/20 disabled:text-background/50"
        >
          Enviar
        </button>
      </form>
      <p className="mx-auto mt-2 max-w-3xl px-1 text-xs text-subtle">
        Enter para enviar · Shift + Enter para salto de línea
      </p>
    </div>
  );
}
