/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCheck,
  Check,
  Megaphone,
  BarChart2,
  Inbox,
  ChevronDown,
  X,
  Play,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  CheckSquare,
  Film,
  Music,
  AlertCircle,
  ArrowUp,
  Clock,
  User,
  Users,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws")
  .replace(/^https/, "wss")
  

const BROADCAST_ROLES = ["registrar"];

const ROLES = {
  registrar: { color: "#2563EB", label: "Registrar" },
  bursar: { color: "#D97706", label: "Bursar" },
  hr: { color: "#16A34A", label: "HR" },
  hr_manager: { color: "#16A34A", label: "HR" },
  accountant: { color: "#0891B2", label: "Accountant" },
  teacher: { color: "#7C3AED", label: "Teacher" },
  school_deputyadmin: { color: "#DB2777", label: "Dep. Admin" },
  deputyadmin: { color: "#DB2777", label: "Dep. Admin" },
  deputy_principal: { color: "#DB2777", label: "Dep. Principal" },
  principal: { color: "#DC2626", label: "Principal" },
  admin: { color: "#DC2626", label: "Admin" },
};

// ── File type helpers ─────────────────────────────────────────────────────

const VIDEO_EXTS = [
  ".mp4",
  ".m4v",
  ".webm",
  ".mov",
  ".qt",
  ".avi",
  ".mkv",
  ".mk3d",
  ".mpeg",
  ".mpg",
  ".ogv",
  ".3gp",
  ".3g2",
];
const IMAGE_EXTS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  ".ico",
];
const AUDIO_EXTS = [
  ".mp3",
  ".wav",
  ".ogg",
  ".aac",
  ".m4a",
  ".flac",
  ".opus",
  ".weba",
  ".wma",
  ".amr",
  ".oga",
];

const getMimeType = (att) => (att.content_type || att.type || "").toLowerCase();
const getFileName = (att) =>
  (att.original_name || att.name || "").toLowerCase();

function isVideo(att) {
  const mime = getMimeType(att),
    name = getFileName(att);
  return mime.startsWith("video/") || VIDEO_EXTS.some((e) => name.endsWith(e));
}
function isImage(att) {
  if (isVideo(att)) return false;
  const mime = getMimeType(att),
    name = getFileName(att);
  return mime.startsWith("image/") || IMAGE_EXTS.some((e) => name.endsWith(e));
}
function isAudio(att) {
  if (isVideo(att)) return false;
  const mime = getMimeType(att),
    name = getFileName(att);
  return mime.startsWith("audio/") || AUDIO_EXTS.some((e) => name.endsWith(e));
}

function resolveFileMime(file) {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const name = file.name.toLowerCase();
  const map = {
    ".mp4": "video/mp4",
    ".m4v": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".qt": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".mk3d": "video/x-matroska",
    ".mpeg": "video/mpeg",
    ".mpg": "video/mpeg",
    ".ogv": "video/ogg",
    ".3gp": "video/3gpp",
    ".3g2": "video/3gpp2",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
    ".ico": "image/x-icon",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".oga": "audio/ogg",
    ".aac": "audio/aac",
    ".m4a": "audio/mp4",
    ".flac": "audio/flac",
    ".opus": "audio/opus",
    ".weba": "audio/webm",
    ".wma": "audio/x-ms-wma",
    ".amr": "audio/amr",
  };
  for (const [ext, mime] of Object.entries(map))
    if (name.endsWith(ext)) return mime;
  return file.type || "application/octet-stream";
}

function normalizeNotification(n) {
  if (!n) return n;
  return {
    ...n,
    attachments: Array.isArray(n.attachments) ? n.attachments : [],
    poll: n.poll ?? null,
  };
}

function getRoleInfo(role) {
  const key = (role || "").toLowerCase().replace(/[\s-]/g, "_");
  return ROLES[key] || { color: "#6B7280", label: role || "Staff" };
}

function getInitials(name = "?") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso),
    now = new Date();
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function attachmentLabel(att) {
  if (isVideo(att)) return "Video";
  if (isAudio(att)) return "Audio";
  if (isImage(att)) return "Photo";
  return att.original_name || att.name || "File";
}

// ── API helper ────────────────────────────────────────────────────────────

const api = {
  async call(authHeaders, path, opts = {}) {
    const isFormData = opts.body instanceof FormData;
    const headers = { ...(authHeaders || {}) };
    if (!isFormData) headers["Content-Type"] = "application/json";
    else delete headers["Content-Type"];
    const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (csrf) headers["X-CSRFToken"] = csrf;
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      credentials: "include",
      ...opts,
    });
    if (res.status === 401) {
      window.location.href = "/auth/login/";
      return;
    }
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const ct = res.headers.get("content-type") || "";
        errMsg = ct.includes("application/json")
          ? JSON.stringify(await res.json())
          : (await res.text()) || errMsg;
      } catch (_e) {
        errMsg = `HTTP ${res.status} (and error parsing response)`;
      }
      throw new Error(errMsg);
    }
    return res.json();
  },
};

// ── Design tokens ─────────────────────────────────────────────────────────

const T = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  border: "#E8E8E8",
  borderMid: "#D4D4D4",
  text: "#111827",
  textMid: "#4B5563",
  textMuted: "#9CA3AF",
  accent: "#1D4ED8",
  accentBg: "#EFF6FF",
  accentHov: "#1E40AF",
  green: "#059669",
  greenBg: "#ECFDF5",
  greenLight: "#D1FAE5",
  red: "#DC2626",
  amber: "#D97706",
  bubble: "#E8F0FD",
  bubbleMe: "#DCF8C6",
  sideW: 270,
};

// ── UI Atoms ──────────────────────────────────────────────────────────────

function Avatar({ name, role, size = 36 }) {
  const { color } = getRoleInfo(role);
  const [r, g, b] = color
    .replace("#", "")
    .match(/.{2}/g)
    .map((h) => parseInt(h, 16));
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: `rgba(${r},${g},${b},0.12)`,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.35,
        border: `1.5px solid rgba(${r},${g},${b},0.25)`,
        letterSpacing: "-0.5px",
        flexShrink: 0,
        fontFamily: "monospace",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function RolePill({ role }) {
  const { color, label } = getRoleInfo(role);
  const [r, g, b] = color
    .replace("#", "")
    .match(/.{2}/g)
    .map((h) => parseInt(h, 16));
  return (
    <span
      style={{
        background: `rgba(${r},${g},${b},0.08)`,
        color,
        fontSize: 10,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <span
      style={{
        background: T.green,
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 30,
        padding: "1px 6px",
        minWidth: 18,
        textAlign: "center",
        lineHeight: "16px",
        display: "inline-block",
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Attachment Renderer ───────────────────────────────────────────────────

function AttachmentRenderer({ att, inBubble = false, isMe = false }) {
  const url = att.url || "";
  const name = att.original_name || att.name || "file";
  const attIsVideo = isVideo(att);
  const attIsAudio = !attIsVideo && isAudio(att);
  const attIsImage = !attIsVideo && !attIsAudio && isImage(att);

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: isMe ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.05)",
    border: `1px solid ${isMe ? "rgba(0,0,0,0.18)" : T.border}`,
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    color: isMe ? "#1a3a1a" : T.text,
    marginTop: inBubble ? 6 : 0,
  };

  if (!url) {
    const Icon = attIsVideo
      ? Film
      : attIsAudio
        ? Music
        : attIsImage
          ? ImageIcon
          : FileText;
    return (
      <div style={chipStyle}>
        <Icon size={13} />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 160,
          }}
        >
          {name}
        </span>
        <span style={{ opacity: 0.5, fontSize: 10 }}>Loading…</span>
      </div>
    );
  }

  if (attIsImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "block", marginTop: inBubble ? 6 : 0 }}
      >
        <img
          src={url}
          alt={name}
          style={{
            maxWidth: 220,
            maxHeight: 200,
            borderRadius: 8,
            display: "block",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </a>
    );
  }

  if (attIsVideo) {
    return (
      <div style={{ marginTop: inBubble ? 6 : 0 }}>
        <video
          controls
          preload="metadata"
          style={{
            maxWidth: 260,
            maxHeight: 180,
            borderRadius: 8,
            display: "block",
            background: "#000",
            width: "100%",
          }}
        >
          <source src={url} type={getMimeType(att) || "video/mp4"} />
        </video>
        <div
          style={{
            fontSize: 11,
            marginTop: 3,
            opacity: 0.7,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Film size={11} /> {name}
          {att.size ? ` · ${formatBytes(att.size)}` : ""}
        </div>
      </div>
    );
  }

  if (attIsAudio) {
    return (
      <div style={{ marginTop: inBubble ? 6 : 0 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: isMe ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${isMe ? "rgba(255,255,255,0.28)" : T.border}`,
            borderRadius: 10,
            padding: "8px 10px",
            maxWidth: 260,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              opacity: 0.75,
            }}
          >
            <Music size={13} />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {name}
            </span>
            {att.size && (
              <span style={{ fontSize: 10, flexShrink: 0 }}>
                {formatBytes(att.size)}
              </span>
            )}
          </div>
          <audio
            controls
            preload="metadata"
            style={{
              width: "100%",
              height: 32,
              borderRadius: 6,
              outline: "none",
            }}
          >
            <source src={url} type={getMimeType(att) || "audio/mpeg"} />
            <a href={url} target="_blank" rel="noopener noreferrer">
              Download audio
            </a>
          </audio>
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={name}
      style={{
        textDecoration: "none",
        display: "inline-flex",
        marginTop: inBubble ? 6 : 0,
      }}
    >
      <div style={{ ...chipStyle, maxWidth: 220, cursor: "pointer" }}>
        <FileText size={13} style={{ flexShrink: 0 }} />
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {name}
        </span>
        {att.size && (
          <span style={{ opacity: 0.65, fontSize: 10, flexShrink: 0 }}>
            {formatBytes(att.size)}
          </span>
        )}
      </div>
    </a>
  );
}

function PendingChip({ att, onRemove }) {
  const isVid = isVideo(att),
    isAud = !isVid && isAudio(att),
    isImg = !isVid && !isAud && isImage(att);
  const Icon = isVid ? Film : isAud ? Music : isImg ? ImageIcon : FileText;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "4px 8px",
        fontSize: 12,
        color: T.textMid,
      }}
    >
      <Icon size={12} />
      <span
        style={{
          maxWidth: 110,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {att.name}
      </span>
      {att.size && (
        <span style={{ color: T.textMuted, fontSize: 10 }}>
          {formatBytes(att.size)}
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.textMuted,
            padding: 0,
            display: "flex",
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ── Poll Widget ───────────────────────────────────────────────────────────

function PollWidget({ poll, onVote }) {
  if (!poll) return null;
  const total = poll.total_votes || 0;
  return (
    <div
      style={{
        marginTop: 10,
        background: "rgba(0,0,0,0.04)",
        borderRadius: 10,
        padding: "10px 12px",
        minWidth: 220,
        border: `1px solid ${T.border}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: T.text,
        }}
      >
        <BarChart2 size={13} /> {poll.question}
      </div>
      {poll.options.map((opt, idx) => {
        const votes = poll.tally?.[idx] ?? 0;
        const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
        const voted = poll.user_vote === idx;
        return (
          <button
            key={idx}
            onClick={() => onVote?.(poll.id, idx)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: voted ? T.greenBg : "rgba(255,255,255,0.6)",
              border: voted
                ? `1.5px solid ${T.green}`
                : `1px solid ${T.border}`,
              borderRadius: 7,
              padding: "6px 10px",
              marginBottom: 6,
              cursor: onVote ? "pointer" : "default",
              color: T.text,
              fontFamily: "inherit",
              fontSize: 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${pct}%`,
                background: "rgba(5,150,105,0.10)",
                transition: "width 0.4s",
              }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                fontWeight: voted ? 600 : 400,
              }}
            >
              {opt}
            </span>
            <span
              style={{
                position: "relative",
                zIndex: 1,
                float: "right",
                opacity: 0.6,
                fontSize: 11,
              }}
            >
              {pct}%{votes > 0 ? ` (${votes})` : ""}
            </span>
          </button>
        );
      })}
      <div style={{ fontSize: 10, color: T.textMuted, marginTop: 4 }}>
        {total} vote{total !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

// ── Context Menu ──────────────────────────────────────────────────────────

function MsgContextMenu({ visible, onEdit, onDelete, style }) {
  if (!visible) return null;
  const btnBase = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: "9px 14px",
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    borderRadius: 6,
  };
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 100,
        background: T.surface,
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
        minWidth: 130,
        border: `1px solid ${T.border}`,
        ...style,
      }}
    >
      <div style={{ padding: 4 }}>
        <button
          onClick={onEdit}
          style={{ ...btnBase, color: T.text }}
          onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Edit2 size={14} /> Edit
        </button>
        <button
          onClick={onDelete}
          style={{ ...btnBase, color: T.red }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────

function SectionLabel({ label }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: T.textMuted,
        padding: "10px 16px 4px",
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────

function Sidebar({
  staff,
  conversations,
  broadcasts,
  activePartnerId,
  activeBroadcastId,
  onSelectPartner,
  onSelectBroadcast,
  chatUnread,
  inboxUnread,
  view,
  onViewChange,
  loading,
  currentUserId,
  canBroadcast,
}) {
  const [search, setSearch] = useState("");
  const convMap = Object.fromEntries(
    conversations.map((c) => [c.partner.id, c]),
  );

  const filtered = staff.filter((s) =>
    (s.full_name + s.role + s.username + s.email)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const grouped = {};
  filtered.forEach((s) => {
    const label = getRoleInfo(s.role).label;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  const tabs = [
    { id: "chat", label: "Chats", Icon: MessageSquare, badge: chatUnread },
    { id: "inbox", label: "Inbox", Icon: Bell, badge: inboxUnread },
    ...(canBroadcast
      ? [{ id: "broadcast", label: "Broadcast", Icon: Megaphone, badge: 0 }]
      : []),
  ];

  return (
    <div
      style={{
        width: T.sideW,
        minWidth: T.sideW,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 16px 0" }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: T.text,
            marginBottom: 14,
            letterSpacing: "-0.3px",
          }}
        >
          Messages
        </div>

        {/* Tab strip */}
        <div
          style={{
            display: "flex",
            gap: 2,
            background: T.bg,
            borderRadius: 10,
            padding: 3,
            marginBottom: 12,
          }}
        >
          {tabs.map((t) => {
            const active = view === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onViewChange(t.id)}
                style={{
                  flex: 1,
                  padding: "7px 4px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: active ? T.surface : "transparent",
                  color: active ? T.text : T.textMuted,
                  fontFamily: "inherit",
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <t.Icon size={13} />
                {t.label}
                {t.badge > 0 && (
                  <span
                    style={{
                      background: T.green,
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      borderRadius: 20,
                      padding: "1px 5px",
                      lineHeight: "14px",
                    }}
                  >
                    {t.badge > 99 ? "99+" : t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {view === "chat" && (
        <div style={{ padding: "0 12px 8px" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: T.textMuted,
              }}
            />
            <input
              type="text"
              placeholder="Search staff…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                fontSize: 13,
                padding: "8px 10px 8px 30px",
                borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: T.bg,
                color: T.text,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {view === "chat" && (
          <>
            {broadcasts.length > 0 && (
              <div>
                <SectionLabel label="Broadcasts" />
                {broadcasts.map((b) => {
                  const isActive = activeBroadcastId === b.id;
                  const isUnread = b.status === "Unread";
                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectBroadcast(b)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 14px",
                        cursor: "pointer",
                        background: isActive ? T.accentBg : "transparent",
                        borderLeft: isActive
                          ? `3px solid ${T.accent}`
                          : "3px solid transparent",
                        transition: "all 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = T.bg;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          minWidth: 38,
                          borderRadius: "50%",
                          background: isActive ? T.accentBg : "#F0FDF4",
                          color: isActive ? T.accent : T.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${isActive ? T.accent + "33" : T.greenLight}`,
                        }}
                      >
                        {b.poll ? (
                          <BarChart2 size={16} />
                        ) : (
                          <Megaphone size={16} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: isUnread ? 700 : 500,
                              color: T.text,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {b.title}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: isUnread ? T.green : T.textMuted,
                              whiteSpace: "nowrap",
                              marginLeft: 4,
                            }}
                          >
                            {formatTime(b.sent_at)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: T.textMuted,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {b.sent_by?.full_name} ·{" "}
                            {b.recipient_type === "All"
                              ? "All Staff"
                              : b.recipient_role}
                          </span>
                          {isUnread && <Badge count={1} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {loading ? (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: T.textMuted,
                  fontSize: 13,
                }}
              >
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: T.textMuted,
                  fontSize: 13,
                }}
              >
                No staff found
              </div>
            ) : (
              Object.entries(grouped).map(([roleLabel, members]) => (
                <div key={roleLabel}>
                  <SectionLabel label={roleLabel} />
                  {members.map((s) => {
                    const conv = convMap[s.id];
                    const isActive =
                      activePartnerId === s.id && !activeBroadcastId;
                    const unreadCount = conv?.unread_count || 0;
                    const lastMsg = conv?.last_message
                      ? normalizeNotification(conv.last_message)
                      : null;
                    const lastAtt = lastMsg?.attachments?.[0];
                    const lastPreview = lastAtt
                      ? attachmentLabel(lastAtt)
                      : lastMsg?.message || "";
                    return (
                      <div
                        key={s.id}
                        onClick={() => onSelectPartner(s)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "9px 14px",
                          cursor: "pointer",
                          background: isActive ? T.accentBg : "transparent",
                          borderLeft: isActive
                            ? `3px solid ${T.accent}`
                            : "3px solid transparent",
                          transition: "all 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = T.bg;
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Avatar name={s.full_name} role={s.role} size={38} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: unreadCount ? 700 : 500,
                                color: T.text,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {s.full_name}
                            </span>
                            {lastMsg && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: unreadCount ? T.green : T.textMuted,
                                  whiteSpace: "nowrap",
                                  marginLeft: 4,
                                }}
                              >
                                {formatTime(lastMsg.sent_at)}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            {lastMsg ? (
                              <span
                                style={{
                                  fontSize: 12,
                                  color: T.textMuted,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                }}
                              >
                                {lastMsg.sent_by?.id === currentUserId
                                  ? "You: "
                                  : ""}
                                {lastPreview}
                              </span>
                            ) : (
                              <span
                                style={{ fontSize: 12, color: T.borderMid }}
                              >
                                No messages yet
                              </span>
                            )}
                            {unreadCount > 0 && <Badge count={unreadCount} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Broadcast Detail ──────────────────────────────────────────────────────

function BroadcastDetailView({ broadcast, onVote }) {
  const b = normalizeNotification(broadcast);
  const priorityColor =
    b.priority === "Urgent" ? T.red : b.priority === "High" ? T.amber : null;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: T.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: T.accentBg,
            color: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${T.accent}22`,
          }}
        >
          {b.poll ? <BarChart2 size={17} /> : <Megaphone size={17} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
            {b.title}
          </div>
          <div style={{ fontSize: 12, color: T.textMuted }}>
            {b.recipient_type === "All" ? "All Staff" : b.recipient_role} · from{" "}
            {b.sent_by?.full_name}
          </div>
        </div>
        <span style={{ fontSize: 12, color: T.textMuted }}>
          {formatTime(b.sent_at)}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          padding: "28px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 680,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Avatar
            name={b.sent_by?.full_name}
            role={b.sent_by?.role}
            size={34}
          />
          <div style={{ maxWidth: "80%" }}>
            <div
              style={{
                fontSize: 12,
                color: T.textMuted,
                marginBottom: 5,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {b.sent_by?.full_name} <RolePill role={b.sent_by?.role} />
            </div>
            <div
              style={{
                background: T.surface,
                borderRadius: "0 12px 12px 12px",
                padding: "12px 16px",
                border: `1px solid ${T.border}`,
                fontSize: 14,
                lineHeight: 1.65,
                color: T.text,
              }}
            >
              {priorityColor && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: priorityColor,
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {b.priority === "Urgent" ? (
                    <AlertCircle size={12} />
                  ) : (
                    <ArrowUp size={12} />
                  )}
                  {b.priority === "Urgent" ? "Urgent" : "High Priority"}
                </div>
              )}
              {b.message}
              {b.attachments.map((a) => (
                <AttachmentRenderer key={a.id} att={a} inBubble />
              ))}
              {b.poll && <PollWidget poll={b.poll} onVote={onVote} />}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.textMuted,
                marginTop: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {formatTime(b.sent_at)}
              {b.status === "Read" && <CheckCheck size={13} color="#53bdeb" />}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${T.border}`,
          padding: "10px 20px",
          background: T.surface,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 12, color: T.textMuted }}>
          Broadcast message — replies not supported
        </span>
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isMe,
  sameGroup,
  onStartEdit,
  onDelete,
  onVote,
  color,
  editingId,
  editText,
  setEditText,
  onSubmitEdit,
  onCancelEdit,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const message = normalizeNotification(msg);
  const hasText = Boolean(message.message?.trim());
  const hasAttachments = message.attachments.length > 0;
  const isEditing = editingId === message.id;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMe ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 6,
        marginTop: sameGroup ? 1 : 10,
        position: "relative",
      }}
    >
      {!isMe && !sameGroup && (
        <Avatar
          name={message.sent_by?.full_name}
          role={message.sent_by?.role}
          size={28}
        />
      )}
      {!isMe && sameGroup && <div style={{ width: 28, flexShrink: 0 }} />}

      <div style={{ position: "relative", maxWidth: "65%" }}>
        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmitEdit(message.id);
                }
                if (e.key === "Escape") onCancelEdit();
              }}
              rows={2}
              autoFocus
              style={{
                fontSize: 14,
                padding: "8px 12px",
                borderRadius: 10,
                border: `2px solid ${T.accent}`,
                background: T.surface,
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
                color: T.text,
                lineHeight: 1.5,
                width: 240,
              }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => onSubmitEdit(message.id)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: T.accent,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  background: T.surface,
                  color: T.textMid,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {isMe && (
              <div
                onClick={() => setShowMenu((v) => !v)}
                style={{
                  position: "absolute",
                  top: 4,
                  left: -4,
                  background: T.bubbleMe,
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 2,
                  opacity: showMenu ? 1 : 0,
                  transition: "opacity 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                }}
                className="msg-chevron"
              >
                <ChevronDown size={12} color={T.textMid} />
              </div>
            )}

            <div
              style={{
                background: isMe ? T.bubbleMe : T.surface,
                color: T.text,
                borderRadius: isMe
                  ? "12px 12px 2px 12px"
                  : "12px 12px 12px 2px",
                padding: "8px 12px 5px",
                fontSize: 14,
                lineHeight: 1.55,
                border: `1px solid ${isMe ? "#b8e8a4" : T.border}`,
                wordBreak: "break-word",
              }}
              onMouseEnter={(e) => {
                if (!isMe) return;
                const ch =
                  e.currentTarget.parentElement.querySelector(".msg-chevron");
                if (ch) ch.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                if (!isMe || showMenu) return;
                const ch =
                  e.currentTarget.parentElement.querySelector(".msg-chevron");
                if (ch) ch.style.opacity = 0;
              }}
            >
              {!isMe && !sameGroup && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color,
                    marginBottom: 2,
                  }}
                >
                  {message.sent_by?.full_name}
                </div>
              )}

              {(message.priority === "Urgent" ||
                message.priority === "High") && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: message.priority === "Urgent" ? T.red : T.amber,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    marginBottom: 3,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {message.priority === "Urgent" ? (
                    <AlertCircle size={10} />
                  ) : (
                    <ArrowUp size={10} />
                  )}
                  {message.priority}
                </span>
              )}

              {hasText && (
                <span>
                  {message.message}
                  {message.edited && (
                    <span
                      style={{
                        fontSize: 10,
                        opacity: 0.5,
                        marginLeft: 5,
                        fontStyle: "italic",
                      }}
                    >
                      edited
                    </span>
                  )}
                </span>
              )}

              {hasAttachments && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginTop: hasText ? 6 : 0,
                  }}
                >
                  {message.attachments.map((a) => (
                    <AttachmentRenderer
                      key={a.id || a.url || a.original_name}
                      att={a}
                      inBubble
                      isMe={isMe}
                    />
                  ))}
                </div>
              )}

              {!hasText && !hasAttachments && (
                <span
                  style={{ fontSize: 12, opacity: 0.4, fontStyle: "italic" }}
                >
                  Message
                </span>
              )}

              {message.poll && (
                <PollWidget poll={message.poll} onVote={onVote} />
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 3,
                  marginTop: 4,
                }}
              >
                <span style={{ fontSize: 11, color: T.textMuted }}>
                  {formatTime(message.sent_at)}
                </span>
                {isMe &&
                  (message.status === "Read" ? (
                    <CheckCheck size={13} color="#53bdeb" />
                  ) : (
                    <Check size={13} color={T.textMuted} />
                  ))}
              </div>
            </div>

            {isMe && showMenu && (
              <div ref={menuRef}>
                <MsgContextMenu
                  visible
                  onEdit={() => {
                    onStartEdit(message);
                    setShowMenu(false);
                  }}
                  onDelete={() => {
                    setShowMenu(false);
                    if (window.confirm("Delete this message?"))
                      onDelete(message.id);
                  }}
                  style={{ top: 28, right: 0 }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Chat View ─────────────────────────────────────────────────────────────

function ChatView({
  partner,
  messages,
  onSend,
  onEdit,
  onDelete,
  onVote,
  loading,
  currentUserId,
}) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [showOpts, setShowOpts] = useState(false);
  const [sending, setSending] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const hasText = text.trim().length > 0;
    const hasFiles = pendingFiles.length > 0;
    if ((!hasText && !hasFiles) || !partner || sending) return;
    setSending(true);
    const msgText = text.trim();
    const filesToSend = [...pendingFiles];
    setText("");
    setPriority("Normal");
    setPendingFiles([]);

    let title = msgText.slice(0, 50);
    if (!title && hasFiles) {
      const f = filesToSend[0];
      title = isVideo(f)
        ? "Video"
        : isAudio(f)
          ? "Audio"
          : isImage(f)
            ? "Photo"
            : "File";
    }
    title = title || "Message";

    try {
      await onSend(
        partner.id,
        title,
        msgText,
        priority,
        "User",
        null,
        filesToSend,
      );
    } finally {
      setSending(false);
    }
    textareaRef.current?.focus();
  };

  const startEdit = (msg) => {
    setEditingId(msg.id);
    setEditText(msg.message);
  };
  const submitEdit = async (id) => {
    if (!editText.trim()) return;
    await onEdit(id, editText.trim());
    setEditingId(null);
    setEditText("");
  };

  if (!partner) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: T.bg,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: T.surface,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageSquare size={28} color={T.textMuted} />
        </div>
        <p
          style={{ color: T.textMid, fontSize: 14, margin: 0, fontWeight: 500 }}
        >
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  const { color } = getRoleInfo(partner.role);

  const priorityDef = {
    Low: { color: T.textMuted, bg: T.bg },
    Normal: { color: T.green, bg: T.greenBg },
    High: { color: T.amber, bg: "#FFFBEB" },
    Urgent: { color: T.red, bg: "#FEF2F2" },
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: T.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Avatar name={partner.full_name} role={partner.role} size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
            {partner.full_name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RolePill role={partner.role} />
            <span style={{ fontSize: 12, color: T.textMuted }}>
              {partner.email}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 10%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: T.textMuted,
              padding: 40,
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: T.textMuted,
              marginTop: 60,
              fontSize: 13,
            }}
          >
            No messages yet — say hello
          </div>
        ) : (
          messages.map(normalizeNotification).map((msg, i) => {
            const isMe = String(msg.sent_by?.id) === String(currentUserId);
            const prevMsg =
              i > 0 ? normalizeNotification(messages[i - 1]) : null;
            const sameGroup =
              prevMsg &&
              String(prevMsg.sent_by?.id) === String(msg.sent_by?.id);
            return (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMe={isMe}
                sameGroup={sameGroup}
                color={color}
                editingId={editingId}
                editText={editText}
                setEditText={setEditText}
                onStartEdit={startEdit}
                onSubmitEdit={submitEdit}
                onCancelEdit={() => setEditingId(null)}
                onDelete={onDelete}
                onVote={onVote}
              />
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div
        style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}
      >
        {showOpts && (
          <div
            style={{
              padding: "8px 16px 0",
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: T.textMuted,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Priority
            </span>
            {["Low", "Normal", "High", "Urgent"].map((p) => {
              const def = priorityDef[p];
              const active = priority === p;
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    border: `1.5px solid ${active ? def.color : T.border}`,
                    background: active ? def.bg : T.surface,
                    color: active ? def.color : T.textMuted,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.1s",
                  }}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}

        {pendingFiles.length > 0 && (
          <div
            style={{
              padding: "8px 16px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 5,
            }}
          >
            {pendingFiles.map((f, i) => (
              <PendingChip
                key={i}
                att={f}
                onRemove={() =>
                  setPendingFiles((prev) => prev.filter((_, j) => j !== i))
                }
              />
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            padding: "10px 14px",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              setPendingFiles((prev) => [
                ...prev,
                ...Array.from(e.target.files || []),
              ]);
              e.target.value = "";
            }}
            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Attach"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${T.border}`,
              background: T.bg,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = T.border)}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.bg)}
          >
            <Paperclip size={16} color={T.textMid} />
          </button>

          <button
            onClick={() => setShowOpts((o) => !o)}
            title="Options"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${showOpts ? T.accent : T.border}`,
              background: showOpts ? T.accentBg : T.bg,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.1s",
            }}
          >
            <MoreVertical size={16} color={showOpts ? T.accent : T.textMid} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${partner.full_name}…`}
            rows={1}
            style={{
              flex: 1,
              fontSize: 14,
              padding: "9px 14px",
              borderRadius: 20,
              border: `1px solid ${T.border}`,
              background: T.bg,
              color: T.text,
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              lineHeight: 1.5,
              maxHeight: 120,
              overflowY: "auto",
              transition: "border-color 0.1s",
            }}
            onFocus={(e) => (e.target.style.borderColor = T.accent)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && pendingFiles.length === 0) || sending}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background:
                (text.trim() || pendingFiles.length > 0) && !sending
                  ? T.accent
                  : T.border,
              cursor:
                (text.trim() || pendingFiles.length > 0) && !sending
                  ? "pointer"
                  : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            {sending ? (
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              <Send size={15} color="#fff" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inbox View ────────────────────────────────────────────────────────────

function InboxView({
  notifications,
  broadcasts,
  onRefresh,
  onMarkAll,
  loading,
}) {
  const directMsgs = notifications.filter(
    (n) => n.notification_type === "message",
  );
  const systemNotifs = notifications.filter(
    (n) => n.notification_type !== "message",
  );

  const typeColor = (t) =>
    ({
      alert: T.red,
      announcement: T.amber,
      system: T.accent,
      message: "#7C3AED",
    })[t] || "#6B7280";
  const typeBg = (t) =>
    ({
      alert: "#FEF2F2",
      announcement: "#FFFBEB",
      system: T.accentBg,
      message: "#F5F3FF",
    })[t] || T.bg;
  const typeLabel = (t) =>
    ({
      alert: "Alert",
      announcement: "Announcement",
      system: "System",
      message: "Message",
    })[t] || t;

  const renderItem = (rawN) => {
    const n = normalizeNotification(rawN);
    return (
      <div
        key={n.id}
        style={{
          borderBottom: `1px solid ${T.border}`,
          background: n.status === "Unread" ? "#F0FDF4" : T.surface,
          padding: "14px 20px",
          borderLeft:
            n.status === "Unread"
              ? `3px solid ${T.green}`
              : "3px solid transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 7,
          }}
        >
          <Avatar
            name={n.sent_by?.full_name}
            role={n.sent_by?.role}
            size={34}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                {n.sent_by?.full_name || "System"}
              </span>
              <RolePill role={n.sent_by?.role} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: typeBg(n.notification_type),
                  color: typeColor(n.notification_type),
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {typeLabel(n.notification_type)}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {n.status === "Unread" && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: T.green,
                  display: "inline-block",
                }}
              />
            )}
            <span style={{ fontSize: 11, color: T.textMuted }}>
              {formatTime(n.sent_at)}
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 3,
          }}
        >
          {n.title}
        </div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55 }}>
          {n.message ||
            (n.attachments.length > 0 ? attachmentLabel(n.attachments[0]) : "")}
        </div>
        {n.attachments.length > 0 && (
          <div
            style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}
          >
            {n.attachments.map((a) => (
              <AttachmentRenderer
                key={a.id}
                att={a}
                inBubble={false}
                isMe={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBroadcast = (rawN) => {
    const n = normalizeNotification(rawN);
    return (
      <div
        key={n.id}
        style={{
          borderBottom: `1px solid ${T.border}`,
          background: n.status === "Unread" ? "#EFF6FF" : T.surface,
          padding: "14px 20px",
          borderLeft:
            n.status === "Unread"
              ? `3px solid ${T.accent}`
              : "3px solid transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 7,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              minWidth: 34,
              borderRadius: "50%",
              background: T.accentBg,
              color: T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${T.accent}22`,
            }}
          >
            {n.poll ? <BarChart2 size={14} /> : <Megaphone size={14} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                {n.sent_by?.full_name || "Admin"}
              </span>
              <RolePill role={n.sent_by?.role} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 20,
                  background: T.accentBg,
                  color: T.accent,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Broadcast
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {n.status === "Unread" && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: T.accent,
                  display: "inline-block",
                }}
              />
            )}
            <span style={{ fontSize: 11, color: T.textMuted }}>
              {formatTime(n.sent_at)}
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: T.text,
            marginBottom: 3,
          }}
        >
          {n.title}
        </div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.55 }}>
          {n.message ||
            (n.attachments.length > 0 ? attachmentLabel(n.attachments[0]) : "")}
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>
          To: {n.recipient_type === "All" ? "All Staff" : n.recipient_role}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: T.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: T.surface,
        }}
      >
        <Bell size={16} color={T.textMid} />
        <span style={{ fontSize: 16, fontWeight: 600, color: T.text, flex: 1 }}>
          Inbox
        </span>
        <button
          onClick={onMarkAll}
          style={{
            fontSize: 12,
            color: T.textMid,
            border: `1px solid ${T.border}`,
            background: T.bg,
            cursor: "pointer",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            borderRadius: 7,
            fontFamily: "inherit",
          }}
        >
          <CheckSquare size={13} /> Mark all read
        </button>
        <button
          onClick={onRefresh}
          style={{
            fontSize: 12,
            color: T.accent,
            border: `1px solid ${T.accent}33`,
            background: T.accentBg,
            cursor: "pointer",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            borderRadius: 7,
            fontFamily: "inherit",
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: T.textMuted,
              padding: 40,
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        ) : notifications.length === 0 && broadcasts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: T.textMuted,
              marginTop: 60,
              fontSize: 13,
            }}
          >
            Inbox is empty
          </div>
        ) : (
          <>
            {broadcasts.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.textMuted,
                    padding: "10px 20px 4px",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    background: T.bg,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  Broadcasts
                </div>
                {broadcasts.map(renderBroadcast)}
              </>
            )}
            {directMsgs.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.textMuted,
                    padding: "10px 20px 4px",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    background: T.bg,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  Personal Messages
                </div>
                {directMsgs.map(renderItem)}
              </>
            )}
            {systemNotifs.length > 0 && (
              <>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.textMuted,
                    padding: "10px 20px 4px",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    background: T.bg,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  Notifications
                </div>
                {systemNotifs.map(renderItem)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Broadcast Send View ───────────────────────────────────────────────────

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#6B7280",
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const inputStyle = {
  width: "100%",
  fontSize: 14,
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${T.border}`,
  background: T.bg,
  color: T.text,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  marginBottom: 14,
  transition: "border-color 0.1s",
};

function BroadcastSendView({ onSend }) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "Normal",
    recipientType: "Role",
    recipientRole: "teacher",
  });
  const [state, setState] = useState("idle");
  const [attachments, setAttachments] = useState([]);
  const [addPoll, setAddPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const canSend =
    form.title.trim() &&
    form.message.trim() &&
    state === "idle" &&
    (!addPoll ||
      (pollQuestion.trim() && pollOptions.filter((o) => o.trim()).length >= 2));

  const handleSend = async () => {
    if (!canSend) return;
    setState("sending");
    try {
      await onSend(
        null,
        form.title,
        form.message,
        form.priority,
        form.recipientType,
        form.recipientRole,
        attachments,
        addPoll
          ? {
              question: pollQuestion,
              options: pollOptions.filter((o) => o.trim()),
            }
          : null,
      );
      setState("sent");
      setTimeout(() => setState("idle"), 3000);
      setForm((f) => ({ ...f, title: "", message: "" }));
      setAttachments([]);
      setAddPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const focusStyle = { borderColor: T.accent };

  return (
    <div style={{ flex: 1, overflow: "auto", background: T.bg }}>
      {/* Header */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: T.accentBg,
            color: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Megaphone size={16} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text }}>
            Broadcast Message
          </div>
          <div style={{ fontSize: 12, color: T.textMuted }}>
            Messages appear in recipients' Chat tab
          </div>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: 520 }}>
        {/* Recipients */}
        <label style={labelStyle}>Send to</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[
            ["Role", "Specific Role"],
            ["All", "All Staff"],
          ].map(([val, lbl]) => (
            <button
              key={val}
              onClick={() => set("recipientType", val)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                cursor: "pointer",
                border: `1.5px solid ${form.recipientType === val ? T.accent : T.border}`,
                background: form.recipientType === val ? T.accentBg : T.surface,
                color: form.recipientType === val ? T.accent : T.textMid,
                fontFamily: "inherit",
                transition: "all 0.1s",
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {form.recipientType === "Role" && (
          <>
            <label style={labelStyle}>Role</label>
            <select
              value={form.recipientRole}
              onChange={(e) => set("recipientRole", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {Object.entries(ROLES)
                .filter(([k]) => k !== "admin")
                .map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* Priority */}
        <label style={labelStyle}>Priority</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[
            ["Low", T.textMuted, T.bg, T.border],
            ["Normal", T.green, T.greenBg, T.green + "44"],
            ["High", T.amber, "#FFFBEB", T.amber + "44"],
            ["Urgent", T.red, "#FEF2F2", T.red + "44"],
          ].map(([p, col, bg, bdr]) => (
            <button
              key={p}
              onClick={() => set("priority", p)}
              style={{
                flex: 1,
                padding: "7px 0",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 8,
                cursor: "pointer",
                border: `1.5px solid ${form.priority === p ? bdr : T.border}`,
                background: form.priority === p ? bg : T.surface,
                color: form.priority === p ? col : T.textMuted,
                fontFamily: "inherit",
                transition: "all 0.1s",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Broadcast subject…"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = T.accent)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />

        <label style={labelStyle}>Message</label>
        <textarea
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={5}
          placeholder="Write your broadcast message…"
          style={{ ...inputStyle, resize: "vertical" }}
          onFocus={(e) => (e.target.style.borderColor = T.accent)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />

        <label style={labelStyle}>Attachments</label>
        <div style={{ marginBottom: 14 }}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
            onChange={(e) =>
              setAttachments((prev) => [
                ...prev,
                ...Array.from(e.target.files || []),
              ])
            }
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              fontSize: 13,
              padding: "7px 14px",
              borderRadius: 8,
              border: `1.5px dashed ${T.borderMid}`,
              background: T.surface,
              cursor: "pointer",
              color: T.textMid,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Paperclip size={14} /> Attach files
          </button>
          {attachments.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                marginTop: 8,
              }}
            >
              {attachments.map((f, i) => (
                <PendingChip
                  key={i}
                  att={f}
                  onRemove={() =>
                    setAttachments((prev) => prev.filter((_, j) => j !== i))
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Poll toggle */}
        <button
          onClick={() => setAddPoll((v) => !v)}
          style={{
            fontSize: 13,
            padding: "7px 14px",
            borderRadius: 8,
            marginBottom: 14,
            border: `1.5px solid ${addPoll ? T.accent : T.border}`,
            background: addPoll ? T.accentBg : T.surface,
            color: addPoll ? T.accent : T.textMid,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.1s",
          }}
        >
          <BarChart2 size={14} /> {addPoll ? "Remove Poll" : "Add Poll"}
        </button>

        {addPoll && (
          <div
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <label style={{ ...labelStyle, color: T.accent }}>
              Poll Question
            </label>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="e.g. What day works for the meeting?"
              style={{ ...inputStyle, marginBottom: 10 }}
              onFocus={(e) => (e.target.style.borderColor = T.accent)}
              onBlur={(e) => (e.target.style.borderColor = T.border)}
            />
            <label style={{ ...labelStyle, color: T.accent }}>Options</label>
            {pollOptions.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    setPollOptions((o) =>
                      o.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  placeholder={`Option ${i + 1}`}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = T.accent)}
                  onBlur={(e) => (e.target.style.borderColor = T.border)}
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() =>
                      setPollOptions((o) => o.filter((_, j) => j !== i))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: T.red,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setPollOptions((o) => [...o, ""])}
              style={{
                fontSize: 12,
                color: T.accent,
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 600,
                padding: 0,
              }}
            >
              + Add option
            </button>
          </div>
        )}

        {state === "sent" && (
          <div
            style={{
              padding: "10px 14px",
              background: T.greenBg,
              color: T.green,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: `1px solid ${T.greenLight}`,
            }}
          >
            <CheckCheck size={14} /> Broadcast sent successfully
          </div>
        )}
        {state === "error" && (
          <div
            style={{
              padding: "10px 14px",
              background: "#FEF2F2",
              color: T.red,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid #FECACA",
            }}
          >
            <AlertCircle size={14} /> Failed to send — please try again.
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: "100%",
            padding: "11px 0",
            borderRadius: 10,
            border: "none",
            background: canSend ? T.accent : T.border,
            color: canSend ? "#fff" : T.textMuted,
            fontWeight: 700,
            fontSize: 14,
            cursor: canSend ? "pointer" : "default",
            fontFamily: "inherit",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {state === "sending" ? (
            "Sending…"
          ) : (
            <>
              <Send size={15} /> Send Broadcast
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function StaffMessaging() {
  const { user, getAuthHeaders } = useAuth();
  const currentUserId = user?.id ? String(user.id) : null;
  const canBroadcast = BROADCAST_ROLES.includes(
    (user?.role || "").toLowerCase(),
  );
  const authHeaders = useMemo(() => getAuthHeaders(), [getAuthHeaders]);

  const [staff, setStaff] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [view, setView] = useState("chat");
  const [chatUnread, setChatUnread] = useState(0);
  // FIX: inboxUnread now comes ONLY from the API's inbox_unread counter,
  // which counts DMs only. Broadcasts are counted separately below.
  const [inboxUnread, setInboxUnread] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(false);

  const initDone = useRef(false);
  const activePartnerRef = useRef(null);
  const loadFnsRef = useRef({});

  const apiCall = useCallback(
    (path, opts = {}) => api.call(authHeaders, path, opts),
    [authHeaders],
  );

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const r = await apiCall("/api/notifications/staff/list/");
      setStaff(r?.staff || []);
    } catch (e) {
      console.error(e);
    } finally {
      setStaffLoading(false);
    }
  }, [apiCall]);

  const loadConversations = useCallback(async () => {
    try {
      const [cr, ur] = await Promise.all([
        apiCall("/api/notifications/conversations/"),
        apiCall("/api/notifications/unread-count/"),
      ]);
      setConversations(cr?.conversations || []);
      setChatUnread(ur?.chat_unread ?? 0);
      // FIX: store only the API-provided DM unread count here.
      // Do NOT add inbox-state counts — that would double-count.
      setInboxUnread(ur?.inbox_unread ?? 0);
    } catch (e) {
      console.error(e);
    }
  }, [apiCall]);

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    try {
      const [br, all] = await Promise.all([
        apiCall("/api/notifications/inbox/?scope=broadcast&page=1&page_size=50"),
        apiCall("/api/notifications/inbox/?page=1&page_size=100"),
      ]);
      setBroadcasts(br?.notifications || []);
      // FIX: inbox only holds non-broadcast, non-message notifications sent
      // directly to this user. Broadcasts are shown separately in InboxView.
      setInbox(
        (all?.notifications || []).filter((n) => n.recipient_type === "User"),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setInboxLoading(false);
    }
  }, [apiCall]);

  const loadConversation = useCallback(
    async (partner, delay = 0) => {
      if (!partner) return;
      if (delay) await new Promise((res) => setTimeout(res, delay));
      try {
        const r = await apiCall(`/api/notifications/conversation/${partner.id}/`);
        const serverMsgs = (r?.messages || []).map(normalizeNotification);
        setMessages((prev) => {
          if (!prev.length) return serverMsgs;
          const serverMap = Object.fromEntries(
            serverMsgs.map((m) => [m.id, m]),
          );
          const merged = prev.map((m) => serverMap[m.id] ?? m);
          const existingIds = new Set(prev.map((m) => m.id));
          return [
            ...merged,
            ...serverMsgs.filter((m) => !existingIds.has(m.id)),
          ];
        });
      } catch (e) {
        console.error(e);
      }
    },
    [apiCall],
  );

  useEffect(() => {
    loadFnsRef.current = { loadConversation, loadConversations, loadInbox };
  }, [loadConversation, loadConversations, loadInbox]);

  useEffect(() => {
    if (!currentUserId || initDone.current) return;
    initDone.current = true;
    loadStaff();
    loadConversations();
    loadInbox();
  }, [currentUserId]); // eslint-disable-line

  // WebSocket
  useEffect(() => {
    if (!currentUserId) return;
    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      "";
    const ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/?token=${token}`);
    ws.onopen = () => console.log("[WS] Connected");
    ws.onclose = (e) => console.log("[WS] Closed", e.code);
    ws.onerror = (e) => console.error("[WS] Error", e);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const isBroadcast =
          data.recipient_type === "Role" || data.recipient_type === "All";
        const isDM =
          data.notification_type === "message" &&
          data.recipient_type === "User";

        if (isBroadcast) {
          setBroadcasts((prev) =>
            prev.some((b) => b.id === data.id) ? prev : [data, ...prev],
          );
          setChatUnread((u) => u + 1);
          loadFnsRef.current.loadInbox?.();
        }

        if (isDM) {
          const partner = activePartnerRef.current;
          const senderId =
            data.sent_by?.id != null ? String(data.sent_by.id) : null;
          const recipientId =
            data.recipient_id != null ? String(data.recipient_id) : null;

          if (partner) {
            const pid = String(partner.id);
            const isIncoming =
              senderId === pid && recipientId === currentUserId;
            const isMyEcho = senderId === currentUserId && recipientId === pid;

            if (isIncoming) {
              setMessages((prev) =>
                prev.some((m) => m.id === data.id)
                  ? prev
                  : [...prev, normalizeNotification(data)],
              );
              loadFnsRef.current.loadConversation?.(partner, 200);
            } else if (isMyEcho) {
              setMessages((prev) =>
                prev.some((m) => m.id === data.id)
                  ? prev
                  : [...prev, normalizeNotification(data)],
              );
            }
          }

          if (recipientId === currentUserId && senderId !== currentUserId)
            loadFnsRef.current.loadInbox?.();
          loadFnsRef.current.loadConversations?.();
        }
      } catch {
        console.warn("[WS] Bad message", event.data);
      }
    };
    return () => ws.close();
  }, [currentUserId]);

  // ── Send ──────────────────────────────────────────────────────────────

  const handleSend = async (
    recipientId,
    title,
    message,
    priority,
    recipientType = "User",
    recipientRole = null,
    files = [],
    pollMeta = null,
  ) => {
    try {
      let notification;

      if (files?.length > 0) {
        const fd = new FormData();
        fd.append("recipient_type", recipientType);
        if (recipientType === "User") fd.append("recipient_id", recipientId);
        if (recipientType === "Role")
          fd.append("recipient_role", recipientRole);
        fd.append("notification_type", "message");
        fd.append("title", title);
        fd.append("message", message);
        fd.append("priority", priority);
        files.forEach((f) => {
          const mime = resolveFileMime(f);
          fd.append(
            "attachments",
            mime !== f.type ? new Blob([f], { type: mime }) : f,
            f.name,
          );
        });
        const r = await apiCall("/api/notifications/send/", {
          method: "POST",
          body: fd,
        });
        notification = r?.notification;
      } else {
        const r = await apiCall("/api/notifications/send/", {
          method: "POST",
          body: JSON.stringify({
            recipient_type: recipientType,
            ...(recipientType === "User"
              ? { recipient_id: recipientId }
              : recipientType === "Role"
                ? { recipient_role: recipientRole }
                : {}),
            notification_type: "message",
            title,
            message,
            priority,
          }),
        });
        notification = r?.notification;
      }

      if (pollMeta && notification?.id) {
        await apiCall("/api/notifications/polls/create/", {
          method: "POST",
          body: JSON.stringify({
            notification_id: notification.id,
            question: pollMeta.question,
            options: pollMeta.options,
          }),
        });
      }

      if (recipientType === "User") {
        const partner = activePartnerRef.current;
        if (
          partner &&
          String(partner.id) === String(recipientId) &&
          notification
        ) {
          const norm = normalizeNotification(notification);
          setMessages((prev) =>
            prev.some((m) => m.id === norm.id) ? prev : [...prev, norm],
          );
          loadConversation(partner, 200);
        }
      } else {
        await loadInbox();
      }
      await loadConversations();
    } catch (err) {
      alert("Failed to send: " + err.message);
    }
  };

  const handleEdit = async (notificationId, newMessage) => {
    try {
      const r = await apiCall(`/api/notifications/${notificationId}/edit/`, {
        method: "PATCH",
        body: JSON.stringify({ message: newMessage }),
      });
      if (r?.notification)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === notificationId ? normalizeNotification(r.notification) : m,
          ),
        );
    } catch (err) {
      alert("Failed to edit: " + err.message);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await apiCall(`/api/notifications/${notificationId}/delete/`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((m) => m.id !== notificationId));
      await loadConversations();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      const r = await apiCall(`/api/notifications/polls/${pollId}/vote/`, {
        method: "POST",
        body: JSON.stringify({ option_index: optionIndex }),
      });
      if (r?.poll) {
        setActiveBroadcast((prev) => (prev ? { ...prev, poll: r.poll } : prev));
        setMessages((prev) =>
          prev.map((m) => (m.poll?.id === pollId ? { ...m, poll: r.poll } : m)),
        );
        setBroadcasts((prev) =>
          prev.map((b) => (b.poll?.id === pollId ? { ...b, poll: r.poll } : b)),
        );
      }
    } catch (err) {
      alert("Failed to vote: " + err.message);
    }
  };

  const handleMarkAll = async () => {
    await apiCall("/api/notifications/mark-all-read/", { method: "POST" });
    await loadInbox();
    await loadConversations();
  };

  const handleSelectBroadcast = async (b) => {
    setActiveBroadcast(b);
    setActivePartner(null);
    setView("chat");
    const wasUnread = b.status === "Unread";
    setBroadcasts((prev) =>
      prev.map((x) => (x.id === b.id ? { ...x, status: "Read" } : x)),
    );
    if (wasUnread) {
      setChatUnread((u) => Math.max(0, u - 1));
      try {
        await apiCall(`/api/notifications/${b.id}/read/`, { method: "PATCH" });
      } catch (err) {
        alert("Failed to mark as read: " + err.message);
      }
    }
  };

  const handleSelectPartner = (partner) => {
    setActivePartner(partner);
    setActiveBroadcast(null);
    activePartnerRef.current = partner;
    setMessages([]);
    setView("chat");
    setChatLoading(true);
    loadConversation(partner).finally(() => setChatLoading(false));
    loadConversations();
  };

  activePartnerRef.current = activePartner;

  // FIX: inbox badge = API-provided DM unread count ONLY.
  // Broadcasts are tracked via chatUnread (they appear in the Chat tab sidebar).
  // We do NOT add inbox state array counts here — that was the double-counting bug.
  // If your API's inbox_unread also includes broadcasts, subtract broadcast unread:
  const unreadBroadcasts = broadcasts.filter(
    (b) => b.status === "Unread",
  ).length;
  // inboxUnread from the API = DMs + possibly broadcasts; show just DM portion:
  const dmInboxUnread = Math.max(0, inboxUnread - unreadBroadcasts);
  // Inbox tab badge = DM unread + broadcast unread (shown together in inbox view)
  const inboxBadgeCount = dmInboxUnread + unreadBroadcasts;

  if (!currentUserId) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: T.textMuted }}>
        Please log in to access messaging.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D4D4D4; border-radius: 4px; }
        textarea { scrollbar-width: thin; }
      `}</style>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            borderRadius: 12,
            boxShadow: "0 1px 12px rgba(0,0,0,0.08)",
            border: `1px solid ${T.border}`,
          }}
        >
          <Sidebar
            staff={staff}
            conversations={conversations}
            broadcasts={broadcasts}
            activePartnerId={activePartner?.id}
            activeBroadcastId={activeBroadcast?.id}
            onSelectPartner={handleSelectPartner}
            onSelectBroadcast={handleSelectBroadcast}
            chatUnread={chatUnread}
            inboxUnread={inboxBadgeCount}
            view={view}
            onViewChange={(v) => {
              setView(v);
              setActivePartner(null);
              setActiveBroadcast(null);
            }}
            loading={staffLoading}
            currentUserId={currentUserId}
            canBroadcast={canBroadcast}
          />

          {view === "chat" && !activePartner && !activeBroadcast && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                background: T.bg,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare size={28} color={T.textMuted} />
              </div>
              <p
                style={{
                  color: T.textMid,
                  fontSize: 14,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Select a conversation or broadcast
              </p>
            </div>
          )}

          {view === "chat" && activePartner && !activeBroadcast && (
            <ChatView
              partner={activePartner}
              messages={messages}
              onSend={handleSend}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVote={handleVote}
              loading={chatLoading}
              currentUserId={currentUserId}
            />
          )}

          {view === "chat" && activeBroadcast && !activePartner && (
            <BroadcastDetailView
              broadcast={activeBroadcast}
              onVote={handleVote}
            />
          )}

          {view === "inbox" && (
            // FIX: pass broadcasts separately so InboxView can render them
            // in their own section without duplicating them in the DM/notification list
            <InboxView
              notifications={inbox}
              broadcasts={broadcasts}
              onRefresh={loadInbox}
              onMarkAll={handleMarkAll}
              loading={inboxLoading}
            />
          )}

          {view === "broadcast" && canBroadcast && (
            <BroadcastSendView onSend={handleSend} />
          )}
        </div>
      </div>
    </>
  );
}
