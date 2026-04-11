import { useState } from 'react'
import { motion } from 'motion/react'
import { supabase } from '../../lib/supabase'
import { Sparkles, Mail, Lock, UserPlus, LogIn } from 'lucide-react'

export function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' })
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center p-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
            >
                {/* Decorative background for the card */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -10 }}
                            animate={{ y: 0 }}
                            className="flex items-center justify-center gap-3 mb-4"
                        >
                            <Sparkles className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                                Habit Rabbit
                            </h1>
                        </motion.div>
                        <p className="text-white/60 text-lg">
                            {isSignUp ? 'Join the community of habit builders' : 'Ready for another day of growth?'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all text-lg"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all text-lg"
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isSignUp ? (
                                <>
                                    <UserPlus className="w-6 h-6" /> Sign Up Free
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-6 h-6" /> Log In
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-white/40 hover:text-white text-sm font-medium transition-all group"
                        >
                            {isSignUp ? (
                                <span>Already have an account? <span className="text-purple-400 group-hover:text-purple-300 transition-colors underline-offset-4 hover:underline">Log In</span></span>
                            ) : (
                                <span>Don't have an account? <span className="text-purple-400 group-hover:text-purple-300 transition-colors underline-offset-4 hover:underline">Create Account</span></span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
