"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { User, Copy, Check, BookOpen } from "lucide-react";
import { PtitIcon } from "@/components/PtitIcon";
import { Message } from "@/hooks/useChat";

/* ── ChatMessage ─────────────────────────────────────────────── */
export function ChatMessage({
    message,
    index = 0,
}: {
    message: Message;
    index?: number;
}) {
    const isBot = message.role === "assistant";
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="group anim-fade-up"
            style={{
                animationDelay: `${Math.min(index * 0.04, 0.3)}s`,
                background: isBot ? "rgba(255,255,255,0.018)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "background 0.2s",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "14px",
                    padding: "20px 24px",
                    maxWidth: "900px",
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                {/* Avatar */}
                <div style={{ flexShrink: 0, paddingTop: "2px" }}>
                    {isBot ? (
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                minWidth: "32px",
                                borderRadius: "9px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(196,30,34,0.15)",
                                border: "1px solid rgba(196,30,34,0.25)",
                            }}
                        >
                            <PtitIcon size={18} color="#C41E22" />
                        </div>
                    ) : (
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                minWidth: "32px",
                                borderRadius: "9px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.07)",
                                border: "1px solid rgba(255,255,255,0.10)",
                            }}
                        >
                            <User size={14} color="#a0a0a0" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + Badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "10px",
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#ececec" }}>
                            {isBot ? "PTIT Advisor" : "Bạn"}
                        </span>
                        {isBot && (
                            <span
                                style={{
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    background: "rgba(196,30,34,0.12)",
                                    color: "#f87171",
                                    border: "1px solid rgba(196,30,34,0.20)",
                                }}
                            >
                                AI
                            </span>
                        )}
                    </div>

                    {/* Message body with prose-dark class for markdown */}
                    <div className="prose-dark">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>

                    {/* Sources */}
                    {isBot && message.sources && message.sources.length > 0 && (
                        <div
                            className="anim-fade-in"
                            style={{
                                marginTop: "16px",
                                paddingTop: "12px",
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "#505050",
                                    marginBottom: "8px",
                                }}
                            >
                                <BookOpen size={10} />
                                Nguồn tham khảo
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {message.sources.map((source, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: "11px",
                                            padding: "3px 8px",
                                            borderRadius: "5px",
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            color: "#707070",
                                        }}
                                    >
                                        {source.length > 80 ? source.substring(0, 80) + "…" : source}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Copy button (shows on hover) */}
                    {isBot && (
                        <div
                            style={{ marginTop: "12px" }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <button
                                onClick={handleCopy}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    background: "rgba(255,255,255,0.04)",
                                    color: copied ? "#4ade80" : "#606060",
                                    cursor: "pointer",
                                    fontSize: "11px",
                                    transition: "all 0.15s",
                                }}
                            >
                                {copied ? (
                                    <><Check size={11} /> Đã sao chép</>
                                ) : (
                                    <><Copy size={11} /> Sao chép</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Typing Indicator ────────────────────────────────────────── */
export function TypingIndicator() {
    return (
        <div
            className="anim-fade-up"
            style={{
                background: "rgba(255,255,255,0.018)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "14px",
                    padding: "20px 24px",
                    maxWidth: "900px",
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        width: "32px",
                        height: "32px",
                        minWidth: "32px",
                        borderRadius: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(196,30,34,0.15)",
                        border: "1px solid rgba(196,30,34,0.25)",
                        flexShrink: 0,
                        paddingTop: "2px",
                    }}
                >
                    <PtitIcon size={18} color="#C41E22" />
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        paddingTop: "6px",
                    }}
                >
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                </div>
            </div>
        </div>
    );
}

/* ── ChatInput ───────────────────────────────────────────────── */
export function ChatInput({
    value,
    onChange,
    onSubmit,
    isLoading,
}: {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}) {
    const canSend = !!value.trim() && !isLoading;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div
            style={{
                flexShrink: 0,
                padding: "12px 24px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                background: "#0d0d0d",
            }}
        >
            {/* Constrained width, centered */}
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "10px",
                        padding: "8px 10px 8px 16px",
                        borderRadius: "14px",
                        background: "#1a1a1a",
                        border: `1px solid ${canSend ? "rgba(196,30,34,0.30)" : "rgba(255,255,255,0.09)"}`,
                        boxShadow: canSend ? "0 0 0 3px rgba(196,30,34,0.07)" : "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                >
                    <textarea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Hỏi về điểm chuẩn, học phí, thủ tục nhập học..."
                        disabled={isLoading}
                        rows={1}
                        style={{
                            flex: 1,
                            resize: "none",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e0e0e0",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            padding: "4px 0",
                            minHeight: "28px",
                            maxHeight: "180px",
                            fontFamily: "inherit",
                        }}
                    />

                    {/* Send button */}
                    <button
                        onClick={onSubmit}
                        disabled={!canSend}
                        style={{
                            flexShrink: 0,
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            border: "none",
                            background: canSend ? "#C41E22" : "rgba(255,255,255,0.06)",
                            cursor: canSend ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: canSend ? "0 4px 12px rgba(196,30,34,0.35)" : "none",
                            transform: canSend ? "scale(1)" : "scale(0.88)",
                            transition: "all 0.2s",
                        }}
                    >
                        {isLoading ? (
                            <div
                                className="anim-spin"
                                style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255,255,255,0.2)",
                                    borderTopColor: "#fff",
                                }}
                            />
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={canSend ? "#fff" : "#404040"}
                                style={{ width: "15px", height: "15px", strokeWidth: 2.5 }}
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>

                <p
                    style={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "#3a3a3a",
                        marginTop: "8px",
                    }}
                >
                    AI có thể có sai sót. Hãy kiểm tra lại thông tin quan trọng.
                </p>
            </div>
        </div>
    );
}
