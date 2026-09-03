export type MessageRole = "user" | "agent";
export type MessageStatus = "sending" | "sent" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  /** Motivo legible del fallo, solo presente cuando status === "error". */
  error?: string;
}
