"use client";

import { User, Bot } from "lucide-react";

export type MessageRole = "user" | "assistant" | "system";

export interface MessageAction {
  label: string;
  value: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  actions?: MessageAction[];
}

interface ChatMessageProps {
  message: Message;
  onAction?: (value: string) => void;
}

export default function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isAssistant = message.role === "assistant" || message.role === "system";

  return (
    <div className={`message-wrapper ${isAssistant ? "assistant" : "user"}`}>
      <div className="avatar glass">
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className={`message-content-container`}>
        <div className={`message-content ${isAssistant ? "glass" : "primary"}`}>
          <p>{message.content}</p>
          <span className="timestamp">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isAssistant && message.actions && (
          <div className="actions-container">
            {message.actions.map((action, idx) => (
              <button
                key={idx}
                className="badge badge-primary action-btn"
                onClick={() => onAction?.(action.value)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .message-wrapper {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          max-width: 85%;
          animation: fadeIn var(--transition-base) ease-out;
        }

        .message-wrapper.user {
          flex-direction: row-reverse;
          margin-left: auto;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-tertiary);
          color: var(--color-text-secondary);
          flex-shrink: 0;
        }

        .user .avatar {
          background: var(--color-bg-elevated);
        }

        .message-content {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-lg);
          position: relative;
        }

        .assistant .message-content {
          border-top-left-radius: 2px;
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        .user .message-content {
          border-top-right-radius: 2px;
          background: var(--gradient-primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .actions-container {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
          animation: fadeIn var(--transition-fast) ease-out;
        }

        .action-btn {
          border: 1px solid var(--border-color);
          cursor: pointer;
          background: var(--color-bg-tertiary);
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background: var(--color-bg-elevated);
          border-color: var(--color-accent-primary);
          transform: translateY(-1px);
        }

        .user p {
          color: white;
        }

        .timestamp {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          margin-top: 4px;
          text-align: right;
        }

        .user .timestamp {
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}
