import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

const SPACES_DATA = [
    {
        id: "hotel",
        title: "HOTEL LOBBY & LOUNGE",
        korTitle: "호텔 로비 & 라운지",
        desc: "방문객을 맞이하는 첫인상. 고급스럽고 차분한 앰비언트 비주얼로 공간의 품격을 한 단계 높입니다.",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop",
        recommendation: "Ambient Landscapes, Subtle Abstract, Gentle Fluid",
        linkText: "추천 콘텐츠 보기",
    },
    {
        id: "facade",
        title: "BUILDING FACADE & MEDIA WALL",
        korTitle: "빌딩 파사드 & 대형 미디어월",
        desc: "압도적인 스케일로 시선을 사로잡는 마이크로 파사드. 도시 풍경 속에서 가장 돋보이는 랜드마크를 완성합니다.",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2940&auto=format&fit=crop",
        recommendation: "High-impact 3D, Vibrant Kinetic, Hyper-realistic Space",
        linkText: "추천 콘텐츠 보기",
    },
    {
        id: "cafe",
        title: "CAFE & RESTAURANT",
        korTitle: "프리미엄 카페 & F&B",
        desc: "머물고 싶은 공간을 위한 미디어 아트. 감각적인 색채와 부드러운 움직임으로 색다른 분위기를 연출합니다.",
        image: "https://images.unsplash.com/photo-1561570198-5c4bb58da348?q=80&w=2940&auto=format&fit=crop",
        recommendation: "Cozy Nature, Watercolor Aesthetic, Relaxing Waves",
        linkText: "추천 콘텐츠 보기",
    },
    {
        id: "retail",
        title: "RETAIL & LUXURY BOUTIQUE",
        korTitle: "리테일 & 럭셔리 매장",
        desc: "브랜드 철학을 녹여내는 디지털 캔버스. 트렌디한 텍스처와 세련된 패턴으로 쇼핑 경험을 혁신합니다.",
        image: "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=2944&auto=format&fit=crop",
        recommendation: "Sophisticated Textures, Minimalist Geometry, Fashion Editorial",
        linkText: "추천 콘텐츠 보기",
    }
];

export default function Spaces() {
    const [, setLocation] = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-transparent" ref={containerRef}>
            <Header />

            {/* ─── Hero Section ─── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[#050508] z-0" />
                
                {/* Abstract Glow Background & Noise Texture */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[#D4A843]/15 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-[#93C5FD]/15 rounded-full blur-[150px]" />
                </div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none" />

                <div className="relative z-10 text-center px-6 mt-20">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-accent text-[10px] tracking-[0.5em] text-[#D4A843] mb-8"
                    >
                        SPACE INNOVATION
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-display font-light text-[3.5rem] md:text-[5rem] leading-none text-white/95 mb-8 tracking-tight drop-shadow-2xl"
                    >
                        공간에 생명을 불어넣는
                        <br /> <span className="text-[#a0a0a0] italic font-serif">빛의 예술</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        LUMOS의 하이엔드 미디어 아트는 어떤 공간이든 새로운 차원의 갤러리로 탈바꿈시킵니다.<br className="hidden md:block" />
                        당신의 공간에 어울리는 최적의 콘텐츠를 경험해 보세요.
                    </motion.p>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
                </motion.div>
            </section>

            {/* ─── Spaces List ─── */}
            <section className="relative z-10 pb-32">
                {SPACES_DATA.map((space, idx) => (
                    <SpaceSection key={space.id} space={space} index={idx} />
                ))}
            </section>

            {/* ─── CTA Section ─── */}
            <section className="py-40 px-6 md:px-12 bg-[#050508] border-t border-white/5 relative z-10 text-center">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay z-0 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <p className="font-accent text-[10px] tracking-[0.6em] text-[#D4A843] mb-6 drop-shadow-md">
                        TRANSFORM YOUR SPACE
                    </p>
                    <h2 className="text-display font-light text-[2.5rem] md:text-[3.5rem] leading-tight text-white/95 mb-8 text-shadow-strong">
                        디스플레이 그 이상의 가치
                    </h2>
                    <p className="font-body text-[0.9375rem] text-gray-400 font-light mb-12 leading-relaxed max-w-xl mx-auto">
                        디스글로벌의 전문 컨설턴트가 공간 맞춤형 LED 시스템 설계부터 LUMOS 콘텐츠 큐레이션까지 원스톱 솔루션을 제공합니다.
                    </p>
                    <button 
                        onClick={() => setLocation("/about")}
                        className="btn-brutalist hover:bg-white hover:text-black hover:border-white transition-all duration-300 drop-shadow-lg"
                    >
                        적용 문의하기
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-8 border-t border-white/5 bg-[#050508] relative z-20">
                <div className="w-full text-center">
                    <p className="font-accent text-[10px] tracking-[0.2em] text-gray-600">
                        © 2026 LUMOS. POWERED BY THISGLOBAL.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// ─── Individual Space Section Component ───
function SpaceSection({ space, index }: { space: any, index: number }) {
    const isEven = index % 2 === 0;

    return (
        <div className="w-full min-h-[80vh] flex flex-col md:flex-row items-center relative border-b border-white/5 overflow-hidden group">
            {/* Background Image Parallax (Mobile) */}
            <div className="absolute inset-0 block md:hidden opacity-30">
                <img src={space.image} alt={space.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
            </div>

            {/* Text Content */}
            <div className={`w-full md:w-1/2 p-10 md:p-24 lg:p-32 flex flex-col justify-center relative z-10 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px w-12 bg-[#D4A843]" />
                        <span className="font-accent text-[10px] tracking-[0.4em] text-[#D4A843]">0{index + 1}</span>
                    </div>
                    <h2 className="text-display font-light text-[2.5rem] md:text-[3.5rem] leading-none text-white mb-4 tracking-tight">
                        {space.korTitle}
                    </h2>
                    <p className="font-accent text-xs tracking-widest text-gray-500 mb-8 uppercase">
                        {space.title}
                    </p>
                    <p className="font-body text-lg text-gray-300 mb-10 leading-relaxed max-w-md break-keep">
                        {space.desc}
                    </p>

                    <div className="bg-white/5 border border-white/10 p-6 mb-10 backdrop-blur-sm">
                        <h4 className="font-accent text-[10px] tracking-[0.2em] text-[#93C5FD] mb-2">RECOMMENDED THEME</h4>
                        <p className="font-serif text-white/80 italic">{space.recommendation}</p>
                    </div>

                    <button className="flex items-center gap-3 font-body text-[0.9375rem] font-light text-[#D4A843] hover:text-white transition-colors group/btn cursor-pointer">
                        {space.linkText}
                        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Image Content */}
            <div className={`hidden md:block w-1/2 h-full absolute top-0 bottom-0 ${isEven ? 'right-0' : 'left-0'}`}>
                <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <img
                        src={space.image}
                        alt={space.title}
                        className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    {/* Fade Gradient to blend with text side */}
                    <div className={`absolute inset-0 bg-gradient-to-${isEven ? 'r' : 'l'} from-[#030303] via-transparent to-transparent opacity-80`} />
                </motion.div>
            </div>
        </div>
    );
}
