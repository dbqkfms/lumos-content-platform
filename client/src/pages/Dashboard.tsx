import { User } from "lucide-react";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import Header from "@/components/Header";
import { Link } from "wouter";

export default function Dashboard() {
    const { artworks } = useMarketplace();

    // In a real app, this would filter by the logged-in user.
    // For the mockup, we filter items created by StellaNova.
    const myUploads = artworks.filter(art => art.artist === "StellaNova");

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20">
            <Header />
            <div className="max-w-screen-xl mx-auto px-6 mt-10">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 bg-[#111] border border-white/10 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A843] opacity-5 blur-[100px] rounded-full point-events-none" />
                    <div className="w-24 h-24 bg-[#1a1a1a] border border-[#D4A843]/30 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-[#D4A843]" />
                    </div>
                    <div>
                        <h1 className="text-display text-3xl font-bold mb-2">StellaNova</h1>
                        <p className="text-gray-400 max-w-xl">Digital alchemist specializing in generative environments and cybernetic simulations.</p>
                        <div className="mt-4 flex gap-4 text-sm font-accent tracking-widest text-[#D4A843]">
                            <span>{myUploads.length} ARTWORKS</span>
                            <span>•</span>
                            <span>0.5 ETH VOL</span>
                        </div>
                    </div>
                </div>

                {/* Uploaded Artworks */}
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold">Manage Works</h2>
                    <Link href="/upload" className="font-accent tracking-widest text-xs px-4 py-2 border border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843]/10 transition-colors rounded">
                        MINT NEW
                    </Link>
                </div>

                {myUploads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myUploads.map(art => (
                            <div key={art.id} className="bg-[#111] border border-white/10 p-3 rounded group cursor-pointer hover:border-[#D4A843]/50 transition-colors">
                                <div className="aspect-video bg-black rounded mb-4 overflow-hidden relative">
                                    <video src={art.videoSrc || art.image} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                </div>
                                <div className="px-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg truncate pr-2">{art.title}</h3>
                                        <span className="text-[#D4A843] font-accent text-xs whitespace-nowrap">{art.category}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{art.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#111] border border-white/5 rounded">
                        <p className="text-gray-500 mb-4">You haven't minted any premium works yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
