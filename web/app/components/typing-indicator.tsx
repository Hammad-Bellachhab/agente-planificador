export function TypingIndicator() {
  return (
    <div className="flex max-w-[85%] flex-col gap-1 border-l border-border pl-4 sm:max-w-[75%]">
      <div
        className="flex items-center gap-1.5 py-1.5"
        role="status"
        aria-label="El agente está escribiendo"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-subtle"
            style={{
              animation: "dot-pulse 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
