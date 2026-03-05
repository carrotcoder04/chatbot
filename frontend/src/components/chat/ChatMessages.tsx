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
                background: isBot ? "var(--bg-hover)" : "transparent",
                borderBottom: "1px solid var(--border-subtle)",
                transition: "background 0.2s",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: isBot ? "row" : "row-reverse",
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
                                borderRadius: "0px",
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
                                borderRadius: "0px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border-default)",
                            }}
                        >
                            <User size={14} color="var(--text-secondary)" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, textAlign: isBot ? "left" : "right" }}>
                    {/* Name + Badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "10px",
                            justifyContent: isBot ? "flex-start" : "flex-end",
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                            {isBot ? "PTIT Chatbot" : "Bạn"}
                        </span>
                        {isBot && (
                            <span
                                style={{
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    padding: "2px 6px",
                                    borderRadius: "0px",
                                    background: "rgba(196,30,34,0.12)",
                                    color: "var(--brand)",
                                    border: "1px solid rgba(196,30,34,0.40)",
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
                                    color: "var(--text-secondary)",
                                    marginBottom: "8px",
                                    justifyContent: isBot ? "flex-start" : "flex-end",
                                }}
                            >
                                <BookOpen size={10} />
                                Nguồn tham khảo
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: isBot ? "flex-start" : "flex-end" }}>
                                {message.sources.map((source, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: "11px",
                                            padding: "3px 8px",
                                            borderRadius: "5px",
                                            background: "var(--bg-hover)",
                                            border: "1px solid var(--border-default)",
                                            color: "var(--text-secondary)",
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
                                    borderRadius: "0px",
                                    border: "1px solid var(--border-strong)",
                                    background: "var(--bg-elevated)",
                                    color: copied ? "#16a34a" : "var(--text-primary)",
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
                background: "var(--bg-hover)",
                borderBottom: "1px solid var(--border-subtle)",
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
                        borderRadius: "0px",
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
                borderTop: "1px solid var(--border-subtle)",
                background: "var(--bg-base)",
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
                        borderRadius: "0px",
                        background: "var(--bg-surface)",
                        border: `2px solid ${canSend ? "var(--brand)" : "var(--border-default)"}`,
                        transition: "border-color 0.1s",
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
                            color: "var(--text-primary)",
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
                            borderRadius: "0px",
                            border: "none",
                            background: canSend ? "var(--brand)" : "var(--bg-active)",
                            cursor: canSend ? "pointer" : "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.1s",
                        }}
                    >
                        {isLoading ? (
                            <div
                                className="anim-spin"
                                style={{
                                    width: "14px",
                                    height: "14px",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(0,0,0,0.1)",
                                    borderTopColor: "var(--brand)",
                                }}
                            />
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={canSend ? "#fff" : "var(--text-muted)"}
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
                        color: "var(--text-muted)",
                        marginTop: "8px",
                    }}
                >
                    AI có thể có sai sót. Hãy kiểm tra lại thông tin quan trọng.
                </p>
            </div>
        </div>
    );
}
