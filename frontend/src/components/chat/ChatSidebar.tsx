"use client";

import { useState, useEffect } from "react";
import { Plus, MessageSquare, ChevronRight } from "lucide-react";
import { PtitIcon } from "@/components/PtitIcon";
import { cn } from "@/lib/utils";

interface Conversation {
    id: string;
    title: string;
    created_at: string;
}

interface SidebarProps {
    onNewChat: () => void;
    onSelectChat: (id: string) => void;
    currentChatId: string | null;
    className?: string;
}

export function ChatSidebar({
    onNewChat,
    onSelectChat,
    currentChatId,
    className,
}: SidebarProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        fetchConversations();
    }, [currentChatId]);

    const fetchConversations = async () => {
        try {
            const resp = await fetch("http://localhost:8000/api/conversations");
            if (resp.ok) {
                const data = await resp.json();
                setConversations(data);
            }
        } catch (e) {
            console.error("Failed to fetch conversations:", e);
        }
    };

    return (
        <aside
            className={cn("flex flex-col h-full shrink-0", className)}
            style={{
                width: "260px",
                minWidth: "260px",
                maxWidth: "260px",
                background: "var(--bg-surface)",
                borderRight: "1px solid var(--border-subtle)",
            }}
        >
            {/* ── Logo / Brand ── */}
            <div
                style={{
                    padding: "20px 16px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    flexShrink: 0,
                }}
            >
                {/* Logo row */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            minWidth: "36px",
                            borderRadius: "0px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(196,30,34,0.15)",
                            border: "1px solid rgba(196,30,34,0.25)",
                        }}
                    >
                        <PtitIcon size={20} color="#C41E22" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "var(--text-primary)",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            PTIT Chatbot
                        </div>
                        <div
                            style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                marginTop: "2px",
                            }}
                        >
                            Tư vấn tuyển sinh
                        </div>
                    </div>
                </div>

                {/* New Chat Button */}
                <button
                    onClick={onNewChat}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "10px 16px",
                        borderRadius: "0px",
                        background: "#C41E22",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        transition: "background 0.1s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#A3161A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#C41E22")}
                >
                    <Plus size={15} strokeWidth={2.5} />
                    Cuộc trò chuyện mới
                </button>
            </div>

            {/* ── Conversation List ── */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "12px 8px",
                }}
            >
                <div
                    style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--text-muted)",
                        padding: "0 8px",
                        marginBottom: "6px",
                    }}
                >
                    Lịch sử
                </div>

                {conversations.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px",
                            padding: "24px 8px",
                            opacity: 0.8,
                        }}
                    >
                        <MessageSquare size={22} color="var(--text-muted)" />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            Chưa có hội thoại nào
                        </span>
                    </div>
                ) : (
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2px" }}>
                        {conversations.map((conv, i) => {
                            const isActive = currentChatId === conv.id;
                            const isHovered = hoveredId === conv.id;
                            return (
                                <li key={conv.id} className="anim-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                                    <button
                                        onClick={() => onSelectChat(conv.id)}
                                        onMouseEnter={() => setHoveredId(conv.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "8px 10px",
                                            borderRadius: "0px",
                                            border: "none",
                                            borderLeft: isActive
                                                ? "4px solid var(--brand)"
                                                : "4px solid transparent",
                                            background: isActive
                                                ? "var(--brand-dim)"
                                                : isHovered
                                                    ? "var(--bg-hover)"
                                                    : "transparent",
                                            color: isActive ? "var(--brand)" : "var(--text-secondary)",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            transition: "all 0.1s",
                                        }}
                                    >
                                        <MessageSquare
                                            size={13}
                                            style={{ flexShrink: 0, color: isActive ? "var(--brand)" : "var(--text-muted)" }}
                                        />
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                            {conv.title}
                                        </span>
                                        {isActive && (
                                            <ChevronRight size={11} style={{ flexShrink: 0, color: "var(--brand)", opacity: 0.7 }} />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

        </aside>
    );
}
