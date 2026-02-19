// ตรวจสอบว่ามี user อยู่ใน localStorage หรือไม่
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  // ถ้าไม่มี ให้เด้งไปหน้า login
  window.location.href = "login.html";
}