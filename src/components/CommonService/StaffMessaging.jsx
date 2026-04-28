/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws").replace(/^https/, "wss");

// ─── Role config ────────────────────────────────────────────────────────────
const ROLES = {
  registrar:         { color: "#2563EB", label: "Registrar" },
  bursar:            { color: "#D97706", label: "Bursar" },
  hr:                { color: "#16A34A", label: "HR" },
  accountant:        { color: "#0891B2", label: "Accountant" },
  teacher:           { color: "#7C3AED", label: "Teacher" },
  school_deputyadmin:{ color: "#DB2777", label: "Dep. Admin" },
  deputyadmin:       { color: "#DB2777", label: "Dep. Admin" },
  admin:             { color: "#DC2626", label: "Admin" },
};

function getRoleInfo(role) {
  const key = (role || "").toLowerCase().replace(/[\s-]/g, "_");
  return ROLES[key] || { color: "#6B7280", label: role || "Staff" };
}

function getInitials(name = "?") {
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── UI atoms ───────────────────────────────────────────────────────────────
function Avatar({ name, role, size = 38 }) {
  const { color } = getRoleInfo(role);
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (
    <div style={{
      width: size, height: size, minWidth: size,
      borderRadius: "50%",
      background: `rgba(${r},${g},${b},0.12)`,
      color: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.36,
      border: `1.5px solid rgba(${r},${g},${b},0.25)`,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "-0.5px",
    }}>
      {getInitials(name)}
    </div>
  );
}

function RolePill({ role }) {
  const { color, label } = getRoleInfo(role);
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (
    <span style={{
      background: `rgba(${r},${g},${b},0.10)`,
      color, fontSize: 10, fontWeight: 600,
      padding: "2px 8px", borderRadius: 20,
      letterSpacing: 0.4, textTransform: "uppercase",
      fontFamily: "'DM Mono', monospace",
    }}>
      {label}
    </span>
  );
}

function UnreadDot({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: "#EF4444", color: "#fff",
      fontSize: 10, fontWeight: 700,
      borderRadius: 30, padding: "1px 6px",
      minWidth: 18, textAlign: "center",
      lineHeight: "16px", display: "inline-block",
    }}>{count}</span>
  );
}

// ─── API client ──────────────────────────────────────────────────────────────
const api = {
  async call(authHeaders, path, opts = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(authHeaders || {}),
    };
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
    if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
    return res.json();
  },
};

// ════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════════════════════
function Sidebar({ staff, conversations, activeId, onSelect, unread, view, onViewChange, loading, currentUserId }) {
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
    { id: "chat",      label: "Chat" },
    { id: "inbox",     label: "Inbox" },
    { id: "broadcast", label: "Broadcast" },
  ];

  return (
    <div style={{
      width: 270, minWidth: 270, display: "flex", flexDirection: "column",
      height: "100%", background: "#FAFAF9",
      borderRight: "1px solid #E7E5E4",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 16px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", flex: 1, fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.3px" }}>
            Messages
          </span>
          {unread > 0 && <UnreadDot count={unread} />}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "#F5F5F4", borderRadius: 10, padding: 3, gap: 2, marginBottom: 12 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => onViewChange(t.id)} style={{
              flex: 1, padding: "5px 0", fontSize: 12, fontWeight: 600,
              border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
              background: view === t.id ? "#fff" : "transparent",
              color: view === t.id ? "#1C1917" : "#78716C",
              boxShadow: view === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              fontFamily: "inherit",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#A8A29E", fontSize: 13 }}>⌕</span>
          <input
            type="text" placeholder="Search staff…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", fontSize: 13, padding: "8px 10px 8px 28px",
              borderRadius: 10, border: "1px solid #E7E5E4",
              background: "#fff", color: "#1C1917", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: "center", color: "#A8A29E", fontSize: 13 }}>Loading staff…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#A8A29E", fontSize: 13 }}>No staff found</div>
        ) : (
          Object.entries(grouped).map(([roleLabel, members]) => (
            <div key={roleLabel}>
              <div style={{
                fontSize: 10, fontWeight: 700, color: "#A8A29E",
                padding: "12px 16px 4px", letterSpacing: 1,
                textTransform: "uppercase", fontFamily: "'DM Mono', monospace",
              }}>
                {roleLabel}
              </div>
              {members.map(s => {
                const conv = convMap[s.id];
                const isActive = activeId === s.id;
                const unreadCount = conv?.unread_count || 0;
                return (
                  <div
                    key={s.id}
                    onClick={() => onSelect(s)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", cursor: "pointer",
                      background: isActive ? "#F0EDE8" : "transparent",
                      borderLeft: `3px solid ${isActive ? getRoleInfo(s.role).color : "transparent"}`,
                      transition: "all 0.12s",
                    }}
                  >
                    <Avatar name={s.full_name} role={s.role} size={38} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{
                          fontSize: 13, fontWeight: unreadCount ? 700 : 500,
                          color: "#1C1917", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                          flex: 1,
                        }}>
                          {s.full_name}
                        </span>
                        {unreadCount > 0 && <UnreadDot count={unreadCount} />}
                      </div>
                      {conv?.last_message && (
                        <div style={{
                          fontSize: 11, color: "#78716C",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {conv.last_message.sent_by?.id === currentUserId ? "You: " : ""}
                          {conv.last_message.message}
                        </div>
                      )}
                    </div>
                    {conv?.last_message && (
                      <span style={{ fontSize: 10, color: "#A8A29E", whiteSpace: "nowrap" }}>
                        {formatTime(conv.last_message.sent_at)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CHAT VIEW
// ════════════════════════════════════════════════════════════════════════════
function ChatView({ partner, messages, onSend, loading, currentUserId }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [showOpts, setShowOpts] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !partner || sending) return;
    setSending(true);
    try {
      await onSend(partner.id, text.trim().slice(0, 50), text.trim(), priority);
      setText("");
      setPriority("Normal");
    } finally {
      setSending(false);
    }
    textareaRef.current?.focus();
  };

  if (!partner) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 10,
        background: "#FAFAF9",
      }}>
        <div style={{ fontSize: 42, opacity: 0.25 }}>✉</div>
        <p style={{ color: "#78716C", fontSize: 14, margin: 0 }}>Select a staff member to start a conversation</p>
      </div>
    );
  }

  const { color } = getRoleInfo(partner.role);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #E7E5E4",
        display: "flex", alignItems: "center", gap: 12,
        background: "#FAFAF9",
      }}>
        <Avatar name={partner.full_name} role={partner.role} size={42} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {partner.full_name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <RolePill role={partner.role} />
            <span style={{ fontSize: 11, color: "#A8A29E" }}>{partner.email}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "20px 24px",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#A8A29E", padding: 40, fontSize: 13 }}>Loading…</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#A8A29E", marginTop: 60, fontSize: 13 }}>
            No messages yet — say hello 👋
          </div>
        ) : (
          messages.map(msg => {
            const isMe = String(msg.sent_by?.id) === String(currentUserId);
            return (
              <div key={msg.id} style={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                gap: 10, alignItems: "flex-end",
              }}>
                {!isMe && <Avatar name={msg.sent_by?.full_name} role={msg.sent_by?.role} size={30} />}
                <div style={{ maxWidth: "68%" }}>
                  <div style={{
                    background: isMe ? color : "#F5F5F4",
                    color: isMe ? "#fff" : "#1C1917",
                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}>
                    {msg.priority === "Urgent" && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: isMe ? "rgba(255,255,255,0.8)" : "#DC2626", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>
                        ⚡ Urgent
                      </span>
                    )}
                    {msg.priority === "High" && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: isMe ? "rgba(255,255,255,0.8)" : "#D97706", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>
                        ↑ High
                      </span>
                    )}
                    {msg.message}
                  </div>
                  <div style={{
                    fontSize: 10, color: "#A8A29E", marginTop: 3,
                    textAlign: isMe ? "right" : "left",
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {formatTime(msg.sent_at)}
                    {isMe && msg.status === "Read" && " · seen"}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div style={{ borderTop: "1px solid #E7E5E4", padding: "12px 16px", background: "#FAFAF9" }}>
        {showOpts && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={{
                fontSize: 12, padding: "6px 10px", borderRadius: 8,
                border: "1px solid #E7E5E4", background: "#fff",
                color: "#1C1917", outline: "none", fontFamily: "inherit",
              }}
            >
              {["Low", "Normal", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
            </select>
            <span style={{ fontSize: 11, color: "#A8A29E", alignSelf: "center" }}>Priority</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder={`Message ${partner.full_name}…`}
            rows={2}
            style={{
              flex: 1, fontSize: 14, padding: "10px 14px",
              borderRadius: 14, border: "1px solid #E7E5E4",
              background: "#fff", outline: "none", resize: "none",
              fontFamily: "inherit", color: "#1C1917", lineHeight: 1.5,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <button
              onClick={() => setShowOpts(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                border: "1px solid #E7E5E4", background: showOpts ? "#F0EDE8" : "#fff",
                cursor: "pointer", fontSize: 14, color: "#78716C",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              title="Options"
            >
              ⋯
            </button>
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              style={{
                width: 36, height: 36, borderRadius: 10, border: "none",
                background: text.trim() && !sending ? color : "#E7E5E4",
                color: text.trim() && !sending ? "#fff" : "#A8A29E",
                cursor: text.trim() && !sending ? "pointer" : "default",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
              title="Send (Enter)"
            >
              {sending ? "…" : "↑"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INBOX VIEW
// ════════════════════════════════════════════════════════════════════════════
function InboxView({ notifications, onRefresh, onMarkAll, loading }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #E7E5E4",
        display: "flex", alignItems: "center", gap: 10,
        background: "#FAFAF9",
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", flex: 1, fontFamily: "'DM Serif Display', Georgia, serif" }}>Inbox</span>
        <button onClick={onMarkAll} style={{ fontSize: 12, color: "#78716C", border: "none", background: "none", cursor: "pointer", fontWeight: 500 }}>Mark all read</button>
        <button onClick={onRefresh} style={{ fontSize: 12, color: "#2563EB", border: "none", background: "none", cursor: "pointer", fontWeight: 600 }}>Refresh</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#A8A29E", padding: 40, fontSize: 13 }}>Loading…</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", color: "#A8A29E", marginTop: 60, fontSize: 13 }}>Inbox is empty</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{
              borderRadius: 14, border: "1px solid #E7E5E4",
              background: n.status === "Unread" ? "#FFFBEB" : "#fff",
              padding: "13px 15px", marginBottom: 10,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <Avatar name={n.sent_by?.full_name} role={n.sent_by?.role} size={32} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginRight: 6 }}>{n.sent_by?.full_name}</span>
                  <RolePill role={n.sent_by?.role} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {n.status === "Unread" && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
                  )}
                  <span style={{ fontSize: 10, color: "#A8A29E", fontFamily: "'DM Mono', monospace" }}>{formatTime(n.sent_at)}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1C1917", marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: "#44403C", lineHeight: 1.5 }}>{n.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BROADCAST VIEW
// ════════════════════════════════════════════════════════════════════════════
function BroadcastView({ onSend }) {
  const [form, setForm] = useState({
    title: "", message: "", priority: "Normal",
    recipientType: "Role", recipientRole: "teacher",
  });
  const [state, setState] = useState("idle");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSend = async () => {
    if (!form.title.trim() || !form.message.trim()) return;
    setState("sending");
    try {
      await onSend(null, form.title, form.message, form.priority, form.recipientType, form.recipientRole);
      setState("sent");
      setTimeout(() => setState("idle"), 3000);
      setForm(f => ({ ...f, title: "", message: "" }));
    } catch (err) {
      console.error(err);
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const canSend = form.title.trim() && form.message.trim() && state === "idle";

  return (
    <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
      <div style={{
        padding: "14px 20px", borderBottom: "1px solid #E7E5E4",
        background: "#FAFAF9",
      }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1C1917", fontFamily: "'DM Serif Display', Georgia, serif" }}>
          Broadcast Notification
        </span>
      </div>

      <div style={{ padding: 24, maxWidth: 520 }}>
        <label style={labelStyle}>Send to</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["Role", "Specific Role"], ["All", "All Staff"]].map(([val, lbl]) => (
            <button key={val} onClick={() => set("recipientType", val)} style={{
              flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600,
              borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
              border: form.recipientType === val ? "none" : "1px solid #E7E5E4",
              background: form.recipientType === val ? "#1C1917" : "#fff",
              color: form.recipientType === val ? "#fff" : "#44403C",
              fontFamily: "inherit",
            }}>
              {lbl}
            </button>
          ))}
        </div>

        {form.recipientType === "Role" && (
          <>
            <label style={labelStyle}>Role</label>
            <select value={form.recipientRole} onChange={e => set("recipientRole", e.target.value)} style={selectStyle}>
              {Object.entries(ROLES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </>
        )}

        <label style={labelStyle}>Priority</label>
        <select value={form.priority} onChange={e => set("priority", e.target.value)} style={selectStyle}>
          {["Low", "Normal", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
        </select>

        <label style={labelStyle}>Subject</label>
        <input
          type="text" value={form.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Notification title…"
          style={inputStyle}
        />

        <label style={labelStyle}>Message</label>
        <textarea
          value={form.message}
          onChange={e => set("message", e.target.value)}
          rows={5}
          placeholder="Write your message…"
          style={{ ...inputStyle, resize: "vertical" }}
        />

        {state === "sent" && (
          <div style={{ padding: "10px 14px", background: "#F0FDF4", color: "#16A34A", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            ✓ Broadcast sent successfully
          </div>
        )}
        {state === "error" && (
          <div style={{ padding: "10px 14px", background: "#FEF2F2", color: "#DC2626", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
            ✕ Failed to send. Please try again.
          </div>
        )}

        <button onClick={handleSend} disabled={!canSend} style={{
          width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
          background: canSend ? "#1C1917" : "#E7E5E4",
          color: canSend ? "#fff" : "#A8A29E",
          fontWeight: 700, fontSize: 14, cursor: canSend ? "pointer" : "default",
          fontFamily: "'DM Serif Display', Georgia, serif",
          letterSpacing: 0.3, transition: "background 0.15s",
        }}>
          {state === "sending" ? "Sending…" : "Send Broadcast"}
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#57534E",
  marginBottom: 6, marginTop: 0, textTransform: "uppercase",
  letterSpacing: 0.5, fontFamily: "'DM Mono', monospace",
};
const inputStyle = {
  width: "100%", fontSize: 14, padding: "10px 12px",
  borderRadius: 10, border: "1px solid #E7E5E4",
  background: "#FAFAF9", color: "#1C1917", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", marginBottom: 16,
};
const selectStyle = { ...inputStyle, cursor: "pointer" };

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT (WebSocket, no polling, stable API calls)
// ════════════════════════════════════════════════════════════════════════════
export default function StaffMessaging() {
  const { user, getAuthHeaders } = useAuth();
  const currentUserId = user?.id ? String(user.id) : null;
  const authHeaders = useMemo(() => getAuthHeaders(), [user]);

  const [staff, setStaff] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [view, setView] = useState("chat");
  const [unread, setUnread] = useState(0);
  const [inbox, setInbox] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(false);

  const initDone = useRef(false);
  const activePartnerRef = useRef(null);
  const loadFunctionsRef = useRef({}); // to call inside websocket without stale closures

  const apiCall = useCallback(
    (path, opts = {}) => api.call(authHeaders, path, opts),
    [authHeaders]
  );

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const r = await apiCall("/notifications/staff/list/");
      setStaff(r?.staff || []);
    } catch (e) {
      console.error("loadStaff:", e);
    } finally {
      setStaffLoading(false);
    }
  }, [apiCall]);

  const loadConversations = useCallback(async () => {
    try {
      const [cr, ur] = await Promise.all([
        apiCall("/notifications/conversations/"),
        apiCall("/notifications/unread-count/"),
      ]);
      setConversations(cr?.conversations || []);
      setUnread(ur?.unread_count || 0);
    } catch (e) {
      console.error("loadConversations:", e);
    }
  }, [apiCall]);

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    try {
      const r = await apiCall("/notifications/inbox/?page=1");
      setInbox(r?.notifications || []);
    } catch (e) {
      console.error("loadInbox:", e);
    } finally {
      setInboxLoading(false);
    }
  }, [apiCall]);

  const loadConversation = useCallback(async (partner) => {
    if (!partner) return;
    setChatLoading(true);
    try {
      const r = await apiCall(`/notifications/conversation/${partner.id}/`);
      setMessages(r?.messages || []);
    } catch (e) {
      console.error("loadConversation:", e);
    } finally {
      setChatLoading(false);
    }
  }, [apiCall]);

  // Store loadConversation in ref for websocket callback
  useEffect(() => {
    loadFunctionsRef.current.loadConversation = loadConversation;
    loadFunctionsRef.current.loadConversations = loadConversations;
    loadFunctionsRef.current.loadInbox = loadInbox;
  }, [loadConversation, loadConversations, loadInbox]);

  // Initial data fetch (once)
  useEffect(() => {
    if (!currentUserId || initDone.current) return;
    initDone.current = true;
    loadStaff();
    loadConversations();
    loadInbox();
  }, [currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // WebSocket setup (replaces polling)
  useEffect(() => {
    if (!currentUserId) return;
    const token = localStorage.getItem("access_token") || "";
    const url = `${WS_BASE_URL}/ws/notifications/?token=${token}`;
    const ws = new WebSocket(url);
    ws.onopen = () => console.log("[StaffMessaging] WebSocket connected");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.notification_type === "message") {
          const partner = activePartnerRef.current;
          // Refresh the conversation thread if it's related to the active partner
          if (partner && (data.sent_by?.id === partner.id || data.sent_by?.id === currentUserId)) {
            loadFunctionsRef.current.loadConversation?.(partner);
          }
          // Always update sidebar and inbox
          loadFunctionsRef.current.loadConversations?.();
          loadFunctionsRef.current.loadInbox?.();
        }
      } catch (err) {
        console.warn("Invalid WebSocket message", event.data);
      }
    };
    ws.onclose = (e) => console.log("[StaffMessaging] WebSocket closed", e.code);
    return () => ws.close();
  }, [currentUserId]); // reconnect on user change

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = async (recipientId, title, message, priority, recipientType = "User", recipientRole = null) => {
    try {
      if (recipientType === "User") {
        await apiCall("/notifications/send/", {
          method: "POST",
          body: JSON.stringify({
            recipient_type: "User",
            recipient_id: recipientId,
            notification_type: "message",
            title,
            message,
            priority,
          }),
        });
        const partner = activePartnerRef.current;
        if (partner?.id === recipientId) {
          await loadConversation(partner);
        }
      } else {
        await apiCall("/notifications/send/", {
          method: "POST",
          body: JSON.stringify({
            recipient_type: recipientType,
            recipient_role: recipientRole,
            notification_type: "message",
            title,
            message,
            priority,
          }),
        });
      }
      // Refresh sidebar (WebSocket may also trigger, but this ensures immediate local update)
      await loadConversations();
      await loadInbox();
    } catch (err) {
      console.error("Send failed:", err);
      alert("Failed to send: " + err.message);
    }
  };

  const handleMarkAll = async () => {
    await apiCall("/notifications/mark-all-read/", { method: "POST" });
    await loadInbox();
    await loadConversations();
  };

  // Sync ref
  activePartnerRef.current = activePartner;

  function handleSelect(partner) {
    setActivePartner(partner);
    activePartnerRef.current = partner;
    setView("chat");
    loadConversation(partner);
    loadConversations(); // update unread badges
  }

  if (!currentUserId) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#78716C" }}>
        Please log in to access messaging.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D6D3D1; border-radius: 4px; }
      `}</style>

      <div style={{
        height: "100%", width: "100%",
        display: "flex", flexDirection: "column",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div style={{
          display: "flex", flex: 1, minHeight: 0,
          borderRadius: 16, overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid #E7E5E4",
          background: "#fff",
        }}>
          <Sidebar
            staff={staff}
            conversations={conversations}
            activeId={activePartner?.id}
            onSelect={handleSelect}
            unread={unread}
            view={view}
            onViewChange={setView}
            loading={staffLoading}
            currentUserId={currentUserId}
          />

          {view === "chat" && (
            <ChatView
              partner={activePartner}
              messages={messages}
              onSend={handleSend}
              loading={chatLoading}
              currentUserId={currentUserId}
            />
          )}
          {view === "inbox" && (
            <InboxView
              notifications={inbox}
              onRefresh={loadInbox}
              onMarkAll={handleMarkAll}
              loading={inboxLoading}
            />
          )}
          {view === "broadcast" && <BroadcastView onSend={handleSend} />}
        </div>
      </div>
    </>
  );
}