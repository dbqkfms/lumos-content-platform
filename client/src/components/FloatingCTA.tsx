import { CheckCircle2, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ContactState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialState: ContactState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState<ContactState>(initialState);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ prefill?: string }>).detail;
      if (detail?.prefill) {
        setFormState((current) => ({
          ...current,
          message: current.message || `${detail.prefill} 관련 적용 가능성과 라이선스 범위를 확인하고 싶습니다.`,
        }));
      }
      setIsOpen(true);
    };

    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const updateField = (field: keyof ContactState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xpwzgqkl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          company: formState.company,
          message: formState.message,
          _subject: `[LUMOS Inquiry] ${formState.company || formState.name}`,
        }),
      });

      if (!response.ok) throw new Error("request failed");

      setIsSubmitted(true);
      setFormState(initialState);
      toast.success("문의가 접수되었습니다.");
      window.setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 2200);
    } catch {
      toast.error("문의 전송에 실패했습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#E0B754]/40 bg-[#E0B754] text-black shadow-[0_12px_36px_rgba(224,183,84,0.42)] transition hover:scale-105 hover:bg-[#f1c96c]"
          aria-label="Open inquiry"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      ) : null}

      {isOpen ? (
        <>
          <div className="fixed inset-0 z-40 bg-black/72 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-7 right-7 z-50 w-[min(92vw,420px)] border border-white/10 bg-[#0a0a0f] shadow-[0_24px_100px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#E0B754]">LUMOS Inquiry</p>
                <h3 className="font-display text-[2rem] leading-none text-white">도입 문의</h3>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-white/56 transition hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-6">
              {isSubmitted ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#E0B754]" />
                  <div>
                    <p className="text-lg text-white">문의가 전송되었습니다.</p>
                    <p className="mt-1 text-sm text-white/62">적용 공간과 콘텐츠 방향을 검토한 뒤 빠르게 회신드리겠습니다.</p>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-white/46">Name</span>
                      <input
                        value={formState.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        required
                        className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E0B754]/40"
                        placeholder="담당자 이름"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-white/46">Email</span>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        required
                        className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E0B754]/40"
                        placeholder="name@company.com"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/46">Company / Space</span>
                    <input
                      value={formState.company}
                      onChange={(event) => updateField("company", event.target.value)}
                      className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-[#E0B754]/40"
                      placeholder="브랜드명, 프로젝트명, 적용 공간"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/46">Message</span>
                    <textarea
                      value={formState.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      required
                      rows={5}
                      className="w-full resize-none border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[#E0B754]/40"
                      placeholder="원하는 공간 분위기, 화면 수량, 검토 중인 페이지 등을 알려 주세요."
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 border border-[#E0B754]/30 bg-[#E0B754] px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-black transition hover:bg-[#f1c96c] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Sending" : "Send Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
