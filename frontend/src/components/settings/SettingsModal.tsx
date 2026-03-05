"use client";

import { X, Sparkles, Cpu, Key } from "lucide-react";
import { useState, useEffect } from "react";

export interface ChatSettings {
    provider: "gemini" | "ollama";
    api_key: string;
    model: string;
}

export function SettingsModal({
    isOpen,
    onClose,
    onSave,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (s: ChatSettings) => void;
}) {
    const [tempSettings, setTempSettings] = useState<ChatSettings>({
        provider: "gemini",
        api_key: "",
        model: "gemini-2.5-flash",
    });

    useEffect(() => {
        const saved = localStorage.getItem("chatbot-settings");
        if (saved) setTempSettings(JSON.parse(saved));
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem("chatbot-settings", JSON.stringify(tempSettings));
        onSave(tempSettings);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade-in"
            style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.7)" }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full max-w-md rounded-none overflow-hidden anim-scale-pop"
                style={{
                    background: "var(--bg-surface)",
                    border: "2px solid var(--border-strong)",
                    boxShadow: "none",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-none flex items-center justify-center"
                            style={{ background: "var(--brand-dim)", border: "1px solid var(--brand)" }}
                        >
                            <Sparkles size={15} style={{ color: "var(--brand)" }} />
                        </div>
                        <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                            Cấu hình AI
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-none transition-all duration-100"
                        style={{ color: "var(--text-secondary)", border: "1px solid transparent" }}
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
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Provider */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#606060" }}>
                            LLM Provider
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: "gemini", label: "Google Gemini", sub: "Cloud" },
                                { id: "ollama", label: "Ollama", sub: "Local" },
                            ].map((p) => {
                                const isSelected = tempSettings.provider === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setTempSettings({ ...tempSettings, provider: p.id as "gemini" | "ollama" })}
                                        className="flex flex-col text-left p-3.5 rounded-none transition-all duration-100"
                                        style={{
                                            background: isSelected ? "var(--brand)" : "var(--bg-base)",
                                            border: isSelected
                                                ? "1px solid var(--border-strong)"
                                                : "1px solid var(--border-strong)",
                                        }}
                                    >
                                        <span className="text-sm font-semibold" style={{ color: isSelected ? "#fff" : "var(--text-primary)" }}>
                                            {p.label}
                                        </span>
                                        <span className="text-[10px] mt-0.5 uppercase tracking-wider font-medium" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                                            {p.sub}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                        <label
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                            style={{ color: "#606060" }}
                        >
                            <Cpu size={12} />
                            Model
                        </label>
                        <input
                            type="text"
                            value={tempSettings.model}
                            onChange={e => setTempSettings({ ...tempSettings, model: e.target.value })}
                            className="w-full px-4 py-3 rounded-none text-sm outline-none transition-all duration-100"
                            placeholder={tempSettings.provider === "gemini" ? "gemini-2.5-flash" : "qwen2.5:7b"}
                            style={{
                                background: "var(--bg-base)",
                                border: "1px solid var(--border-strong)",
                                color: "var(--text-primary)",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "var(--brand)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                        />
                    </div>

                    {/* API Key */}
                    {tempSettings.provider === "gemini" && (
                        <div className="space-y-2 anim-fade-in">
                            <label
                                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                                style={{ color: "#606060" }}
                            >
                                <Key size={12} />
                                Gemini API Key
                            </label>
                            <input
                                type="password"
                                value={tempSettings.api_key}
                                onChange={e => setTempSettings({ ...tempSettings, api_key: e.target.value })}
                                className="w-full px-4 py-3 rounded-none text-sm outline-none transition-all duration-100"
                                placeholder="AIza..."
                                style={{
                                    background: "var(--bg-base)",
                                    border: "1px solid var(--border-strong)",
                                    color: "var(--text-primary)",
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "var(--brand)")}
                                onBlur={e => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex gap-2.5 px-6 py-4"
                    style={{ borderTop: "1px solid var(--border-strong)" }}
                >
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-none text-sm font-medium transition-all duration-100"
                        style={{
                            background: "var(--bg-base)",
                            border: "1px solid var(--border-strong)",
                            color: "var(--text-primary)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--bg-hover)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "var(--bg-base)";
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] py-2.5 rounded-none text-sm font-bold text-white transition-all duration-100"
                        style={{
                            background: "var(--brand)",
                            border: "1px solid var(--border-strong)",
                            borderBottom: "3px solid var(--border-strong)",
                            boxShadow: "none",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "var(--brand-hover)";
                            e.currentTarget.style.transform = "translateY(2px)";
                            e.currentTarget.style.borderBottomWidth = "1px";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "var(--brand)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.borderBottomWidth = "3px";
                        }}
                    >
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
}
