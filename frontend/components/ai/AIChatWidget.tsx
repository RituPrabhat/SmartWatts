'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Zap } from 'lucide-react';
import { useAIStore } from '@/lib/aiStore';

const QUICK_PROMPTS = [
  'Which appliance costs me the most?',
  'How can I reduce my bill?',
  'What will my next month bill look like?',
  'How much can I save if I reduce AC by 1 hour?',
];

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, chatLoading, sendMessage } = useAIStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || chatLoading) return;
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (chatLoading) return;
    setInput('');
    sendMessage(prompt);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-(--shadow-md) hover:bg-primary-hover transition-colors flex items-center justify-center"
          aria-label="Open AI Advisor"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-100 max-w-[calc(100vw-2rem)] h-150 max-h-[calc(100vh-6rem)] card shadow-(--shadow-md) flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">SmartWatts AI</p>
                <p className="text-xs text-muted-foreground">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !chatLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-accent-foreground" />
                </div>
                <p className="font-semibold text-foreground mb-1">Hi! I&apos;m your AI Energy Advisor</p>
                <p className="text-xs text-muted-foreground mb-6">
                  Ask me anything about your electricity usage, bills, or savings opportunities.
                </p>
                <div className="w-full space-y-2">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full text-left text-sm px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your energy usage..."
                disabled={chatLoading}
                className="flex-1 h-10 px-3 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatLoading}
                className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
