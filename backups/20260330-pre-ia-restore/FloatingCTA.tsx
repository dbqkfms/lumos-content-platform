/*
  FloatingCTA v3 — Real Email via Formspree
  - Formspree endpoint: https://formspree.io/f/xpwzgqkl (lumos contact)
  - Gold accent button
  - Dark popup with blur backdrop
  - Actual email delivery on submit
*/

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for open-contact event from Contact Us buttons
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formspree endpoint — replace FORM_ID with your actual Formspree form ID
      // To set up: go to https://formspree.io, create a form, get the ID
      // Default: sends to the email registered with Formspree account
      const FORMSPREE_ID = "xpwzgqkl";

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `[LUMOS 문의] ${formData.name}님의 문의`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("문의가 성공적으로 전송되었습니다!");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          setSubmitted(false);
          setIsOpen(false);
        }, 3000);
      } else {
        const data = await res.json();
        if (data.errors) {
          toast.error("전송 실패: " + data.errors.map((e: { message: string }) => e.message).join(", "));
        } else {
          toast.error("전송에 실패했습니다. 직접 이메일로 문의해 주세요.");
        }
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#D4A843] text-black shadow-[0_0_30px_rgba(212,168,67,0.4)] hover:bg-[#F0C060] hover:shadow-[0_0_40px_rgba(212,168,67,0.6)] transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Contact Us"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Contact Form Popup */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 bg-[#0f0f0f] border border-[#D4A843]/20 shadow-[0_20px_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="font-accent text-[10px] tracking-[0.25em] text-[#D4A843] mb-1">LUMOS</p>
                <h3 className="text-display text-2xl text-white">문의하기</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="py-8 flex flex-col items-center gap-4 text-center">
                <CheckCircle className="w-12 h-12 text-[#D4A843]" />
                <p className="text-white font-medium">문의가 전송되었습니다!</p>
                <p className="text-sm text-gray-400">빠른 시일 내에 답변 드리겠습니다.</p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-accent text-[10px] tracking-widest text-gray-500 mb-2">이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm focus:border-[#D4A843] focus:outline-none transition-colors placeholder-gray-700"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block font-accent text-[10px] tracking-widest text-gray-500 mb-2">이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm focus:border-[#D4A843] focus:outline-none transition-colors placeholder-gray-700"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block font-accent text-[10px] tracking-widest text-gray-500 mb-2">문의 내용 *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm focus:border-[#D4A843] focus:outline-none transition-colors resize-none placeholder-gray-700"
                    placeholder="문의하실 내용을 입력해주세요"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#D4A843] text-black font-accent text-xs tracking-widest hover:bg-[#F0C060] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-black/30 border-t-black rounded-full animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      문의 보내기
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Links */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="font-accent text-[10px] tracking-widest text-gray-600 mb-3">운영사</p>
              <div className="space-y-1.5">
                <a
                  href="https://www.thisglobal.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-[#D4A843] transition-colors block"
                >
                  디스글로벌 (thisglobal.kr)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
