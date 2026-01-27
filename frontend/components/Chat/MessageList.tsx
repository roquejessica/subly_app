"use client";

import { useRef, useEffect } from "react";
import ChatMessage, { Message } from "./ChatMessage";

interface MessageListProps {
  messages: Message[];
  onAction?: (value: string) => void;
}

export default function MessageList({ messages, onAction }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="empty-state">
          <p>Start by telling me about a new subscription!</p>
          <div className="suggestions">
            <button
              className="badge badge-primary"
              onClick={() => onAction?.("Netflix for 599 pesos monthly")}
            >
              "Netflix for 599 pesos monthly"
            </button>
            <button
              className="badge badge-primary"
              onClick={() => onAction?.("I just subbed to Spotify for 149 per month")}
            >
              "I just subbed to Spotify for 149 per month"
            </button>
          </div>
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} onAction={onAction} />)
      )}

      <style jsx>{`
        .message-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: var(--spacing-md) 0;
          scrollbar-width: thin;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          opacity: 0.6;
          gap: var(--spacing-md);
        }

        .suggestions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--spacing-sm);
        }

        .suggestions button {
          border: none;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .suggestions button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
