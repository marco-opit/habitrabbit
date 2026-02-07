import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Pause, RotateCcw, Coffee, Target, Sparkles } from "lucide-react";

interface PomodoroOverlayProps {
    habitName: string;
    isOpen: boolean;
    timeLeft: number;
    isActive: boolean;
    mode: "focus" | "break";
    sessionCount: number;
    onClose: () => void;
    onToggle: () => void;
    onReset: () => void;
}

export function PomodoroOverlay({
    habitName,
    isOpen,
    timeLeft,
    isActive,
    mode,
    sessionCount,
    onClose,
    onToggle,
    onReset
}: PomodoroOverlayProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = timeLeft / (mode === "focus" ? 25 * 60 : 5 * 60);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className={`absolute inset-0 transition-colors duration-1000 ${mode === "focus"
                            ? "bg-purple-500/10"
                            : "bg-emerald-500/10"
                            }`} />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative text-center pt-4 md:pt-0">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                {mode === "focus" ? (
                                    <Target className="w-5 h-5 text-purple-400" />
                                ) : (
                                    <Coffee className="w-5 h-5 text-emerald-400" />
                                )}
                                <span className={`text-sm font-bold uppercase tracking-widest ${mode === "focus" ? "text-purple-400" : "text-emerald-400"
                                    }`}>
                                    {mode === "focus" ? "Focus Session" : "Break Time"}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-8 truncate max-w-full px-4">
                                {habitName}
                            </h2>

                            {/* Timer Progress Circle */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-10">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="48%"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="48%"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="transparent"
                                        strokeDasharray="100 100"
                                        initial={{ strokeDashoffset: 100 }}
                                        animate={{ strokeDashoffset: progress * 100 }}
                                        className={mode === "focus" ? "text-purple-500" : "text-emerald-400"}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl md:text-7xl font-black text-white tracking-tighter tabular-nums">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                            {sessionCount} completed
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onReset}
                                    className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onToggle}
                                    className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg transition-all ${isActive
                                        ? "bg-white/10 text-white border border-white/20"
                                        : mode === "focus"
                                            ? "bg-purple-500 text-white shadow-purple-500/20"
                                            : "bg-emerald-500 text-white shadow-emerald-500/20"
                                        }`}
                                >
                                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                                </motion.button>

                                <div className="w-14" /> {/* Spacer to keep play central */}
                            </div>

                            <p className="mt-12 text-sm text-white/30 italic">
                                "Small steps every day lead to big results."
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
