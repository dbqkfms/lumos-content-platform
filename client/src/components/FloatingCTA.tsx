import { CheckCircle2, MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { inquiryDraft, parseInquiryIntent, type InquiryIntent } from "@/lib/catalogPresentation";
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

  const [intent, setIntent] = useState<InquiryIntent>({});
  const generatedDraftRef = useRef("");
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const submittingRef = useRef(false);
  const openSequenceRef = useRef(0);

  const beginInquiry = useCallback((detail: unknown) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openSequenceRef.current += 1;
    const parsed = parseInquiryIntent(detail);
    const previousGenerated = generatedDraftRef.current;
    generatedDraftRef.current = inquiryDraft("", "", parsed.title).generated;
    setIntent(parsed);
    setFormState((current) => ({
      ...current,
      message: inquiryDraft(current.message, previousGenerated, parsed.title).message,
    }));
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsSubmitted(false);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handler = (event: Event) => beginInquiry((event as CustomEvent<unknown>).detail);
    window.addEventListener("open-contact", handler);
    return () => window.removeEventListener("open-contact", handler);
  }, [beginInquiry]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    requestRef.current?.abort();
  }, []);

  const updateField = (field: keyof ContactState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    const sequence = openSequenceRef.current;
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch("https://formspree.io/f/xpwzgqkl", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          company: formState.company,
          message: formState.message,
          artworkId: intent.artworkId,
          artworkTitle: intent.title,
          sourcePage: window.location.pathname,
          _subject: `[LUMOS Inquiry] ${formState.company || formState.name}`,
        }),
      });

      if (!response.ok) throw new Error("request failed");

      if (sequence !== openSequenceRef.current) return;
      setIsSubmitted(true);
      setFormState(initialState);
      toast.success("문의가 접수되었습니다.");
      closeTimerRef.current = setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 2200);
    } catch {
      if (controller.signal.aborted || sequence !== openSequenceRef.current) return;
      toast.error("문의 전송에 실패했습니다. 잠시 뒤 다시 시도해 주세요.");
    } finally {
      submittingRef.current = false;
      requestRef.current = null;
      if (!controller.signal.aborted) setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => beginInquiry(undefined)}
          className="fixed bottom-7 right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[#E0B754]/40 bg-[#E0B754] text-black shadow-[0_12px_36px_rgba(224,183,84,0.42)] transition hover:scale-105 hover:bg-[#f1c96c]"
          aria-label="Open inquiry"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      ) : null}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            showCloseButton={false}
            className="left-auto top-auto bottom-4 right-4 translate-x-0 translate-y-0 w-[min(calc(100vw-2rem),420px)] max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-none border-white/10 bg-[#0a0a0f] p-0 sm:bottom-7 sm:right-7"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus();
            }}
          >
            <div className="flex items-start justify-between border-b border-white/8 px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#E0B754]">LUMOS Inquiry</p>
                <DialogTitle className="font-display text-[2rem] leading-none text-white">도입 문의</DialogTitle>
                <DialogDescription className="sr-only">공간 조건과 선택한 작품을 담당자에게 전달합니다. 전송 전 입력 내용을 확인하세요.</DialogDescription>
              </div>
              <DialogClose type="button" aria-label="문의창 닫기" className="text-white/56 transition hover:text-white">
                <X className="h-4 w-4" />
              </DialogClose>
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
                  {intent.title ? (
                    <p className="border border-[#D4A843]/20 bg-[#D4A843]/5 px-3 py-2 text-sm text-[#E6C878]" data-testid="inquiry-artwork">
                      선택한 작품·공간: {intent.title}
                    </p>
                  ) : null}
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
          </DialogContent>
      </Dialog>
    </>
  );
}
