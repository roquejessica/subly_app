"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="chat-input-container glass">
            <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="e.g., 'Just subbed to Netflix for 599 pesos every month'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
            />
            <button
                className={`send-button ${!message.trim() || isLoading ? 'disabled' : ''}`}
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
            >
                <SendHorizontal size={20} />
            </button>

            <style jsx>{`
        .chat-input-container {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-xl);
          margin-top: var(--spacing-md);
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--color-text-primary);
          font-family: var(--font-sans);
          font-size: var(--font-size-base);
          resize: none;
          padding: var(--spacing-sm) 0;
          max-height: 200px;
          outline: none;
        }

        .chat-input::placeholder {
          color: var(--color-text-tertiary);
        }

        .send-button {
          background: var(--gradient-primary);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        .send-button:hover:not(.disabled) {
          transform: scale(1.05);
          box-shadow: var(--shadow-glow);
        }

        .send-button.disabled {
          background: var(--color-bg-tertiary);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
