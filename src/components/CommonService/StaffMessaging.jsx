/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search, Send, Paperclip, MoreVertical, Edit2, Trash2,
  CheckCheck, Check, Megaphone, BarChart2, Inbox,
  ChevronDown, X, Play, FileText, Image as ImageIcon,
  RefreshCw, CheckSquare, Film,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE_URL  = API_BASE_URL
  .replace(/^http/, "ws")
  .replace(/^https/, "wss")
  .replace(/\/api$/, "");

const BROADCAST_ROLES = ["registrar"];

const ROLES = {
  registrar:          { color: "#2563EB", label: "Registrar" },
  bursar:             { color: "#D97706", label: "Bursar" },
  hr:                 { color: "#16A34A", label: "HR" },
  hr_manager:         { color: "#16A34A", label: "HR" },
  accountant:         { color: "#0891B2", label: "Accountant" },
  teacher:            { color: "#7C3AED", label: "Teacher" },
  school_deputyadmin: { color: "#DB2777", label: "Dep. Admin" },
  deputyadmin:        { color: "#DB2777", label: "Dep. Admin" },
  deputy_principal:   { color: "#DB2777", label: "Dep. Principal" },
  principal:          { color: "#DC2626", label: "Principal" },
  admin:              { color: "#DC2626", label: "Admin" },
};

// ── File type detection ───────────────────────────────────────────────────

const VIDEO_EXTS = [".mp4", ".m4v", ".webm", ".mov", ".qt", ".avi", ".mkv",
                    ".mk3d", ".mpeg", ".mpg", ".ogv", ".3gp", ".3g2"];
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico"];

function getMimeType(att) {
  return ((att.content_type || att.type || "")).toLowerCase();
}

function getFileName(att) {
  return ((att.original_name || att.name || "")).toLowerCase();
}

function isVideo(att) {
  const mime = getMimeType(att);
  const name = getFileName(att);
  if (mime.startsWith("video/")) return true;
  return VIDEO_EXTS.some(ext => name.endsWith(ext));
}

function isImage(att) {
  const mime = getMimeType(att);
  const name = getFileName(att);
  if (mime.startsWith("image/")) return true;
  return IMAGE_EXTS.some(ext => name.endsWith(ext));
}

function resolveFileMime(file) {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const name = file.name.toLowerCase();
  for (const ext of VIDEO_EXTS) {
    if (name.endsWith(ext)) {
      const map = {
        ".mp4": "video/mp4", ".m4v": "video/mp4",
        ".webm": "video/webm",
        ".mov": "video/quicktime", ".qt": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".mkv": "video/x-matroska", ".mk3d": "video/x-matroska",
        ".mpeg": "video/mpeg", ".mpg": "video/mpeg",
        ".ogv": "video/ogg",
        ".3gp": "video/3gpp", ".3g2": "video/3gpp2",
      };
      return map[ext] || "video/mp4";
    }
  }
  for (const ext of IMAGE_EXTS) {
    if (name.endsWith(ext)) {
      const map = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
        ".png": "image/png", ".gif": "image/gif",
        ".webp": "image/webp", ".svg": "image/svg+xml",
        ".bmp": "image/bmp", ".ico": "image/x-icon",
      };
      return map[ext] || "image/jpeg";
    }
  }
  return file.type || "application/octet-stream";
}

// ── Normalize a notification from the API so attachments is always an array ──
// FIX: The core bug — API responses sometimes omit `attachments` entirely (undefined)
// when the prefetch_related hasn't run or HAS_ATTACH is False on the server.
// Normalizing here ensures msg.attachments is never undefined downstream.
function normalizeNotification(n) {
  if (!n) return n;
  return {
    ...n,
    attachments: Array.isArray(n.attachments) ? n.attachments : [],
    poll: n.poll ?? null,
  };
}

// ── Small helpers ─────────────────────────────────────────────────────────

function getRoleInfo(role) {
  const key = (role || "").toLowerCase().replace(/[\s-]/g, "_");
  return ROLES[key] || { color: "#6B7280", label: role || "Staff" };
}

function getInitials(name = "?") {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatTime(iso) {
  if (!iso) return "";
  const d   = new Date(iso);
  const now = new Date();
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

// ── Attachment label helper (used in sidebar preview + bubble fallback) ──
// FIX: centralised so sidebar and bubble always agree on the label text.
function attachmentLabel(att) {
  if (isVideo(att)) return "📹 Video";
  if (isImage(att)) return "🖼 Photo";
  return `📎 ${att.original_name || att.name || "File"}`;
}

// ── Small UI atoms ────────────────────────────────────────────────────────

function Avatar({ name, role, size = 38 }) {
  const { color } = getRoleInfo(role);
  const [r, g, b] = color.replace("#","").match(/.{2}/g).map(h => parseInt(h, 16));
  return (
    <div style={{
      width: size, height: size, minWidth: size, borderRadius: "50%",
      background: `rgba(${r},${g},${b},0.13)`, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36,
      border: `1.5px solid rgba(${r},${g},${b},0.28)`,
      fontFamily: "monospace", letterSpacing: "-0.5px", flexShrink: 0,
    }}>
      {getInitials(name)}
    </div>
  );
}

function RolePill({ role }) {
  const { color, label } = getRoleInfo(role);
  const [r, g, b] = color.replace("#","").match(/.{2}/g).map(h => parseInt(h, 16));
  return (
    <span style={{
      background: `rgba(${r},${g},${b},0.10)`, color,
      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      letterSpacing: 0.4, textTransform: "uppercase", fontFamily: "monospace",
    }}>
      {label}
    </span>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: "#25D366", color: "#fff", fontSize: 10, fontWeight: 700,
      borderRadius: 30, padding: "1px 6px", minWidth: 18,
      textAlign: "center", lineHeight: "16px", display: "inline-block",
    }}>{count > 99 ? "99+" : count}</span>
  );
}

// ── Attachment renderer ───────────────────────────────────────────────────

function AttachmentRenderer({ att, inBubble = false, isMe = false }) {
  const url  = att.url;
  const name = att.original_name || att.name || "file";
  const attIsVideo = isVideo(att);
  const attIsImage = !attIsVideo && isImage(att);

  if (attIsImage) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
         style={{ display: "block", marginTop: inBubble ? 6 : 0 }}>
        <img
          src={url} alt={name}
          style={{ maxWidth: 220, maxHeight: 200, borderRadius: 8,
                   display: "block", objectFit: "cover", cursor: "pointer" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      </a>
    );
  }

  if (attIsVideo) {
    const resolvedMime = getMimeType(att) || "video/mp4";
    return (
      <div style={{ marginTop: inBubble ? 6 : 0 }}>
        <video
          controls
          preload="metadata"
          style={{ maxWidth: 260, maxHeight: 180, borderRadius: 8,
                   display: "block", background: "#000" }}
        >
          <source src={url} type={resolvedMime} />
          <a href={url} target="_blank" rel="noopener noreferrer"
             style={{ color: isMe ? "#daf8e3" : "#075e54" }}>
            Download video
          </a>
        </video>
        <div style={{ fontSize: 11, marginTop: 3, opacity: 0.7,
                      display: "flex", alignItems: "center", gap: 4 }}>
          <Film size={11} /> {name}
          {att.size ? ` · ${formatBytes(att.size)}` : ""}
        </div>
      </div>
    );
  }

  // Generic file chip
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer" download={name}
      style={{ textDecoration: "none", display: "inline-flex",
               marginTop: inBubble ? 6 : 0 }}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: isMe ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.06)",
        border: `1px solid ${isMe ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 8, padding: "6px 10px", fontSize: 12,
        color: isMe ? "#fff" : "#1C1917", maxWidth: 220, cursor: "pointer",
      }}>
        <FileText size={14} style={{ flexShrink: 0 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis",
                       whiteSpace: "nowrap", flex: 1 }}>{name}</span>
        {att.size && (
          <span style={{ opacity: 0.65, fontSize: 10, flexShrink: 0 }}>
            {formatBytes(att.size)}
          </span>
        )}
      </div>
    </a>
  );
}

// Small chip for pending uploads in the composer
function PendingChip({ att, onRemove }) {
  const isVid = isVideo(att);
  const isImg = !isVid && isImage(att);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "#f0f2f5", border: "1px solid #d1d7db",
      borderRadius: 8, padding: "4px 8px", fontSize: 12, color: "#3b4a54",
    }}>
      {isVid ? <Film size={12} /> : isImg ? <ImageIcon size={12} /> : <FileText size={12} />}
      <span style={{ maxWidth: 110, overflow: "hidden",
                     textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {att.name}
      </span>
      {att.size && (
        <span style={{ color: "#8696a0", fontSize: 10 }}>{formatBytes(att.size)}</span>
      )}
      {onRemove && (
        <button onClick={onRemove}
          style={{ background: "none", border: "none", cursor: "pointer",
                   color: "#8696a0", padding: 0, display: "flex" }}>
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
    <div style={{ marginTop: 10, background: "rgba(0,0,0,0.06)",
                  borderRadius: 12, padding: "10px 12px", minWidth: 220 }}>
      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8,
                    display: "flex", alignItems: "center", gap: 6 }}>
        <BarChart2 size={14} /> {poll.question}
      </div>
      {poll.options.map((opt, idx) => {
        const votes = poll.tally?.[idx] ?? 0;
        const pct   = total > 0 ? Math.round((votes / total) * 100) : 0;
        const voted = poll.user_vote === idx;
        return (
          <button key={idx} onClick={() => onVote?.(poll.id, idx)} style={{
            display: "block", width: "100%", textAlign: "left",
            background: voted ? "rgba(37,211,102,0.2)" : "rgba(255,255,255,0.5)",
            border: voted ? "1.5px solid #25D366" : "1px solid rgba(0,0,0,0.1)",
            borderRadius: 8, padding: "6px 10px", marginBottom: 6,
            cursor: onVote ? "pointer" : "default",
            color: "inherit", fontFamily: "inherit", fontSize: 12,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0,
                          width: `${pct}%`, background: "rgba(37,211,102,0.12)",
                          transition: "width 0.4s" }} />
            <span style={{ position: "relative", zIndex: 1,
                           fontWeight: voted ? 700 : 400 }}>{opt}</span>
            <span style={{ position: "relative", zIndex: 1, float: "right",
                           opacity: 0.7, fontSize: 11 }}>
              {pct}%{votes > 0 ? ` (${votes})` : ""}
            </span>
          </button>
        );
      })}
      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>
        {total} vote{total !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

// ── API helper ────────────────────────────────────────────────────────────

const api = {
  async call(authHeaders, path, opts = {}) {
    const isFormData = opts.body instanceof FormData;
    const headers    = { ...(authHeaders || {}) };
    if (!isFormData) headers["Content-Type"] = "application/json";
    else delete headers["Content-Type"];

    const csrf = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
    if (csrf) headers["X-CSRFToken"] = csrf;

    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers, credentials: "include", ...opts,
    });
    if (res.status === 401) { window.location.href = "/auth/login/"; return; }

    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const ct = res.headers.get("content-type") || "";
        errMsg = ct.includes("application/json")
          ? JSON.stringify(await res.json())
          : await res.text() || errMsg;
      } catch (_e) { /* keep HTTP status */ }
      throw new Error(errMsg);
    }
    return res.json();
  },
};

// ── WhatsApp-style context menu ───────────────────────────────────────────

function MsgContextMenu({ visible, isMe, onEdit, onDelete, style }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "absolute", zIndex: 100,
      background: "#fff", borderRadius: 8,
      boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
      overflow: "hidden", minWidth: 130,
      ...style,
    }}>
      {isMe && (
        <button onClick={onEdit} style={{
          display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "10px 16px", border: "none",
          background: "none", cursor: "pointer", fontSize: 14,
          color: "#111b21", fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#f0f2f5"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <Edit2 size={15} /> Edit
        </button>
      )}
      <button onClick={onDelete} style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "10px 16px", border: "none",
        background: "none", cursor: "pointer", fontSize: 14,
        color: "#dc2626", fontFamily: "inherit",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
      >
        <Trash2 size={15} /> Delete
      </button>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────

function Sidebar({
  staff, conversations, broadcasts,
  activePartnerId, activeBroadcastId,
  onSelectPartner, onSelectBroadcast,
  chatUnread, inboxUnread,
  view, onViewChange, loading, currentUserId, canBroadcast,
}) {
  const [search, setSearch] = useState("");
  const convMap = Object.fromEntries(conversations.map(c => [c.partner.id, c]));

  const filtered = staff.filter(s =>
    (s.full_name + s.role + s.username + s.email)
      .toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  filtered.forEach(s => {
    const label = getRoleInfo(s.role).label;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  const tabs = [
    { id: "chat",      label: "Chat",    badge: chatUnread  },
    { id: "inbox",     label: "Inbox",   badge: inboxUnread },
    ...(canBroadcast ? [{ id: "broadcast", label: "Broadcast", badge: 0 }] : []),
  ];

  return (
    <div style={{
      width: 280, minWidth: 280, display: "flex", flexDirection: "column",
      height: "100%", background: "#fff", borderRight: "1px solid #e9edef",
    }}>
      <div style={{ padding: "14px 16px 0", background: "#f0f2f5" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#111b21", marginBottom: 12 }}>
          Messages
        </div>
        <div style={{ display: "flex", borderBottom: "2px solid #e9edef" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onViewChange(t.id)} style={{
              flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
              border: "none",
              borderBottom: view === t.id ? "2px solid #00a884" : "2px solid transparent",
              cursor: "pointer", background: "transparent",
              color: view === t.id ? "#00a884" : "#667781",
              fontFamily: "inherit", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 4, marginBottom: -2,
              transition: "all 0.15s",
            }}>
              {t.label}
              {t.badge > 0 && (
                <span style={{ background: "#25D366", color: "#fff", fontSize: 9,
                               fontWeight: 700, borderRadius: 20, padding: "1px 5px",
                               lineHeight: "14px" }}>
                  {t.badge > 99 ? "99+" : t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {view === "chat" && (
        <div style={{ padding: "8px 12px", background: "#f0f2f5",
                      borderBottom: "1px solid #e9edef" }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%",
                                       transform: "translateY(-50%)", color: "#8696a0" }} />
            <input
              type="text" placeholder="Search or start new chat" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", fontSize: 14, padding: "8px 10px 8px 32px",
                borderRadius: 8, border: "none", background: "#fff",
                color: "#111b21", outline: "none", boxSizing: "border-box",
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
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8696a0",
                              padding: "12px 16px 4px", letterSpacing: 0.8,
                              textTransform: "uppercase" }}>
                  Broadcasts
                </div>
                {broadcasts.map(b => {
                  const isActive = activeBroadcastId === b.id;
                  const isUnread = b.status === "Unread";
                  return (
                    <div key={b.id} onClick={() => onSelectBroadcast(b)} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 16px", cursor: "pointer",
                      background: isActive ? "#f0f2f5" : "transparent",
                      borderBottom: "1px solid #f0f2f5", transition: "background 0.1s",
                    }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f5f6f6"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{
                        width: 46, height: 46, minWidth: 46, borderRadius: "50%",
                        background: "#e8f8f0", color: "#00a884",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1.5px solid #c8e6d8",
                      }}>
                        {b.poll ? <BarChart2 size={20} /> : <Megaphone size={20} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between",
                                      alignItems: "center" }}>
                          <span style={{ fontSize: 15, fontWeight: isUnread ? 700 : 500,
                                         color: "#111b21", overflow: "hidden",
                                         textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {b.title}
                          </span>
                          <span style={{ fontSize: 11,
                                         color: isUnread ? "#25D366" : "#8696a0",
                                         whiteSpace: "nowrap", marginLeft: 4 }}>
                            {formatTime(b.sent_at)}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between",
                                      alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "#667781", overflow: "hidden",
                                         textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                            {b.sent_by?.full_name} ·{" "}
                            {b.recipient_type === "All" ? "All Staff" : b.recipient_role}
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
              <div style={{ padding: 24, textAlign: "center",
                            color: "#8696a0", fontSize: 13 }}>Loading…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center",
                            color: "#8696a0", fontSize: 13 }}>No staff found</div>
            ) : (
              Object.entries(grouped).map(([roleLabel, members]) => (
                <div key={roleLabel}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8696a0",
                                padding: "10px 16px 4px", letterSpacing: 0.8,
                                textTransform: "uppercase" }}>
                    {roleLabel}
                  </div>
                  {members.map(s => {
                    const conv        = convMap[s.id];
                    const isActive    = activePartnerId === s.id && !activeBroadcastId;
                    const unreadCount = conv?.unread_count || 0;
                    // FIX: normalise last_message so .attachments is always an array
                    const lastMsg     = conv?.last_message
                      ? normalizeNotification(conv.last_message)
                      : null;
                    const lastAtt     = lastMsg?.attachments?.[0];
                    const lastPreview = lastAtt
                      ? attachmentLabel(lastAtt)
                      : lastMsg?.message || "";
                    return (
                      <div key={s.id} onClick={() => onSelectPartner(s)} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 16px", cursor: "pointer",
                        background: isActive ? "#f0f2f5" : "transparent",
                        borderBottom: "1px solid #f0f2f5", transition: "background 0.1s",
                      }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f5f6f6"; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <Avatar name={s.full_name} role={s.role} size={46} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between",
                                        alignItems: "center" }}>
                            <span style={{ fontSize: 15,
                                           fontWeight: unreadCount ? 700 : 500,
                                           color: "#111b21", overflow: "hidden",
                                           textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {s.full_name}
                            </span>
                            {lastMsg && (
                              <span style={{ fontSize: 11,
                                             color: unreadCount ? "#25D366" : "#8696a0",
                                             whiteSpace: "nowrap", marginLeft: 4 }}>
                                {formatTime(lastMsg.sent_at)}
                              </span>
                            )}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between",
                                        alignItems: "center" }}>
                            {lastMsg ? (
                              <span style={{ fontSize: 13, color: "#667781",
                                             overflow: "hidden", textOverflow: "ellipsis",
                                             whiteSpace: "nowrap", flex: 1 }}>
                                {lastMsg.sent_by?.id === currentUserId ? "You: " : ""}
                                {lastPreview}
                              </span>
                            ) : (
                              <span style={{ fontSize: 13, color: "#c8c8c8" }}>—</span>
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
  // FIX: normalise so attachments is always an array
  const b = normalizeNotification(broadcast);
  const priorityColor = b.priority === "Urgent"
    ? "#dc2626" : b.priority === "High" ? "#d97706" : null;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
                  height: "100%", background: "#efeae2" }}>
      <div style={{ padding: "12px 16px", background: "#f0f2f5",
                    borderBottom: "1px solid #e9edef", display: "flex",
                    alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: "#e8f8f0",
          color: "#00a884", display: "flex", alignItems: "center",
          justifyContent: "center", border: "1.5px solid #c8e6d8",
        }}>
          {b.poll ? <BarChart2 size={18} /> : <Megaphone size={18} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111b21" }}>
            {b.title}
          </div>
          <div style={{ fontSize: 13, color: "#667781" }}>
            {b.recipient_type === "All" ? "All Staff" : b.recipient_role}
            {" · from "}{b.sent_by?.full_name}
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#8696a0" }}>
          {formatTime(b.sent_at)}
        </span>
      </div>

      <div style={{ flex: 1, padding: "24px 16px", overflowY: "auto",
                    display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Avatar name={b.sent_by?.full_name} role={b.sent_by?.role} size={34} />
          <div style={{ maxWidth: "78%" }}>
            <div style={{ fontSize: 12, color: "#667781", marginBottom: 4,
                          display: "flex", alignItems: "center", gap: 6 }}>
              {b.sent_by?.full_name}{" "}
              <RolePill role={b.sent_by?.role} />
            </div>
            <div style={{ background: "#fff", borderRadius: "0 12px 12px 12px",
                          padding: "10px 14px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          fontSize: 14, lineHeight: 1.6, color: "#111b21" }}>
              {priorityColor && (
                <div style={{ fontSize: 11, fontWeight: 700, color: priorityColor,
                              marginBottom: 6, textTransform: "uppercase",
                              letterSpacing: 0.5 }}>
                  {b.priority === "Urgent" ? "⚡ Urgent" : "↑ High Priority"}
                </div>
              )}
              {b.message}
              {/* FIX: b.attachments is now guaranteed to be an array */}
              {b.attachments.map(a => (
                <AttachmentRenderer key={a.id} att={a} inBubble />
              ))}
              {b.poll && <PollWidget poll={b.poll} onVote={onVote} />}
            </div>
            <div style={{ fontSize: 11, color: "#8696a0", marginTop: 4,
                          display: "flex", alignItems: "center", gap: 4 }}>
              {formatTime(b.sent_at)}
              {b.status === "Read" && <CheckCheck size={14} color="#53bdeb" />}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #e9edef", padding: "10px 16px",
                    background: "#f0f2f5", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: "#8696a0", fontStyle: "italic" }}>
          Broadcast message — replies not supported
        </span>
      </div>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────
// FIX: Extracted into its own component so the rendering logic is clear and
// attachment display is never accidentally skipped.

function MessageBubble({ msg, isMe, sameGroup, onStartEdit, onDelete, onVote, color, editingId, editText, setEditText, onSubmitEdit, onCancelEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // FIX: normalise here so we always have msg.attachments as an array
  const message = normalizeNotification(msg);
  const hasText = Boolean(message.message && message.message.trim());
  // FIX: attachment array is guaranteed by normalizeNotification
  const hasAttachments = message.attachments.length > 0;
  const isEditing = editingId === message.id;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: isMe ? "row-reverse" : "row",
      alignItems: "flex-end", gap: 6,
      marginTop: sameGroup ? 1 : 8,
      position: "relative",
    }}>
      <div style={{ position: "relative", maxWidth: "68%" }}>
        {isEditing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmitEdit(message.id); }
                if (e.key === "Escape") onCancelEdit();
              }}
              rows={2} autoFocus
              style={{ fontSize: 14, padding: "8px 12px", borderRadius: 10,
                       border: `2px solid ${color}`, background: "#fff",
                       outline: "none", resize: "none", fontFamily: "inherit",
                       color: "#111b21", lineHeight: 1.5, width: 240 }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onSubmitEdit(message.id)} style={{
                padding: "5px 14px", borderRadius: 8, border: "none",
                background: "#00a884", color: "#fff",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Save</button>
              <button onClick={onCancelEdit} style={{
                padding: "5px 10px", borderRadius: 8,
                border: "1px solid #e9edef", background: "#fff",
                color: "#667781", fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Chevron trigger */}
            <div
              onClick={() => setShowMenu(v => !v)}
              style={{
                position: "absolute", top: 4,
                right: isMe ? "auto" : -4,
                left: isMe ? -4 : "auto",
                background: isMe ? "#dcf8c6" : "#fff",
                borderRadius: "50%", width: 20, height: 20,
                display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                zIndex: 2, opacity: showMenu ? 1 : 0,
                transition: "opacity 0.15s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
              className="msg-chevron"
            >
              <ChevronDown size={13} color="#667781" />
            </div>

            {/* Bubble */}
            <div
              style={{
                background: isMe ? "#dcf8c6" : "#fff",
                color: "#111b21",
                borderRadius: isMe ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                padding: "7px 12px 4px",
                fontSize: 14, lineHeight: 1.5,
                boxShadow: "0 1px 2px rgba(0,0,0,0.13)",
                wordBreak: "break-word",
              }}
              onMouseEnter={e => {
                const ch = e.currentTarget.parentElement.querySelector(".msg-chevron");
                if (ch) ch.style.opacity = 1;
              }}
              onMouseLeave={e => {
                if (!showMenu) {
                  const ch = e.currentTarget.parentElement.querySelector(".msg-chevron");
                  if (ch) ch.style.opacity = 0;
                }
              }}
            >
              {!isMe && !sameGroup && (
                <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>
                  {message.sent_by?.full_name}
                </div>
              )}

              {message.priority === "Urgent" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#dc2626",
                               display: "block", marginBottom: 3,
                               textTransform: "uppercase", letterSpacing: 0.5 }}>
                  ⚡ Urgent
                </span>
              )}
              {message.priority === "High" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#d97706",
                               display: "block", marginBottom: 3,
                               textTransform: "uppercase", letterSpacing: 0.5 }}>
                  ↑ High Priority
                </span>
              )}

              {/*
                FIX: Render message content clearly.
                - If there's text, show it (+ "edited" marker).
                - If there's NO text but there ARE attachments, show a small
                  muted label so the bubble is never visually empty.
                - Attachments always render below, regardless.
                Previously these were in an IIFE that returned early, which
                made it hard to reason about — split into explicit branches.
              */}
              {hasText && (
                <span>
                  {message.message}
                  {message.edited && (
                    <span style={{ fontSize: 10, opacity: 0.55,
                                   marginLeft: 5, fontStyle: "italic" }}>
                      edited
                    </span>
                  )}
                </span>
              )}

              {/* FIX: attachment-only messages — show a label above the media */}
              {!hasText && hasAttachments && (
                <span style={{ fontSize: 13, opacity: 0.7, fontStyle: "italic",
                               display: "block", marginBottom: 2 }}>
                  {attachmentLabel(message.attachments[0])}
                </span>
              )}

              {/* FIX: always render attachments — guaranteed array, never skipped */}
              {message.attachments.map(a => (
                <AttachmentRenderer key={a.id} att={a} inBubble isMe={isMe} />
              ))}

              {message.poll && <PollWidget poll={message.poll} onVote={onVote} />}

              <div style={{ display: "flex", justifyContent: "flex-end",
                            alignItems: "center", gap: 3, marginTop: 3 }}>
                <span style={{ fontSize: 11, color: "#667781" }}>
                  {formatTime(message.sent_at)}
                </span>
                {isMe && (message.status === "Read"
                  ? <CheckCheck size={14} color="#53bdeb" />
                  : <Check size={14} color="#8696a0" />
                )}
              </div>
            </div>

            {showMenu && (
              <div ref={menuRef}>
                <MsgContextMenu
                  visible isMe={isMe}
                  onEdit={() => { onStartEdit(message); setShowMenu(false); }}
                  onDelete={() => {
                    setShowMenu(false);
                    if (window.confirm("Delete this message?")) onDelete(message.id);
                  }}
                  style={{
                    top: 28,
                    right: isMe ? 0 : "auto",
                    left: isMe ? "auto" : 0,
                  }}
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

function ChatView({ partner, messages, onSend, onEdit, onDelete, onVote, loading, currentUserId }) {
  const [text, setText]                 = useState("");
  const [priority, setPriority]         = useState("Normal");
  const [showOpts, setShowOpts]         = useState(false);
  const [sending, setSending]           = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [editingId, setEditingId]       = useState(null);
  const [editText, setEditText]         = useState("");
  const bottomRef    = useRef(null);
  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    const hasText  = text.trim().length > 0;
    const hasFiles = pendingFiles.length > 0;
    if ((!hasText && !hasFiles) || !partner || sending) return;

    setSending(true);
    try {
      const msgText = text.trim();

      // Derive a meaningful title for attachment-only messages
      let title = msgText.slice(0, 50);
      if (!title && hasFiles) {
        const firstFile = pendingFiles[0];
        if (isVideo(firstFile))      title = "Video";
        else if (isImage(firstFile)) title = "Photo";
        else                          title = "File";
      }
      title = title || "Message";

      await onSend(partner.id, title, msgText, priority, "User", null, pendingFiles);
      setText("");
      setPriority("Normal");
      setPendingFiles([]);
    } finally {
      setSending(false);
    }
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setPendingFiles(prev => [...prev, ...files]);
    e.target.value = "";
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 12, background: "#f0f2f5" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%",
                      background: "#e9edef", display: "flex",
                      alignItems: "center", justifyContent: "center" }}>
          <Send size={32} color="#8696a0" />
        </div>
        <p style={{ color: "#41525d", fontSize: 14, margin: 0, fontWeight: 500 }}>
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  const { color } = getRoleInfo(partner.role);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
                  height: "100%", background: "#efeae2" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", background: "#f0f2f5",
                    borderBottom: "1px solid #e9edef", display: "flex",
                    alignItems: "center", gap: 12 }}>
        <Avatar name={partner.full_name} role={partner.role} size={40} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#111b21" }}>
            {partner.full_name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <RolePill role={partner.role} />
            <span style={{ fontSize: 12, color: "#667781" }}>{partner.email}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 8%",
                    display: "flex", flexDirection: "column", gap: 2 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#8696a0",
                        padding: 40, fontSize: 13 }}>Loading…</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8696a0",
                        marginTop: 60, fontSize: 13 }}>
            No messages yet — say hello 👋
          </div>
        ) : (
          // FIX: normalise every message before rendering so attachments is
          // always an array — this is the primary fix for the empty-bubble bug.
          messages.map(normalizeNotification).map((msg, i) => {
            const isMe      = String(msg.sent_by?.id) === String(currentUserId);
            const prevMsg   = i > 0 ? normalizeNotification(messages[i - 1]) : null;
            const sameGroup = prevMsg &&
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
      <div style={{ background: "#f0f2f5", borderTop: "1px solid #e9edef" }}>
        {showOpts && (
          <div style={{ padding: "8px 16px 0", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#667781" }}>Priority:</span>
            {["Low", "Normal", "High", "Urgent"].map(p => (
              <button key={p} onClick={() => setPriority(p)} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                border: priority === p
                  ? `1.5px solid ${p === "Urgent" ? "#dc2626" : p === "High" ? "#d97706" : "#00a884"}`
                  : "1.5px solid #e9edef",
                background: priority === p
                  ? (p === "Urgent" ? "#fef2f2" : p === "High" ? "#fffbeb" : "#e8f8f0")
                  : "#fff",
                color: priority === p
                  ? (p === "Urgent" ? "#dc2626" : p === "High" ? "#d97706" : "#00a884")
                  : "#667781",
                cursor: "pointer", fontFamily: "inherit",
              }}>{p}</button>
            ))}
          </div>
        )}

        {pendingFiles.length > 0 && (
          <div style={{ padding: "8px 16px 0", display: "flex",
                        flexWrap: "wrap", gap: 5 }}>
            {pendingFiles.map((f, i) => (
              <PendingChip
                key={i}
                att={f}
                onRemove={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))}
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, alignItems: "flex-end",
                      padding: "10px 12px" }}>
          <input
            ref={fileInputRef} type="file" multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
            accept="image/*,video/*,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          />

          <button onClick={() => fileInputRef.current?.click()} title="Attach"
            style={{ width: 40, height: 40, borderRadius: "50%", border: "none",
                     background: "#fff", cursor: "pointer", display: "flex",
                     alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Paperclip size={20} color="#54656f" />
          </button>

          <button onClick={() => setShowOpts(o => !o)} title="Options"
            style={{ width: 40, height: 40, borderRadius: "50%", border: "none",
                     background: showOpts ? "#e9edef" : "#fff", cursor: "pointer",
                     display: "flex", alignItems: "center", justifyContent: "center",
                     flexShrink: 0 }}>
            <MoreVertical size={20} color="#54656f" />
          </button>

          <textarea
            ref={textareaRef} value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder={`Message ${partner.full_name}…`} rows={1}
            style={{ flex: 1, fontSize: 15, padding: "10px 14px", borderRadius: 22,
                     border: "none", background: "#fff", color: "#111b21",
                     outline: "none", resize: "none", fontFamily: "inherit",
                     lineHeight: 1.5, maxHeight: 120, overflowY: "auto" }}
          />

          <button
            onClick={handleSend}
            disabled={(!text.trim() && pendingFiles.length === 0) || sending}
            style={{
              width: 40, height: 40, borderRadius: "50%", border: "none",
              background: (text.trim() || pendingFiles.length > 0) && !sending
                ? "#00a884" : "#8696a0",
              cursor: (text.trim() || pendingFiles.length > 0) && !sending
                ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}>
            {sending
              ? <div style={{ width: 14, height: 14,
                              border: "2px solid rgba(255,255,255,0.5)",
                              borderTopColor: "#fff", borderRadius: "50%",
                              animation: "spin 0.8s linear infinite" }} />
              : <Send size={18} color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Inbox View ────────────────────────────────────────────────────────────

function InboxView({ notifications, onRefresh, onMarkAll, loading }) {
  const directMsgs   = notifications.filter(n => n.notification_type === "message");
  const systemNotifs = notifications.filter(n => n.notification_type !== "message");

  const typeLabel = (type) => {
    const map = { alert: "Alert", announcement: "Announcement",
                  system: "System", message: "Message" };
    return map[type] || type;
  };
  const typeColor = (type) => {
    const map = { alert: "#dc2626", announcement: "#d97706",
                  system: "#2563EB", message: "#7C3AED" };
    return map[type] || "#6B7280";
  };

  const renderItem = (rawN) => {
    // FIX: normalise each inbox item too
    const n = normalizeNotification(rawN);
    return (
      <div key={n.id} style={{
        borderBottom: "1px solid #f0f2f5",
        background: n.status === "Unread" ? "#fafff8" : "#fff",
        padding: "12px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Avatar name={n.sent_by?.full_name} role={n.sent_by?.role} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111b21" }}>
                {n.sent_by?.full_name || "System"}
              </span>
              <RolePill role={n.sent_by?.role} />
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20,
                background: `${typeColor(n.notification_type)}18`,
                color: typeColor(n.notification_type),
                textTransform: "uppercase", letterSpacing: 0.4,
              }}>
                {typeLabel(n.notification_type)}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            {n.status === "Unread" && (
              <span style={{ width: 8, height: 8, borderRadius: "50%",
                             background: "#25D366", display: "inline-block" }} />
            )}
            <span style={{ fontSize: 11, color: "#8696a0" }}>{formatTime(n.sent_at)}</span>
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111b21", marginBottom: 2 }}>
          {n.title}
        </div>
        {/* FIX: show text OR attachment count — never blank */}
        <div style={{ fontSize: 13, color: "#667781", lineHeight: 1.5 }}>
          {n.message
            || (n.attachments.length > 0 ? `📎 ${n.attachments.length} attachment(s)` : "")}
        </div>
        {/* FIX: n.attachments is guaranteed an array — no optional chaining needed */}
        {n.attachments.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {n.attachments.map(a => (
              <AttachmentRenderer key={a.id} att={a} inBubble={false} isMe={false} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e9edef",
                    display: "flex", alignItems: "center", gap: 10, background: "#f0f2f5" }}>
        <Inbox size={18} color="#54656f" />
        <span style={{ fontSize: 16, fontWeight: 600, color: "#111b21", flex: 1 }}>
          Inbox
        </span>
        <button onClick={onMarkAll} style={{ fontSize: 13, color: "#667781",
                                             border: "none", background: "none",
                                             cursor: "pointer", fontWeight: 500,
                                             display: "flex", alignItems: "center", gap: 4 }}>
          <CheckSquare size={15} /> Mark all read
        </button>
        <button onClick={onRefresh} style={{ fontSize: 13, color: "#00a884",
                                             border: "none", background: "none",
                                             cursor: "pointer", fontWeight: 600,
                                             display: "flex", alignItems: "center", gap: 4 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#8696a0",
                        padding: 40, fontSize: 13 }}>Loading…</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8696a0",
                        marginTop: 60, fontSize: 13 }}>Inbox is empty</div>
        ) : (
          <>
            {directMsgs.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8696a0",
                              padding: "10px 16px 4px", letterSpacing: 0.8,
                              textTransform: "uppercase", background: "#f8f9fa",
                              borderBottom: "1px solid #f0f2f5" }}>
                  Personal Messages
                </div>
                {directMsgs.map(renderItem)}
              </>
            )}
            {systemNotifs.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#8696a0",
                              padding: "10px 16px 4px", letterSpacing: 0.8,
                              textTransform: "uppercase", background: "#f8f9fa",
                              borderBottom: "1px solid #f0f2f5" }}>
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
  display: "block", fontSize: 12, fontWeight: 600, color: "#667781",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
};
const inputStyle = {
  width: "100%", fontSize: 14, padding: "10px 12px", borderRadius: 10,
  border: "1px solid #e9edef", background: "#f0f2f5", color: "#111b21",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 14,
};

function BroadcastSendView({ onSend }) {
  const [form, setForm]   = useState({
    title: "", message: "", priority: "Normal",
    recipientType: "Role", recipientRole: "teacher",
  });
  const [state, setState]             = useState("idle");
  const [attachments, setAttachments] = useState([]);
  const [addPoll, setAddPoll]         = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canSend = form.title.trim() && form.message.trim() && state === "idle"
    && (!addPoll || (
      pollQuestion.trim() && pollOptions.filter(o => o.trim()).length >= 2
    ));

  const handleSend = async () => {
    if (!canSend) return;
    setState("sending");
    try {
      await onSend(
        null, form.title, form.message, form.priority,
        form.recipientType, form.recipientRole, attachments,
        addPoll
          ? { question: pollQuestion, options: pollOptions.filter(o => o.trim()) }
          : null,
      );
      setState("sent");
      setTimeout(() => setState("idle"), 3000);
      setForm(f => ({ ...f, title: "", message: "" }));
      setAttachments([]);
      setAddPoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e9edef",
                    background: "#f0f2f5", display: "flex", alignItems: "center", gap: 10 }}>
        <Megaphone size={18} color="#54656f" />
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111b21" }}>
            Broadcast Notification
          </div>
          <div style={{ fontSize: 12, color: "#667781" }}>
            Messages appear in recipients' Chat tab
          </div>
        </div>
      </div>
      <div style={{ padding: 24, maxWidth: 520 }}>
        <label style={labelStyle}>Send to</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["Role", "Specific Role"], ["All", "All Staff"]].map(([val, lbl]) => (
            <button key={val} onClick={() => set("recipientType", val)} style={{
              flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600,
              borderRadius: 10, cursor: "pointer",
              border: form.recipientType === val ? "none" : "1px solid #e9edef",
              background: form.recipientType === val ? "#00a884" : "#f0f2f5",
              color: form.recipientType === val ? "#fff" : "#667781",
              fontFamily: "inherit",
            }}>{lbl}</button>
          ))}
        </div>

        {form.recipientType === "Role" && (
          <>
            <label style={labelStyle}>Role</label>
            <select value={form.recipientRole}
              onChange={e => set("recipientRole", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}>
              {Object.entries(ROLES).filter(([k]) => k !== "admin").map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </>
        )}

        <label style={labelStyle}>Priority</label>
        <select value={form.priority} onChange={e => set("priority", e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}>
          {["Low", "Normal", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
        </select>

        <label style={labelStyle}>Subject</label>
        <input type="text" value={form.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Broadcast subject…" style={inputStyle} />

        <label style={labelStyle}>Message</label>
        <textarea value={form.message} onChange={e => set("message", e.target.value)}
          rows={5} placeholder="Write your broadcast message…"
          style={{ ...inputStyle, resize: "vertical" }} />

        <label style={labelStyle}>Attachments</label>
        <div style={{ marginBottom: 14 }}>
          <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
            accept="image/*,video/*,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
            onChange={e => setAttachments(prev => [
              ...prev, ...Array.from(e.target.files || [])
            ])} />
          <button onClick={() => fileInputRef.current?.click()} style={{
            fontSize: 13, padding: "7px 14px", borderRadius: 8,
            border: "1.5px dashed #e9edef", background: "#f0f2f5",
            cursor: "pointer", color: "#667781", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Paperclip size={14} /> Attach files (images, videos, docs)
          </button>
          {attachments.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
              {attachments.map((f, i) => (
                <PendingChip
                  key={i} att={f}
                  onRemove={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setAddPoll(v => !v)} style={{
          fontSize: 13, padding: "7px 14px", borderRadius: 8, marginBottom: 14,
          border: `1.5px solid ${addPoll ? "#00a884" : "#e9edef"}`,
          background: addPoll ? "#e8f8f0" : "#f0f2f5",
          color: addPoll ? "#00a884" : "#667781",
          cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <BarChart2 size={14} /> {addPoll ? "Remove Poll" : "Add Poll"}
        </button>

        {addPoll && (
          <div style={{ background: "#f0f2f5", border: "1px solid #e9edef",
                        borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <label style={{ ...labelStyle, color: "#00a884" }}>Poll Question</label>
            <input type="text" value={pollQuestion}
              onChange={e => setPollQuestion(e.target.value)}
              placeholder="e.g. What day works for the meeting?"
              style={{ ...inputStyle, background: "#fff", marginBottom: 10 }} />
            <label style={{ ...labelStyle, color: "#00a884" }}>Options</label>
            {pollOptions.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input type="text" value={opt}
                  onChange={e => setPollOptions(o => o.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`Option ${i + 1}`}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1, background: "#fff" }} />
                {pollOptions.length > 2 && (
                  <button onClick={() => setPollOptions(o => o.filter((_, j) => j !== i))}
                    style={{ background: "none", border: "none", cursor: "pointer",
                             color: "#dc2626", display: "flex", alignItems: "center" }}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setPollOptions(o => [...o, ""])}
              style={{ fontSize: 12, color: "#00a884", border: "none",
                       background: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
              + Add option
            </button>
          </div>
        )}

        {state === "sent" && (
          <div style={{ padding: "10px 14px", background: "#e8f8f0", color: "#00a884",
                        borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            ✓ Broadcast sent successfully
          </div>
        )}
        {state === "error" && (
          <div style={{ padding: "10px 14px", background: "#fef2f2", color: "#dc2626",
                        borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            Failed to send — please try again.
          </div>
        )}

        <button onClick={handleSend} disabled={!canSend} style={{
          width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
          background: canSend ? "#00a884" : "#e9edef",
          color: canSend ? "#fff" : "#8696a0",
          fontWeight: 700, fontSize: 15,
          cursor: canSend ? "pointer" : "default",
          fontFamily: "inherit", transition: "background 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {state === "sending" ? "Sending…" : <><Send size={16} /> Send Broadcast</>}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export default function StaffMessaging() {
  const { user, getAuthHeaders } = useAuth();
  const currentUserId = user?.id ? String(user.id) : null;
  const canBroadcast  = BROADCAST_ROLES.includes((user?.role || "").toLowerCase());

  const authHeaders = useMemo(() => getAuthHeaders(), [getAuthHeaders]);

  const [staff, setStaff]                   = useState([]);
  const [conversations, setConversations]   = useState([]);
  const [broadcasts, setBroadcasts]         = useState([]);
  const [inbox, setInbox]                   = useState([]);
  const [messages, setMessages]             = useState([]);
  const [activePartner, setActivePartner]   = useState(null);
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [view, setView]                     = useState("chat");
  const [chatUnread, setChatUnread]         = useState(0);
  const [inboxUnread, setInboxUnread]       = useState(0);
  const [chatLoading, setChatLoading]       = useState(false);
  const [staffLoading, setStaffLoading]     = useState(true);
  const [inboxLoading, setInboxLoading]     = useState(false);

  const initDone         = useRef(false);
  const activePartnerRef = useRef(null);
  const loadFnsRef       = useRef({});

  const apiCall = useCallback(
    (path, opts = {}) => api.call(authHeaders, path, opts),
    [authHeaders],
  );

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const r = await apiCall("/notifications/staff/list/");
      setStaff(r?.staff || []);
    } catch (e) { console.error(e); }
    finally { setStaffLoading(false); }
  }, [apiCall]);

  const loadConversations = useCallback(async () => {
    try {
      const [cr, ur] = await Promise.all([
        apiCall("/notifications/conversations/"),
        apiCall("/notifications/unread-count/"),
      ]);
      setConversations(cr?.conversations || []);
      setChatUnread(ur?.chat_unread ?? 0);
      setInboxUnread(ur?.inbox_unread ?? 0);
    } catch (e) { console.error(e); }
  }, [apiCall]);

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    try {
      const [br, all] = await Promise.all([
        apiCall("/notifications/inbox/?scope=broadcast&page=1&page_size=50"),
        apiCall("/notifications/inbox/?page=1&page_size=100"),
      ]);
      setBroadcasts(br?.notifications || []);
      const allNotifs = all?.notifications || [];
      const personal = allNotifs.filter(n => n.recipient_type === "User");
      setInbox(personal);
    } catch (e) { console.error(e); }
    finally { setInboxLoading(false); }
  }, [apiCall]);

  const loadConversation = useCallback(async (partner) => {
    if (!partner) return;
    setChatLoading(true);
    try {
      const r = await apiCall(`/notifications/conversation/${partner.id}/`);
      // FIX: normalise every message from the API so attachments is always an array
      setMessages((r?.messages || []).map(normalizeNotification));
    } catch (e) { console.error(e); }
    finally { setChatLoading(false); }
  }, [apiCall]);

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
    const token = localStorage.getItem("access_token")
      || localStorage.getItem("accessToken")
      || localStorage.getItem("token")
      || "";
    const ws = new WebSocket(`${WS_BASE_URL}/ws/notifications/?token=${token}`);
    ws.onopen  = () => console.log("[WS] Connected");
    ws.onclose = e  => console.log("[WS] Closed", e.code);
    ws.onerror = e  => console.error("[WS] Error", e);

    ws.onmessage = (event) => {
      try {
        const data        = JSON.parse(event.data);
        const isBroadcast = data.recipient_type === "Role" || data.recipient_type === "All";
        const isDM        = data.notification_type === "message" &&
                            data.recipient_type === "User";

        if (isBroadcast) {
          setBroadcasts(prev => prev.some(b => b.id === data.id) ? prev : [data, ...prev]);
          setChatUnread(u => u + 1);
          loadFnsRef.current.loadInbox?.();
        }
        if (isDM) {
          const partner     = activePartnerRef.current;
          const senderId    = data.sent_by?.id != null ? String(data.sent_by.id) : null;
          const recipientId = data.recipient_id != null ? String(data.recipient_id) : null;

          if (partner) {
            const pid = String(partner.id);
            const belongsHere =
              (senderId === pid && recipientId === currentUserId) ||
              (senderId === currentUserId && recipientId === pid);
            if (belongsHere) {
              // Always re-fetch so server-generated attachment URLs are included
              loadFnsRef.current.loadConversation?.(partner);
            }
          }
          if (recipientId === currentUserId && senderId !== currentUserId) {
            loadFnsRef.current.loadInbox?.();
          }
          loadFnsRef.current.loadConversations?.();
        }
      } catch { console.warn("[WS] Bad message", event.data); }
    };
    return () => ws.close();
  }, [currentUserId]);

  // ── Send ──────────────────────────────────────────────────────────────

  const handleSend = async (
    recipientId, title, message, priority,
    recipientType = "User", recipientRole = null,
    files = [], pollMeta = null,
  ) => {
    try {
      let notification;

      if (files?.length > 0) {
        const fd = new FormData();
        fd.append("recipient_type", recipientType);
        if (recipientType === "User")  fd.append("recipient_id", recipientId);
        if (recipientType === "Role")  fd.append("recipient_role", recipientRole);
        fd.append("notification_type", "message");
        fd.append("title", title);
        fd.append("message", message);
        fd.append("priority", priority);

        files.forEach(f => {
          const mime = resolveFileMime(f);
          const blob = mime !== f.type ? new Blob([f], { type: mime }) : f;
          fd.append("attachments", blob, f.name);
        });

        const r = await apiCall("/notifications/send/", { method: "POST", body: fd });
        notification = r?.notification;
      } else {
        const r = await apiCall("/notifications/send/", {
          method: "POST",
          body: JSON.stringify({
            recipient_type: recipientType,
            ...(recipientType === "User"
              ? { recipient_id: recipientId }
              : recipientType === "Role"
              ? { recipient_role: recipientRole }
              : {}),
            notification_type: "message",
            title, message, priority,
          }),
        });
        notification = r?.notification;
      }

      if (pollMeta && notification?.id) {
        await apiCall("/notifications/polls/create/", {
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
        if (partner && String(partner.id) === String(recipientId)) {
          // FIX: always reload the conversation after send so the newly saved
          // attachment URLs from the server are present in the message list.
          await loadConversation(partner);
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
      const r = await apiCall(`/notifications/${notificationId}/edit/`, {
        method: "PATCH",
        body: JSON.stringify({ message: newMessage }),
      });
      if (r?.notification) {
        // FIX: normalise edited notification too
        setMessages(prev =>
          prev.map(m => m.id === notificationId ? normalizeNotification(r.notification) : m)
        );
      }
    } catch (err) { alert("Failed to edit: " + err.message); }
  };

  const handleDelete = async (notificationId) => {
    try {
      await apiCall(`/notifications/${notificationId}/delete/`, { method: "DELETE" });
      setMessages(prev => prev.filter(m => m.id !== notificationId));
      await loadConversations();
    } catch (err) { alert("Failed to delete: " + err.message); }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      const r = await apiCall(`/notifications/polls/${pollId}/vote/`, {
        method: "POST",
        body: JSON.stringify({ option_index: optionIndex }),
      });
      if (r?.poll) {
        setActiveBroadcast(prev => prev ? { ...prev, poll: r.poll } : prev);
        setMessages(prev => prev.map(m => m.poll?.id === pollId ? { ...m, poll: r.poll } : m));
        setBroadcasts(prev => prev.map(b => b.poll?.id === pollId ? { ...b, poll: r.poll } : b));
      }
    } catch (err) { alert("Failed to vote: " + err.message); }
  };

  const handleMarkAll = async () => {
    await apiCall("/notifications/mark-all-read/", { method: "POST" });
    await loadInbox();
    await loadConversations();
  };

  const totalInboxUnread = inboxUnread + inbox.filter(n => n.status === "Unread").length;

  activePartnerRef.current = activePartner;

  const handleSelectBroadcast = async (b) => {
    setActiveBroadcast(b);
    setActivePartner(null);
    setView("chat");
    const wasUnread = b.status === "Unread";
    setBroadcasts(prev => prev.map(x => x.id === b.id ? { ...x, status: "Read" } : x));
    if (wasUnread) {
      setChatUnread(u => Math.max(0, u - 1));
      try { await apiCall(`/notifications/${b.id}/read/`, { method: "PATCH" }); }
      catch (e) { console.warn("Could not mark broadcast read:", e); }
    }
  };

  const handleSelectPartner = (partner) => {
    setActivePartner(partner);
    setActiveBroadcast(null);
    activePartnerRef.current = partner;
    setView("chat");
    loadConversation(partner);
    loadConversations();
  };

  if (!currentUserId) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#667781" }}>
        Please log in to access messaging.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d7db; border-radius: 4px; }
        textarea { scrollbar-width: thin; }
      `}</style>
      <div style={{
        height: "100%", width: "100%", display: "flex", flexDirection: "column",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
      }}>
        <div style={{
          display: "flex", flex: 1, minHeight: 0, overflow: "hidden",
          borderRadius: 12, boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          border: "1px solid #e9edef",
        }}>
          <Sidebar
            staff={staff} conversations={conversations} broadcasts={broadcasts}
            activePartnerId={activePartner?.id} activeBroadcastId={activeBroadcast?.id}
            onSelectPartner={handleSelectPartner} onSelectBroadcast={handleSelectBroadcast}
            chatUnread={chatUnread} inboxUnread={totalInboxUnread}
            view={view}
            onViewChange={v => {
              setView(v);
              setActivePartner(null);
              setActiveBroadcast(null);
            }}
            loading={staffLoading} currentUserId={currentUserId} canBroadcast={canBroadcast}
          />

          {view === "chat" && !activePartner && !activeBroadcast && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          gap: 16, background: "#f0f2f5" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%",
                            background: "#e9edef", display: "flex",
                            alignItems: "center", justifyContent: "center" }}>
                <Send size={32} color="#8696a0" />
              </div>
              <p style={{ color: "#41525d", fontSize: 14, margin: 0, fontWeight: 500 }}>
                Select a conversation or broadcast
              </p>
            </div>
          )}

          {view === "chat" && activePartner && !activeBroadcast && (
            <ChatView
              partner={activePartner} messages={messages}
              onSend={handleSend} onEdit={handleEdit}
              onDelete={handleDelete} onVote={handleVote}
              loading={chatLoading} currentUserId={currentUserId}
            />
          )}

          {view === "chat" && activeBroadcast && !activePartner && (
            <BroadcastDetailView broadcast={activeBroadcast} onVote={handleVote} />
          )}

          {view === "inbox" && (
            <InboxView
              notifications={inbox} onRefresh={loadInbox}
              onMarkAll={handleMarkAll} loading={inboxLoading}
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