import { useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function Upload() {
    const [, setLocation] = useLocation();
    const { addArtwork } = useMarketplace();

    const [isMinting, setIsMinting] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Abstract");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    // New detailed fields
    const [displayType, setDisplayType] = useState<"Horizontal" | "Vertical">("Horizontal");
    const [resolution, setResolution] = useState("4K");
    const [runtime, setRuntime] = useState("");
    const [tags, setTags] = useState("");

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        setIsMinting(true);

        // Simulate blockchain/network delay
        setTimeout(() => {
            const newId = `user-art-${Date.now()}`;
            addArtwork({
                id: newId,
                title: title || "Untitled Flow",
                artist: "StellaNova",
                price: price || "0.1 ETH",
                category: category,
                description: description || "A new media art creation.",
                videoSrc: "https://files.manuscdn.com/user_upload_1740941913166", // fallback
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/91290999/zOmNxqqARpBQjmzb.png",
                displayType: displayType,
                runtime: runtime || "10s",
                resolution: resolution,
                tags: tags.split(",").map(t => t.trim()).filter(Boolean),
                worldType: "standard" // default to standard for user uploads
            });

            setIsMinting(false);
            toast.success("Artwork successfully minted to STANDARD World!");
            setLocation("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-20">
            <Header />
            <div className="max-w-3xl mx-auto px-6 mt-10">
                <div className="mb-10 text-center">
                    <h1 className="text-display text-4xl font-bold mb-4">Mint Your Art</h1>
                    <p className="text-gray-400">Upload your creations directly to the premium LUMOS Standard gallery.</p>
                </div>

                <form onSubmit={handleUpload} className="bg-[#111] p-8 border border-white/10 rounded-xl space-y-6 shadow-2xl">
                    <div className="border border-dashed border-gray-600 rounded-lg p-12 text-center bg-black/50 hover:bg-black transition-colors cursor-pointer group">
                        <UploadCloud className="w-10 h-10 mx-auto text-gray-400 group-hover:text-[#D4A843] transition-colors mb-4" />
                        <h3 className="font-bold text-lg mb-1">Click to browse video files</h3>
                        <p className="text-gray-500 text-sm">MP4, MOV up to 2GB</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">ARTWORK TITLE</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g., Neon Reverie" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">CATEGORY</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]">
                                <option>Abstract</option>
                                <option>Cosmic</option>
                                <option>Light</option>
                                <option>Nature</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">PRICE (ETH)</label>
                            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.5" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">DISPLAY</label>
                            <select value={displayType} onChange={e => setDisplayType(e.target.value as "Horizontal" | "Vertical")} className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]">
                                <option value="Horizontal">Horizontal (16:9)</option>
                                <option value="Vertical">Vertical (9:16)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">RESOLUTION</label>
                            <select value={resolution} onChange={e => setResolution(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]">
                                <option>4K</option>
                                <option>8K</option>
                                <option>1080p</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">RUNTIME</label>
                            <input type="text" value={runtime} onChange={e => setRuntime(e.target.value)} placeholder="e.g., 00:15" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">TAGS</label>
                        <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="ambient, neon, fluid (comma separated)" className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843]" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 font-accent tracking-widest">DESCRIPTION</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Tell the story behind this piece..." className="w-full bg-[#1a1a1a] border border-white/10 p-4 rounded text-white focus:outline-none focus:border-[#D4A843] resize-none" />
                    </div>

                    <button
                        type="submit"
                        disabled={isMinting}
                        className={`w-full py-4 font-bold tracking-widest text-sm rounded bg-[#D4A843] hover:bg-[#F0C060] text-black transition-all flex items-center justify-center gap-2 ${isMinting ? "opacity-70 cursor-wait" : ""}`}
                    >
                        {isMinting ? "MINTING TO GALLERY..." : <>MINT & PUBLISH <CheckCircle className="w-4 h-4" /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
