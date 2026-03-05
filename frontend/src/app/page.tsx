"use client";

import { useState, useRef, useEffect } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessage, ChatInput, TypingIndicator } from "@/components/chat/ChatMessages";
import { useChat } from "@/hooks/useChat";
import { Menu, Plus, Sparkles } from "lucide-react";
import { PtitIcon } from "@/components/PtitIcon";

const SUGGESTIONS = [
    { text: "PTIT có những ngành học nào hot nhất?", icon: "🔥" },
    { text: "Điều kiện xét tuyển thẳng vào PTIT?", icon: "🏆" },
    { text: "Ký túc xá PTIT như thế nào?", icon: "🏠" },
    { text: "Cơ hội việc làm sau khi tốt nghiệp?", icon: "💼" },
];

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [inputValue, setInputValue] = useState("");

    const { messages, sendMessage, isLoading, clearChat, conversationId, loadChatHistory } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    return (
        /* Root: full screen, dark, flex row */
        <div
            style={{
                display: "flex",
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                background: "var(--bg-base)",
                color: "var(--text-primary)",
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            {/* ── Sidebar ── */}
            {isSidebarOpen && (
                <ChatSidebar
                    onNewChat={clearChat}
                    onSelectChat={loadChatHistory}
                    currentChatId={conversationId}
                />
            )}

            {/* ── Main: grows to fill remaining space ── */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    overflow: "hidden",
                    minWidth: 0,  /* critical: allows flex child to shrink */
                }}
            >
                {/* ── Top bar ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        flexShrink: 0,
                        height: "52px",
                    }}
                >
                    {/* Sidebar toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(v => !v)}
                        title={isSidebarOpen ? "Ẩn sidebar" : "Hiện sidebar"}
                        style={{
                            padding: "6px",
                            borderRadius: "0px",
                            border: "1px solid transparent",
                            background: "transparent",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--bg-hover)";
                            e.currentTarget.style.color = "var(--text-primary)";
                            e.currentTarget.style.borderColor = "var(--border-strong)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--text-secondary)";
                            e.currentTarget.style.borderColor = "transparent";
                        }}
                    >
                        <Menu size={18} />
                    </button>

                    {/* Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                            PTIT Chatbot
                        </span>
                        <span
                            style={{
                                fontSize: "9px",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                padding: "2px 6px",
                                borderRadius: "5px",
                                background: "var(--brand-dim)",
                                color: "var(--brand)",
                                border: "1px solid var(--brand-glow)",
                            }}
                        >
                            AI
                        </span>
                    </div>

                    {/* Spacer */}
                    <div style={{ flex: 1 }} />

                    {/* New chat button (right) */}
                    <button
                        onClick={clearChat}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "6px 12px",
                            borderRadius: "0px",
                            border: "1px solid var(--border-strong)",
                            background: "var(--bg-surface)",
                            color: "var(--text-secondary)",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 500,
                            transition: "all 0.15s",
                            flexShrink: 0,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--brand)";
                            e.currentTarget.style.color = "#fff";
                            e.currentTarget.style.borderColor = "var(--border-strong)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "var(--bg-surface)";
                            e.currentTarget.style.color = "var(--text-secondary)";
                            e.currentTarget.style.borderColor = "var(--border-strong)";
                        }}
                    >
                        <Plus size={13} strokeWidth={2.5} />
                        Mới
                    </button>
                </div>

                {/* ── Message area: scrollable, fills remaining height ── */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                >
                    {messages.length === 0 ? (
                        /* Welcome screen */
                        <div
                            className="anim-fade-in"
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "40px 24px",
                                textAlign: "center",
                            }}
                        >
                            {/* Floating icon */}
                            <div className="anim-float" style={{ marginBottom: "28px" }}>
                                <div
                                    style={{
                                        width: "72px",
                                        height: "72px",
                                        borderRadius: "0px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "var(--brand-dim)",
                                        border: "2px solid var(--brand)",
                                        boxShadow: "none",
                                    }}
                                >
                                    <PtitIcon size={38} color="#C41E22" />
                                </div>
                            </div>

                            {/* Label */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginBottom: "10px",
                                }}
                            >
                                <Sparkles size={12} color="#f87171" />
                                <span
                                    style={{
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        color: "#f87171",
                                    }}
                                >
                                    Trợ lý tuyển sinh
                                </span>
                                <Sparkles size={12} color="#f87171" />
                            </div>

                            {/* Heading */}
                            <h2
                                style={{
                                    fontSize: "22px",
                                    fontWeight: 700,
                                    color: "var(--text-primary)",
                                    marginBottom: "10px",
                                    lineHeight: 1.3,
                                }}
                            >
                                Xin chào! Mình có thể giúp gì cho bạn?
                            </h2>

                            {/* Subtitle */}
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-secondary)",
                                    maxWidth: "400px",
                                    lineHeight: 1.6,
                                    marginBottom: "32px",
                                }}
                            >
                                Hỏi mình về{" "}
                                <span style={{ color: "var(--text-primary)" }}>điểm chuẩn</span>,{" "}
                                <span style={{ color: "var(--text-primary)" }}>học phí</span>,{" "}
                                <span style={{ color: "var(--text-primary)" }}>ngành học</span> và{" "}
                                <span style={{ color: "var(--text-primary)" }}>thủ tục xét tuyển</span> của PTIT.
                            </p>

                            {/* Suggestion chips — 2 columns, max-width aligned with input */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px",
                                    width: "100%",
                                    maxWidth: "560px",
                                }}
                            >
                                {SUGGESTIONS.map((s, i) => (
                                    <button
                                        key={s.text}
                                        onClick={() => sendMessage(s.text)}
                                        className={`anim-scale-pop stagger-${i + 1}`}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "14px 16px",
                                            borderRadius: "0px",
                                            border: "1px solid var(--border-strong)",
                                            background: "var(--bg-base)",
                                            color: "var(--text-primary)",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            textAlign: "left",
                                            lineHeight: 1.4,
                                            transition: "all 0.18s",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "var(--brand)";
                                            e.currentTarget.style.borderColor = "var(--border-strong)";
                                            e.currentTarget.style.color = "#fff";
                                            e.currentTarget.style.transform = "translate(2px, -2px)";
                                            e.currentTarget.style.boxShadow = "-4px 4px 0px 0px var(--border-strong)";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "var(--bg-base)";
                                            e.currentTarget.style.borderColor = "var(--border-strong)";
                                            e.currentTarget.style.color = "var(--text-primary)";
                                            e.currentTarget.style.transform = "translate(0, 0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <span style={{ fontSize: "18px", flexShrink: 0 }}>{s.icon}</span>
                                        <span>{s.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Messages list */
                        <>
                            {messages.map((m, i) => (
                                <ChatMessage key={i} message={m} index={i} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} style={{ height: "16px" }} />
                        </>
                    )}
                </div>

                {/* ── Input (pinned at bottom of main) ── */}
                <div style={{ flexShrink: 0 }}>
                    <ChatInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleSend}
                        isLoading={isLoading}
                    />
                </div>
            </div>

        </div>
    );
}
