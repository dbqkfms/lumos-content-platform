// ArtworkContext — 데모용 작품/문의 상태 관리 (localStorage persist)
// happy path를 위한 mutable state wrapper
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Artwork,
  ArtworkStatus,
  Inquiry,
  InquiryStatus,
  StatusHistoryEntry,
} from "@/types";
import {
  MOCK_PORTAL_ARTWORKS,
  MOCK_INQUIRIES,
  VALID_TRANSITIONS,
} from "@/data/mockData";

interface ArtworkState {
  // 작품
  artworks: Artwork[];
  getArtwork: (id: string) => Artwork | undefined;
  getArtworksByArtist: (artistId: string) => Artwork[];
  getArtworksByStatus: (status: ArtworkStatus | "all") => Artwork[];
  addArtwork: (artwork: Omit<Artwork, "id" | "status" | "statusHistory">) => Artwork;
  updateArtworkStatus: (
    id: string,
    newStatus: ArtworkStatus,
    changedBy: string,
    note?: string
  ) => boolean;
  updateArtworkTier: (id: string, tier: "A" | "B" | "C") => void;
  updateArtworkReviewNotes: (id: string, notes: string) => void;

  // 문의
  inquiries: Inquiry[];
  getInquiry: (id: string) => Inquiry | undefined;
  addInquiry: (inquiry: Omit<Inquiry, "id" | "createdAt" | "updatedAt">) => Inquiry;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  updateInquiryNotes: (id: string, notes: string) => void;
}

const ArtworkContext = createContext<ArtworkState | undefined>(undefined);

const ARTWORKS_KEY = "lumos_artworks";
const INQUIRIES_KEY = "lumos_inquiries";

// 초기 데이터 로드 (localStorage 우선, 없으면 mock)
function loadArtworks(): Artwork[] {
  try {
    const stored = localStorage.getItem(ARTWORKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [...MOCK_PORTAL_ARTWORKS];
}

function loadInquiries(): Inquiry[] {
  try {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return [...MOCK_INQUIRIES];
}

export const ArtworkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>(loadArtworks);
  const [inquiries, setInquiries] = useState<Inquiry[]>(loadInquiries);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks));
  }, [artworks]);

  useEffect(() => {
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  }, [inquiries]);

  // --- 작품 ---
  const getArtwork = useCallback(
    (id: string) => artworks.find(a => a.id === id),
    [artworks]
  );

  const getArtworksByArtist = useCallback(
    (artistId: string) => artworks.filter(a => a.artistId === artistId),
    [artworks]
  );

  const getArtworksByStatus = useCallback(
    (status: ArtworkStatus | "all") =>
      status === "all" ? artworks : artworks.filter(a => a.status === status),
    [artworks]
  );

  const addArtwork = useCallback(
    (partial: Omit<Artwork, "id" | "status" | "statusHistory">): Artwork => {
      const now = new Date().toISOString();
      const id = `${partial.worldType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const artwork: Artwork = {
        ...partial,
        id,
        status: "draft",
        statusHistory: [
          {
            status: "draft",
            changedBy: partial.artistId || "unknown",
            changedAt: now,
          },
        ],
      };
      setArtworks(prev => [...prev, artwork]);
      return artwork;
    },
    []
  );

  const updateArtworkStatus = useCallback(
    (
      id: string,
      newStatus: ArtworkStatus,
      changedBy: string,
      note?: string
    ): boolean => {
      let success = false;
      setArtworks(prev =>
        prev.map(a => {
          if (a.id !== id) return a;
          const valid = VALID_TRANSITIONS[a.status];
          if (!valid.includes(newStatus)) return a;

          const now = new Date().toISOString();
          const entry: StatusHistoryEntry = {
            status: newStatus,
            changedBy,
            changedAt: now,
            note,
          };

          success = true;
          return {
            ...a,
            status: newStatus,
            statusHistory: [...(a.statusHistory || []), entry],
            ...(newStatus === "submitted" ? { submittedAt: now } : {}),
            ...(newStatus === "approved" || newStatus === "changes_requested"
              ? { reviewedAt: now }
              : {}),
            ...(newStatus === "published" ? { publishedAt: now } : {}),
            ...(note ? { reviewNotes: note } : {}),
          };
        })
      );
      return success;
    },
    []
  );

  const updateArtworkTier = useCallback(
    (id: string, tier: "A" | "B" | "C") => {
      setArtworks(prev =>
        prev.map(a => (a.id === id ? { ...a, curationTier: tier } : a))
      );
    },
    []
  );

  const updateArtworkReviewNotes = useCallback(
    (id: string, notes: string) => {
      setArtworks(prev =>
        prev.map(a => (a.id === id ? { ...a, reviewNotes: notes } : a))
      );
    },
    []
  );

  // --- 문의 ---
  const getInquiry = useCallback(
    (id: string) => inquiries.find(i => i.id === id),
    [inquiries]
  );

  const addInquiry = useCallback(
    (
      partial: Omit<Inquiry, "id" | "createdAt" | "updatedAt">
    ): Inquiry => {
      const now = new Date().toISOString();
      const inquiry: Inquiry = {
        ...partial,
        id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      setInquiries(prev => [...prev, inquiry]);
      return inquiry;
    },
    []
  );

  const updateInquiryStatus = useCallback(
    (id: string, status: InquiryStatus) => {
      setInquiries(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, status, updatedAt: new Date().toISOString() }
            : i
        )
      );
    },
    []
  );

  const updateInquiryNotes = useCallback(
    (id: string, notes: string) => {
      setInquiries(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, notes, updatedAt: new Date().toISOString() }
            : i
        )
      );
    },
    []
  );

  return (
    <ArtworkContext.Provider
      value={{
        artworks,
        getArtwork,
        getArtworksByArtist,
        getArtworksByStatus,
        addArtwork,
        updateArtworkStatus,
        updateArtworkTier,
        updateArtworkReviewNotes,
        inquiries,
        getInquiry,
        addInquiry,
        updateInquiryStatus,
        updateInquiryNotes,
      }}
    >
      {children}
    </ArtworkContext.Provider>
  );
};

export const useArtworks = () => {
  const context = useContext(ArtworkContext);
  if (!context) {
    throw new Error("useArtworks must be used within ArtworkProvider");
  }
  return context;
};
