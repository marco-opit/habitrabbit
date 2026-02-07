import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    habitName: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    habitName,
}: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[70] px-4"
                    >
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-red-500/20 shadow-2xl overflow-hidden relative">
                            {/* Decorative Red Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6">
                                    <AlertTriangle className="w-8 h-8 text-red-400" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Delete Habit?</h2>
                                <p className="text-white/60 mb-8 leading-relaxed">
                                    Are you sure you want to delete <span className="text-white font-semibold">"{habitName}"</span>?
                                    <br /><br />
                                    This action is <span className="text-red-400 font-bold uppercase tracking-wider">irreversible</span>. You will lose all your progress and streaks forever.
                                </p>

                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            onConfirm();
                                            onClose();
                                        }}
                                        className="py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-white/40" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
