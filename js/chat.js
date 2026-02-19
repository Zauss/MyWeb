import { db, ref, push, onChildAdded, onValue, serverTimestamp, setUserPresence, setTypingStatus } from "./firebase-config.js";

const me = localStorage.getItem("currentUser");
setUserPresence(me); // เริ่มติดตามสถานะตัวเองทันที

const myData = JSON.parse(localStorage.getItem(`user_${me}`));
const friendListEl = document.getElementById("friendList");
const chatBox = document.getElementById("chatBox");
const typingEl = document.getElementById("typingIndicator");
const statusEl = document.getElementById("friendStatus");
let activeFriend = null;
let currentRoom = null;

// 1. ดึงรายชื่อเพื่อน (คนที่ Follow กันและกัน)
const friends = myData.following.filter(f => {
  const otherData = JSON.parse(localStorage.getItem(`user_${f}`));
  return otherData && otherData.following.includes(me);
});

// 2. แสดงรายชื่อเพื่อนพร้อมจุดเขียว/เทา เรียลไทม์
friends.forEach(f => {
  const li = document.createElement("li");
  li.innerHTML = `<span id="dot_${f}" class="status-dot offline"></span> ${f}`;
  li.onclick = () => startChat(f);
  friendListEl.appendChild(li);

  // ฟังสถานะออนไลน์จาก Firebase
  onValue(ref(db, `usersStatus/${f}`), (snap) => {
    const data = snap.val();
    const dot = document.getElementById(`dot_${f}`);
    if (data?.state === "online") dot.className = "status-dot online";
    else dot.className = "status-dot offline";
  });
});

// 3. เริ่มห้องแชท
function startChat(friend) {
  activeFriend = friend;
  currentRoom = [me, friend].sort().join("_");
  document.getElementById("chatTitle").textContent = friend;
  chatBox.innerHTML = "";

  // ดึงข้อความ
  onChildAdded(ref(db, `chats/${currentRoom}`), (snap) => {
    renderMessage(snap.val());
  });

  // ฟังสถานะ "กำลังพิมพ์..."
  onValue(ref(db, `typing/${currentRoom}`), (snap) => {
    const t = snap.val();
    typingEl.textContent = (t && t[friend]) ? `${friend} กำลังพิมพ์...` : "";
  });

  // แสดง Last Seen
  onValue(ref(db, `usersStatus/${friend}`), (snap) => {
    const d = snap.val();
    if (d?.state === "online") statusEl.textContent = "🟢 กำลังใช้งาน";
    else if (d?.last_changed) {
      const time = new Date(d.last_changed).toLocaleTimeString();
      statusEl.textContent = `⚪ ออฟไลน์เมื่อ ${time}`;
    }
  });
}

// 4. ส่งข้อความ & Typing
document.getElementById("chatForm").onsubmit = (e) => {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  if (!activeFriend || !input.value.trim()) return;

  push(ref(db, `chats/${currentRoom}`), {
    sender: me,
    text: input.value,
    time: serverTimestamp()
  });
  
  input.value = "";
  setTypingStatus(me, currentRoom, false);
};

let typeTimer;
document.getElementById("messageInput").oninput = () => {
  if (!currentRoom) return;
  setTypingStatus(me, currentRoom, true);
  clearTimeout(typeTimer);
  typeTimer = setTimeout(() => setTypingStatus(me, currentRoom, false), 2000);
};

function renderMessage(m) {
  const div = document.createElement("div");
  div.className = `msg ${m.sender === me ? "me" : "other"}`;
  const time = m.time ? new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";
  div.innerHTML = `${m.text} <span class="time">${time}</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}