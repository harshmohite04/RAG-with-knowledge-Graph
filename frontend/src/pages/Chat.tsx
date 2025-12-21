import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ContextItem {
  content: string;
  score?: number;
}

interface APIResponse {
  answer: string;
  contexts: ContextItem[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContexts, setShowContexts] = useState(false);
  const [lastContexts, setLastContexts] = useState<ContextItem[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ⚙️ Configuration
  const API_URL = "http://localhost:8000/chat";
  const TOP_K = 5;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage.content,
          top_k: TOP_K 
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: APIResponse = await res.json();

      // Store contexts for optional display
      setLastContexts(data.contexts || []);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received" },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "⚠️ Server error. Make sure the backend is running on http://localhost:8000" 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#f7f7f8]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#202123] text-white">
        <div className="p-4 text-lg font-semibold border-b border-gray-700">
          Hospital RAG System
        </div>
        <div className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setMessages([])}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-sm"
          >
            + New chat
          </button>
          <button
            onClick={() => setShowContexts(!showContexts)}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-sm text-gray-400"
          >
            {showContexts ? "Hide" : "Show"} Contexts
          </button>
        </div>
        <div className="p-4 text-xs text-gray-500 border-t border-gray-700">
          Connected to FastAPI
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b bg-white flex items-center justify-between px-6">
          <span className="font-medium">Hospital Operations Assistant</span>
          <span className="text-xs text-gray-500">
            {messages.length} messages
          </span>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <div className="text-4xl mb-4">🏥</div>
              <p className="text-lg font-medium">Hospital Operations Assistant</p>
              <p className="text-sm mt-2">Ask me about departments, workflows, or data fields</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className="flex">
              {msg.role === "assistant" && (
                <div className="w-8 h-8 mr-3 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
              )}

              <div
                className={`max-w-3xl px-4 py-3 rounded-2xl leading-relaxed text-sm shadow-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 ml-3 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex">
              <div className="w-8 h-8 mr-3 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="bg-white border px-4 py-3 rounded-2xl text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Thinking</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Context Display (Optional) */}
          {showContexts && lastContexts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs">
              <div className="font-semibold mb-2">📚 Retrieved Contexts ({lastContexts.length})</div>
              <div className="space-y-2">
                {lastContexts.map((ctx, i) => (
                  <div key={i} className="bg-white p-2 rounded border">
                    <div className="text-gray-600">{ctx.content}</div>
                    {ctx.score && (
                      <div className="text-gray-400 mt-1">Score: {ctx.score.toFixed(3)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Box */}
        <div className="border-t bg-white px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about hospital operations, workflows, or data fields..."
              rows={1}
              className="flex-1 resize-none px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}