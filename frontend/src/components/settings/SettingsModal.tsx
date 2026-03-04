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
                className="relative w-full max-w-md rounded-2xl overflow-hidden anim-scale-pop"
                style={{
                    background: "#161616",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: "rgba(196,30,34,0.15)", border: "1px solid rgba(196,30,34,0.25)" }}
                        >
                            <Sparkles size={15} style={{ color: "#f87171" }} />
                        </div>
                        <h2 className="text-base font-bold" style={{ color: "#f0f0f0" }}>
                            Cấu hình AI
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-all duration-150"
                        style={{ color: "#606060" }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            e.currentTarget.style.color = "#a0a0a0";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#606060";
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
                                { id: "ollama", label: "Ollama",        sub: "Local" },
                            ].map((p) => {
                                const isSelected = tempSettings.provider === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setTempSettings({ ...tempSettings, provider: p.id as "gemini" | "ollama" })}
                                        className="flex flex-col text-left p-3.5 rounded-xl transition-all duration-150"
                                        style={{
                                            background: isSelected ? "rgba(196,30,34,0.10)" : "rgba(255,255,255,0.03)",
                                            border: isSelected
                                                ? "1px solid rgba(196,30,34,0.30)"
                                                : "1px solid rgba(255,255,255,0.07)",
                                        }}
                                    >
                                        <span className="text-sm font-semibold" style={{ color: isSelected ? "#f87171" : "#c0c0c0" }}>
                                            {p.label}
                                        </span>
                                        <span className="text-[10px] mt-0.5 uppercase tracking-wider font-medium" style={{ color: "#505050" }}>
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
                            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150"
                            placeholder={tempSettings.provider === "gemini" ? "gemini-2.5-flash" : "qwen2.5:7b"}
                            style={{
                                background: "#0d0d0d",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "#e0e0e0",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = "rgba(196,30,34,0.40)")}
                            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
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
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150"
                                placeholder="AIza..."
                                style={{
                                    background: "#0d0d0d",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: "#e0e0e0",
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = "rgba(196,30,34,0.40)")}
                                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className="flex gap-2.5 px-6 py-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#707070",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.color = "#a0a0a0";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            e.currentTarget.style.color = "#707070";
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-[2] py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150"
                        style={{
                            background: "var(--brand)",
                            boxShadow: "0 4px 16px rgba(196,30,34,0.35)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--brand-hover)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--brand)")}
                    >
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
}
