import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";

export default function Auth() {
    const [, setLocation] = useLocation();
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock success
        setLocation("/dashboard");
    };

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-[#111] border border-white/10 p-10 rounded-xl w-full max-w-md shadow-2xl text-center">
                    <img src="/assets/lumos-logo.png" alt="LUMOS" className="h-8 mx-auto mb-8 block object-contain" />
                    <h2 className="text-2xl font-display font-bold mb-6">
                        {isLogin ? "PORTAL LOGIN" : "REQUEST ACCESS"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-accent tracking-widest text-gray-400 mb-2">FULL NAME</label>
                                <input type="text" required className="w-full bg-black border border-white/10 p-3 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-accent tracking-widest text-gray-400 mb-2">EMAIL (OR WALLET)</label>
                            <input type="text" required className="w-full bg-black border border-white/10 p-3 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                        </div>
                        <div>
                            <label className="block text-xs font-accent tracking-widest text-gray-400 mb-2">PASSWORD</label>
                            <input type="password" required className="w-full bg-black border border-white/10 p-3 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                        </div>

                        <button type="submit" className="w-full py-4 mt-6 font-bold tracking-widest text-sm rounded bg-[#D4A843] hover:bg-[#F0C060] text-black transition-all">
                            {isLogin ? "AUTHORIZE" : "APPLY FOR ACCESS"}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already registered? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-[#D4A843] hover:underline hover:text-[#F0C060]">
                            {isLogin ? "Request Access" : "Login Instead"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
