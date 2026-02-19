import { setUserPresence } from "./firebase-config.js";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const rememberCheck = document.getElementById("remember");

// ระบบจดจำชื่อผู้ใช้ (Remember Me)
if (localStorage.getItem("rememberUser")) {
  usernameInput.value = localStorage.getItem("rememberUser");
  rememberCheck.checked = true;
}

// สลับหน้าจอสมัครสมาชิก/เข้าสู่ระบบ
document.getElementById("showRegister")?.addEventListener("click", () => {
  loginForm.classList.add("hidden"); registerForm.classList.remove("hidden");
});
document.getElementById("backToLogin")?.addEventListener("click", () => {
  registerForm.classList.add("hidden"); loginForm.classList.remove("hidden");
});

// สมัครสมาชิก
registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = regUsername.value.trim();
  if (localStorage.getItem(`user_${u}`)) return alert("ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว");
  
  const userData = {
    username: u,
    password: regPassword.value.trim(),
    question: regQuestion.value.trim(),
    answer: regAnswer.value.trim(),
    settings: { theme: "dark" },
    following: []
  };
  localStorage.setItem(`user_${u}`, JSON.stringify(userData));
  alert("สมัครสมาชิกสำเร็จ!");
  registerForm.classList.add("hidden"); loginForm.classList.remove("hidden");
});

// เข้าสู่ระบบ
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = usernameInput.value.trim();
  const p = password.value.trim();
  const data = localStorage.getItem(`user_${u}`);
  
  if (!data) return alert("ไม่พบผู้ใช้งานนี้");
  const user = JSON.parse(data);
  if (user.password !== p) return alert("รหัสผ่านไม่ถูกต้อง");

  // บันทึกสถานะการ Login
  if (rememberCheck.checked) localStorage.setItem("rememberUser", u);
  else localStorage.removeItem("rememberUser");
  
  localStorage.setItem("currentUser", u);
  setUserPresence(u); // อัปเดตสถานะออนไลน์ไปที่ Firebase
  alert("เข้าสู่ระบบเรียบร้อย!");
  location.href = "index.html";
});