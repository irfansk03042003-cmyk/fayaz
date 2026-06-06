"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm the AirDosa assistant. Ask me about our menu, delivery, or pricing — I'm happy to help!",
};

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I couldn't respond right now. ${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div
          className="flex h-[min(32rem,calc(100vh-6rem))] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-orange-200/80 bg-white shadow-2xl shadow-orange-900/10"
          role="dialog"
          aria-label="AirDosa assistant chat"
        >
          <header className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">AirDosa Assistant</p>
              <p className="text-xs text-orange-50/90">
                Menu · Delivery · Pricing
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-orange-50/40 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-orange-500 text-white"
                      : "rounded-bl-md border border-orange-100 bg-white text-zinc-800 shadow-sm"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-orange-100 bg-white px-3.5 py-2.5 text-sm text-zinc-500 shadow-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-orange-100 bg-white p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about menu, delivery, pricing..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-orange-200 bg-orange-50/50 px-4 py-2.5 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close AirDosa assistant" : "Open AirDosa assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <CloseIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
