"use client";

import { useState, useRef, useEffect } from "react";

interface HistoryItem {
  id: string;
  type: string;
  topic: string;
  content: string;
  timestamp: number;
}

const CONTENT_TYPES = [
  { value: "blog_post", label: "Blog Post", icon: "📝" },
  { value: "article", label: "Article", icon: "📰" },
  { value: "social_media", label: "Social Media", icon: "📱" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "product_description", label: "Product Description", icon: "🏷️" },
  { value: "newsletter", label: "Newsletter", icon: "📬" },
];

const TONES = ["Professional", "Casual", "Persuasive", "Informative", "Humorous"];
const LENGTHS = [
  { value: "short", label: "Short (~150 words)" },
  { value: "medium", label: "Medium (~400 words)" },
  { value: "long", label: "Long (~800 words)" },
];

export default function Home() {
  const [contentType, setContentType] = useState("blog_post");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("content_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveHistory = (item: HistoryItem) => {
    const updated = [item, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("content_history", JSON.stringify(updated));
  };

  const generate = async () => {
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    setOutput("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, topic, tone, length }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to generate");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE format
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              // Vercel AI SDK stream format - text part
              try {
                const text = JSON.parse(line.slice(2));
                full += text;
                setOutput(full);
              } catch {}
            }
          }
        }
      }

      if (full) {
        saveHistory({
          id: Date.now().toString(),
          type: contentType,
          topic,
          content: full,
          timestamp: Date.now(),
        });
      }
    } catch (e: any) {
      if (e.name !== "AbortError") {
        setOutput("Error: Failed to generate content. Please check your API key and try again.");
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;

  const loadHistory = (item: HistoryItem) => {
    setContentType(item.type);
    setTopic(item.topic);
    setOutput(item.content);
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            AI Content Writer
          </h1>
          <p className="text-slate-400 text-lg">
            Generate professional content powered by Mimo V2.5 Pro
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Panel */}
          <div className="flex-1 space-y-5">
            {/* Content Type Selector */}
            <div className="glass p-5 fade-in">
              <label className="block text-sm font-medium text-slate-300 mb-3">Content Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => setContentType(ct.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      contentType === ct.value
                        ? "bg-orange-500/20 border-orange-500/50 text-orange-300 border"
                        : "glass text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{ct.icon}</span>
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="glass p-5 fade-in">
              <label className="block text-sm font-medium text-slate-300 mb-3">Topic / Description</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Describe what you want to write about..."
                className="input-field min-h-[100px] resize-none"
                rows={3}
              />
            </div>

            {/* Tone & Length */}
            <div className="flex flex-col sm:flex-row gap-4 fade-in">
              <div className="glass p-5 flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-3">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="select-field w-full"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="glass p-5 flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-3">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="select-field w-full"
                >
                  {LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-3 fade-in">
              {isLoading ? (
                <button onClick={stopGeneration} className="btn-primary bg-red-600 hover:bg-red-700" style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop
                </button>
              ) : (
                <button onClick={generate} disabled={!topic.trim()} className="btn-primary">
                  <svg className={`w-5 h-5 ${isLoading ? "spinner" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Content
                </button>
              )}
              {output && (
                <button onClick={copyToClipboard} className="btn-primary" style={{ background: "rgba(255,255,255,0.1)" }}>
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              )}
            </div>

            {/* Output */}
            {(output || isLoading) && (
              <div className={`glass p-5 fade-in ${isLoading ? "loading" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Generated Content</span>
                  {wordCount > 0 && (
                    <span className="text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
                      {wordCount} words
                    </span>
                  )}
                </div>
                <div ref={outputRef} className="output-area">
                  {output || (
                    <div className="flex items-center gap-3 text-slate-400">
                      <svg className="w-5 h-5 spinner" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating content...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="glass p-5 fade-in sticky top-4">
              <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Generations
              </h2>
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm">No history yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadHistory(item)}
                      className="history-item"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CONTENT_TYPES.find((c) => c.value === item.type)?.icon}</span>
                        <span className="text-white text-sm font-medium truncate">{item.topic}</span>
                      </div>
                      <div className="text-slate-500 text-xs">
                        {new Date(item.timestamp).toLocaleDateString()} · {CONTENT_TYPES.find((c) => c.value === item.type)?.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
