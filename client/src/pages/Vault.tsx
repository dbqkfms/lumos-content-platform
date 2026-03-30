import { Lock, Download, Play } from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import Header from "@/components/Header";
import { Link } from "wouter";

export default function Vault() {
    const { ownedLicenses } = useMarketplace();

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20">
            <Header />
            <div className="max-w-screen-xl mx-auto px-6 mt-10">
                <div className="mb-12 border-b border-white/10 pb-8 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/30 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#D4A843]" />
                    </div>
                    <div>
                        <h1 className="text-display text-4xl font-bold mb-1">The Vault</h1>
                        <p className="text-gray-400">Secure storage for your acquired LUMOS premium media art licenses.</p>
                    </div>
                </div>

                {ownedLicenses.length === 0 ? (
                    <div className="bg-[#111] p-16 rounded border border-white/5 text-center flex flex-col items-center">
                        <Lock className="w-12 h-12 text-gray-700 mb-6" />
                        <h2 className="text-2xl font-bold mb-3">Your Vault is Empty</h2>
                        <p className="text-gray-400 mb-8 max-w-sm">Acquire licenses from the STANDARD or LOCAL worlds to store highest-fidelity media assets here.</p>
                        <Link href="/standard" className="btn-brutalist text-sm px-8 py-4">
                            ENTER STANDARD GALLERY
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {ownedLicenses.map(art => (
                            <div key={art.id + Math.random()} className="bg-[#111] border border-white/10 rounded overflow-hidden flex flex-col sm:flex-row group hover:border-[#D4A843]/40 transition-colors shadow-2xl">
                                {/* Video Thumbnail */}
                                <div className="w-full sm:w-64 aspect-video relative bg-black shrink-0">
                                    <video
                                        src={art.videoSrc || art.image}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold tracking-widest text-[#D4A843] border border-[#D4A843]/30">
                                        LICENSED
                                    </div>
                                </div>

                                {/* Info & Actions */}
                                <div className="p-6 flex flex-col flex-1 justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 font-display truncate pr-2">{art.title}</h3>

                                        <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-500 font-accent tracking-widest mt-4">
                                            <span>FMT: {art.format || "MP4"}</span>
                                            <span>RES: {art.resolution || "4K"}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button className="flex-1 py-3 bg-white hover:bg-gray-200 text-black font-bold tracking-widest text-xs rounded transition-colors flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" /> MASTER FILE
                                        </button>
                                        <button className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white font-bold tracking-widest text-xs rounded border border-white/10 transition-colors flex items-center justify-center">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
