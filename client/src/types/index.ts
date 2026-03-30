// LUMOS 타입 정의 — source-of-truth.md §5 기준

// --- Roles ---
export type UserRole = "guest" | "buyer" | "artist" | "admin";

// --- Artwork Status ---
export type ArtworkStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "hidden"
  | "archived";

// --- Inquiry Status ---
export type InquiryStatus =
  | "new"
  | "contacted"
  | "proposal_sent"
  | "negotiating"
  | "closed_won"
  | "closed_lost";

// --- Resize Request Status ---
export type ResizeStatus =
  | "requested"
  | "in_progress"
  | "completed"
  | "rejected";

// --- Preview Policy ---
export interface PreviewPolicy {
  mode: "duration" | "percentage" | "full";
  value?: number;
  watermark: boolean;
  maxResolution: "720p" | "1080p" | "original";
}

// --- Status History ---
export interface StatusHistoryEntry {
  status: ArtworkStatus;
  changedBy: string;
  changedAt: string;
  note?: string;
}

// --- Artwork (확장) ---
export interface Artwork {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  videoSrc?: string;
  displayType: "Horizontal" | "Vertical";
  runtime: string;
  resolution: string;
  worldType: "standard" | "local";
  artist: string;
  artistId?: string;
  format?: string;
  status: ArtworkStatus;
  curationTier?: "A" | "B" | "C";
  previewPolicy?: PreviewPolicy;
  submittedAt?: string;
  reviewedAt?: string;
  publishedAt?: string;
  reviewNotes?: string;
  statusHistory?: StatusHistoryEntry[];
  collection?: string;
}

// --- User ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  portfolio?: string;
  createdAt: string;
}

// --- Resize Request ---
export interface ResizeRequest {
  targetWidth: number;
  targetHeight: number;
  targetOrientation: "Horizontal" | "Vertical";
  notes?: string;
  status: ResizeStatus;
}

// --- Inquiry ---
export interface Inquiry {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany?: string;
  spaceType?: string;
  artworkId?: string;
  artworkTitle?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  resizeRequest?: ResizeRequest;
}

// --- Status 색상 매핑 ---
export const STATUS_COLORS: Record<ArtworkStatus, { bg: string; text: string }> =
  {
    draft: { bg: "bg-gray-800", text: "text-gray-400" },
    submitted: { bg: "bg-amber-900/30", text: "text-amber-400" },
    under_review: { bg: "bg-purple-900/30", text: "text-purple-400" },
    changes_requested: { bg: "bg-red-900/30", text: "text-red-400" },
    approved: { bg: "bg-emerald-900/30", text: "text-emerald-400" },
    published: { bg: "bg-blue-900/30", text: "text-blue-400" },
    hidden: { bg: "bg-gray-800", text: "text-gray-500" },
    archived: { bg: "bg-gray-900", text: "text-gray-600" },
  };

export const STATUS_LABELS: Record<ArtworkStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  changes_requested: "Changes Requested",
  approved: "Approved",
  published: "Published",
  hidden: "Hidden",
  archived: "Archived",
};

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  negotiating: "Negotiating",
  closed_won: "Closed (Won)",
  closed_lost: "Closed (Lost)",
};
