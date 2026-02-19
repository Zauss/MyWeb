import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getDatabase, ref, push, set, update, onChildAdded, onValue, onDisconnect, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// ข้อมูลจริงจากโปรเจกต์ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBntzOdc54Fzy0-144mp5kItIzsjZFMMKM",
  authDomain: "myweb-afa8e.firebaseapp.com",
  databaseURL: "https://myweb-afa8e-default-rtdb.firebaseio.com",
  projectId: "myweb-afa8e",
  storageBucket: "myweb-afa8e.firebasestorage.app",
  messagingSenderId: "161641818327",
  appId: "1:161641818327:web:865e552b6224b7e514a892",
  measurementId: "G-3Q5QP6CP2R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ฟังก์ชันอัปเดตสถานะ ออนไลน์/ออฟไลน์
export function setUserPresence(username) {
  if (!username) return;
  const statusRef = ref(db, `usersStatus/${username}`);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === false) return;
    onDisconnect(statusRef).set({
      state: "offline",
      last_changed: serverTimestamp()
    }).then(() => {
      set(statusRef, {
        state: "online",
        last_changed: serverTimestamp()
      });
    });
  });
}

// ฟังก์ชันอัปเดตการกำลังพิมพ์
export function setTypingStatus(username, room, isTyping) {
  update(ref(db, `typing/${room}`), { [username]: isTyping });
}

export { db, ref, push, onChildAdded, onValue, serverTimestamp };