/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  Search, Send, Paperclip, MoreVertical, Edit2, Trash2,
  CheckCheck, Check, Megaphone, BarChart2, Inbox,
  ChevronDown, X, FileText, Image as ImageIcon,
  RefreshCw, CheckSquare, Film, Music, AlertCircle,
  ArrowUp, Bell, MessageSquare,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const BROADCAST_ROLES = ["registrar"];

const ROLES = {
  registrar:         { color: "#2563EB", label: "Registrar" },
  bursar:            { color: "#D97706", label: "Bursar" },
  hr:                { color: "#16A34A", label: "HR" },
  hr_manager:        { color: "#16A34A", label: "HR" },
  accountant:        { color: "#0891B2", label: "Accountant" },
  teacher:           { color: "#7C3AED", label: "Teacher" },
  deputy_principal:  { color: "#DB2777", label: "Dep. Principal" },
  principal:         { color: "#DC2626", label: "Principal" },
  admin:             { color: "#DC2626", label: "Admin" },
};

const VIDEO_EXTS = [".mp4",".webm",".mov",".avi",".mkv"];
const IMAGE_EXTS = [".jpg",".jpeg",".png",".gif",".webp",".svg"];
const AUDIO_EXTS = [".mp3",".wav",".ogg",".aac",".m4a"];

function isVideo(att) {
  const name = (att.original_name || att.name || "").toLowerCase();
  return VIDEO_EXTS.some(e => name.endsWith(e));
}
function isImage(att) {
  const name = (att.original_name || att.name || "").toLowerCase();
  return IMAGE_EXTS.some(e => name.endsWith(e));
}
function isAudio(att) {
  const name = (att.original_name || att.name || "").toLowerCase();
  return AUDIO_EXTS.some(e => name.endsWith(e));
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
}

function getRoleInfo(role) {
  const key = (role || "").toLowerCase().replace(/[\s-]/g, "_");
  return ROLES[key] || { color: "#6B7280", label: role || "Staff" };
}

// Simple fetch wrapper
async function fetchJSON(endpoint, options = {}, getAuthHeaders) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  const headers = { ...getAuthHeaders() };
  
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// UI Components
function Avatar({ name, role, size = 36 }) {
  const { color } = getRoleInfo(role);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}20`, color: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 600, fontSize: size * 0.35,
    }}>
      {getInitials(name)}
    </div>
  );
}

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      background: "#059669", color: "#fff", fontSize: 10,
      borderRadius: 30, padding: "1px 6px", minWidth: 18,
      textAlign: "center",
    }}>{count > 99 ? "99+" : count}</span>
  );
}

export default function StaffMessaging() {
  const { user, getAuthHeaders } = useAuth();
  const currentUserId = user?.id ? String(user.id) : null;
  const canBroadcast = BROADCAST_ROLES.includes((user?.role || "").toLowerCase());

  const [staff, setStaff] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [view, setView] = useState("chat");
  const [chatUnread, setChatUnread] = useState(0);
  const [inboxUnread, setInboxUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState("");

  // Load all data
  useEffect(() => {
    if (!currentUserId) return;
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Load staff
        const staffData = await fetchJSON("/notifications/staff/list/", { method: "GET" }, getAuthHeaders);
        setStaff(staffData?.staff || []);
        
        // Load conversations
        const convData = await fetchJSON("/notifications/conversations/", { method: "GET" }, getAuthHeaders);
        setConversations(convData?.conversations || []);
        
        // Load unread counts
        const unreadData = await fetchJSON("/notifications/unread-count/", { method: "GET" }, getAuthHeaders);
        setChatUnread(unreadData?.chat_unread ?? 0);
        setInboxUnread(unreadData?.inbox_unread ?? 0);
        
        // Load broadcasts
        const broadcastData = await fetchJSON("/notifications/inbox/?scope=broadcast&page=1&page_size=50", { method: "GET" }, getAuthHeaders);
        setBroadcasts(broadcastData?.notifications || []);
        
        // Load inbox
        const inboxData = await fetchJSON("/notifications/inbox/?page=1&page_size=100", { method: "GET" }, getAuthHeaders);
        const allNotifs = inboxData?.notifications || [];
        setInbox(allNotifs.filter(n => n.recipient_type === "User"));
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUserId, getAuthHeaders]);

  // Load conversation messages
  const loadConversation = async (partnerId) => {
    try {
      const data = await fetchJSON(`/notifications/conversation/${partnerId}/`, { method: "GET" }, getAuthHeaders);
      setMessages(data?.messages || []);
    } catch (err) {
      console.error("Load conversation error:", err);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!inputText.trim() || !activePartner || sending) return;
    
    setSending(true);
    try {
      const result = await fetchJSON("/notifications/send/", {
        method: "POST",
        body: JSON.stringify({
          recipient_type: "User",
          recipient_id: activePartner.id,
          notification_type: "message",
          title: inputText.slice(0, 50),
          message: inputText,
          priority: "Normal",
        }),
      }, getAuthHeaders);
      
      if (result?.notification) {
        setMessages(prev => [...prev, result.notification]);
        setInputText("");
        // Refresh conversations to update last message
        const convData = await fetchJSON("/notifications/conversations/", { method: "GET" }, getAuthHeaders);
        setConversations(convData?.conversations || []);
      }
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await fetchJSON(`/notifications/${notificationId}/read/`, { method: "PATCH" }, getAuthHeaders);
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // Select partner
  const selectPartner = async (partner) => {
    setActivePartner(partner);
    setActiveBroadcast(null);
    await loadConversation(partner.id);
    
    // Mark conversation as read
    const conv = conversations.find(c => c.partner?.id === partner.id);
    if (conv?.unread_count > 0) {
      const convData = await fetchJSON("/notifications/conversations/", { method: "GET" }, getAuthHeaders);
      setConversations(convData?.conversations || []);
      const unreadData = await fetchJSON("/notifications/unread-count/", { method: "GET" }, getAuthHeaders);
      setChatUnread(unreadData?.chat_unread ?? 0);
    }
  };

  // Select broadcast
  const selectBroadcast = async (broadcast) => {
    setActiveBroadcast(broadcast);
    setActivePartner(null);
    setView("chat");
    
    if (broadcast.status === "Unread") {
      await markAsRead(broadcast.id);
      setBroadcasts(prev => prev.map(b => b.id === broadcast.id ? { ...b, status: "Read" } : b));
      setChatUnread(prev => Math.max(0, prev - 1));
    }
  };

  // Group staff by role
  const groupedStaff = {};
  staff.forEach(s => {
    const label = getRoleInfo(s.role).label;
    if (!groupedStaff[label]) groupedStaff[label] = [];
    groupedStaff[label].push(s);
  });

  const convMap = Object.fromEntries(conversations.map(c => [c.partner?.id, c]));
  const unreadBroadcasts = broadcasts.filter(b => b.status === "Unread").length;
  const inboxBadgeCount = inboxUnread + unreadBroadcasts;

  if (!currentUserId) {
    return <div style={{ padding: 40, textAlign: "center" }}>Please log in to access messaging.</div>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", background: "#FAFAFA" }}>
      {/* Sidebar */}
      <div style={{ width: 280, background: "#FFFFFF", borderRight: "1px solid #E8E8E8", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 16px", borderBottom: "1px solid #E8E8E8" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Messages</h2>
        </div>
        
        {/* Tabs */}
        <div style={{ display: "flex", padding: 12, gap: 4 }}>
          <button onClick={() => setView("chat")} style={{
            flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: view === "chat" ? "#EFF6FF" : "transparent",
            color: view === "chat" ? "#1D4ED8" : "#6B7280",
            border: "none", cursor: "pointer",
          }}>Chats {chatUnread > 0 && `(${chatUnread})`}</button>
          <button onClick={() => setView("inbox")} style={{
            flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: view === "inbox" ? "#EFF6FF" : "transparent",
            color: view === "inbox" ? "#1D4ED8" : "#6B7280",
            border: "none", cursor: "pointer",
          }}>Inbox {inboxBadgeCount > 0 && `(${inboxBadgeCount})`}</button>
          {canBroadcast && (
            <button onClick={() => setView("broadcast")} style={{
              flex: 1, padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: view === "broadcast" ? "#EFF6FF" : "transparent",
              color: view === "broadcast" ? "#1D4ED8" : "#6B7280",
              border: "none", cursor: "pointer",
            }}>Broadcast</button>
          )}
        </div>
        
        {/* Chat List */}
        {view === "chat" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {/* Broadcasts */}
            {broadcasts.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", padding: "12px 16px 4px", textTransform: "uppercase" }}>Broadcasts</div>
                {broadcasts.map(b => (
                  <div key={b.id} onClick={() => selectBroadcast(b)} style={{
                    padding: "10px 16px", cursor: "pointer",
                    background: activeBroadcast?.id === b.id ? "#EFF6FF" : "transparent",
                    borderLeft: activeBroadcast?.id === b.id ? "3px solid #1D4ED8" : "3px solid transparent",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: b.status === "Unread" ? 700 : 500, fontSize: 13 }}>{b.title}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatTime(b.sent_at)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{b.sent_by?.full_name}</div>
                  </div>
                ))}
              </>
            )}
            
            {/* Staff */}
            {loading ? (
              <div style={{ padding: 20, textAlign: "center", color: "#9CA3AF" }}>Loading...</div>
            ) : (
              Object.entries(groupedStaff).map(([roleLabel, members]) => (
                <div key={roleLabel}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", padding: "12px 16px 4px", textTransform: "uppercase" }}>{roleLabel}</div>
                  {members.map(s => {
                    const conv = convMap[s.id];
                    const unread = conv?.unread_count || 0;
                    return (
                      <div key={s.id} onClick={() => selectPartner(s)} style={{
                        padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                        background: activePartner?.id === s.id ? "#EFF6FF" : "transparent",
                        borderLeft: activePartner?.id === s.id ? "3px solid #1D4ED8" : "3px solid transparent",
                      }}>
                        <Avatar name={s.full_name} role={s.role} size={36} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontWeight: unread ? 700 : 500 }}>{s.full_name}</span>
                            {unread > 0 && <Badge count={unread} />}
                          </div>
                          <div style={{ fontSize: 12, color: "#6B7280" }}>{s.role}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        )}
        
        {/* Inbox View */}
        {view === "inbox" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 20, textAlign: "center" }}>Loading...</div>
            ) : inbox.length === 0 && broadcasts.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>No messages</div>
            ) : (
              <>
                {broadcasts.map(b => (
                  <div key={b.id} style={{ padding: "12px 16px", borderBottom: "1px solid #E8E8E8", background: b.status === "Unread" ? "#EFF6FF" : "#FFFFFF" }}>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{b.message?.substring(0, 100)}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>From: {b.sent_by?.full_name}</div>
                  </div>
                ))}
                {inbox.map(n => (
                  <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid #E8E8E8", background: n.status === "Unread" ? "#ECFDF5" : "#FFFFFF" }}>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{n.message?.substring(0, 100)}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>From: {n.sent_by?.full_name}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        
        {/* Broadcast Send View */}
        {view === "broadcast" && canBroadcast && (
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Send Broadcast</h3>
            <input id="broadcastTitle" type="text" placeholder="Title" style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #E8E8E8" }} />
            <textarea id="broadcastMessage" placeholder="Message" rows={4} style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #E8E8E8" }} />
            <select id="broadcastRole" style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: "1px solid #E8E8E8" }}>
              <option value="teacher">Teacher</option>
              <option value="registrar">Registrar</option>
              <option value="bursar">Bursar</option>
              <option value="principal">Principal</option>
              <option value="All">All Staff</option>
            </select>
            <button onClick={async () => {
              const title = document.getElementById('broadcastTitle').value;
              const message = document.getElementById('broadcastMessage').value;
              const role = document.getElementById('broadcastRole').value;
              if (!title || !message) { alert("Title and message required"); return; }
              
              try {
                await fetchJSON("/notifications/send/", {
                  method: "POST",
                  body: JSON.stringify({
                    recipient_type: role === "All" ? "All" : "Role",
                    recipient_role: role === "All" ? null : role,
                    notification_type: "message",
                    title: title,
                    message: message,
                    priority: "Normal",
                  }),
                }, getAuthHeaders);
                alert("Broadcast sent!");
                document.getElementById('broadcastTitle').value = '';
                document.getElementById('broadcastMessage').value = '';
              } catch (err) {
                alert("Failed to send: " + err.message);
              }
            }} style={{ width: "100%", padding: 10, background: "#1D4ED8", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
              Send Broadcast
            </button>
          </div>
        )}
      </div>
      
      {/* Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activePartner ? (
          <>
            {/* Header */}
            <div style={{ padding: "12px 20px", background: "#FFFFFF", borderBottom: "1px solid #E8E8E8", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={activePartner.full_name} role={activePartner.role} size={40} />
              <div>
                <div style={{ fontWeight: 600 }}>{activePartner.full_name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{activePartner.role}</div>
              </div>
            </div>
            
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
              {messages.map(msg => {
                const isMe = String(msg.sent_by?.id) === String(currentUserId);
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 12 }}>
                    <div style={{
                      maxWidth: "70%",
                      background: isMe ? "#DCF8C6" : "#FFFFFF",
                      padding: "10px 14px",
                      borderRadius: isMe ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
                      border: "1px solid #E8E8E8",
                    }}>
                      <div>{msg.message}</div>
                      <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{formatTime(msg.sent_at)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Input */}
            <div style={{ padding: "12px 20px", background: "#FFFFFF", borderTop: "1px solid #E8E8E8", display: "flex", gap: 8 }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: 10, borderRadius: 20, border: "1px solid #E8E8E8", outline: "none" }}
              />
              <button onClick={handleSend} disabled={sending || !inputText.trim()} style={{
                padding: "8px 16px", background: "#1D4ED8", color: "white", border: "none", borderRadius: 20, cursor: "pointer",
                opacity: (sending || !inputText.trim()) ? 0.5 : 1,
              }}>
                <Send size={16} />
              </button>
            </div>
          </>
        ) : activeBroadcast ? (
          <div style={{ flex: 1, padding: 40 }}>
            <h2>{activeBroadcast.title}</h2>
            <p style={{ marginTop: 16 }}>{activeBroadcast.message}</p>
            <div style={{ marginTop: 16, fontSize: 12, color: "#6B7280" }}>
              From: {activeBroadcast.sent_by?.full_name} · {formatTime(activeBroadcast.sent_at)}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
