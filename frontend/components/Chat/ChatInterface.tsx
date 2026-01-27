"use client";

import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "./ChatMessage";
import { v4 as uuidv4 } from "uuid";

interface ChatInterfaceProps {
    onSubscriptionAdded?: () => void;
}

export default function ChatInterface({ onSubscriptionAdded }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "initial",
            role: "assistant",
            content: "Hi! I'm Subly. Tell me about your subscriptions, and I'll help you track them. For example: 'Just signed up for Netflix for 599 pesos every month'.",
            timestamp: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (content: string) => {
        // Add user message
        const userMessage: Message = {
            id: uuidv4(),
            role: "user",
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // API call to backend NLP parser (defined in Phase 2)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/subscriptions/parse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: content }),
            });

            if (!response.ok) {
                throw new Error("Failed to parse message");
            }

            const data = await response.json();

            // Add assistant response
            const assistantMessage: Message = {
                id: uuidv4(),
                role: "assistant",
                content: data.message || "I've logged that subscription for you!",
                timestamp: new Date(),
                actions: data.status === 'needs_amount' ? [
                    { label: "₱149", value: "149" },
                    { label: "₱599", value: "599" },
                    { label: "₱1249", value: "1249" }
                ] : undefined
            };

            setMessages((prev) => [...prev, assistantMessage]);

            if (data.status === 'success' && onSubscriptionAdded) {
                onSubscriptionAdded();
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: uuidv4(),
                role: "assistant",
                content: "Sorry, I had trouble parsing that. Could you try again or be more specific?",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-interface-wrapper glass">
            <MessageList messages={messages} onAction={handleSendMessage} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

            <style jsx>{`
        .chat-interface-wrapper {
          display: flex;
          flex-direction: column;
          height: 600px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chat-interface-wrapper {
            height: calc(100vh - 200px);
            border-radius: 0;
            border: none;
          }
        }
      `}</style>
        </div>
    );
}
