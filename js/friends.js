const me = localStorage.getItem("currentUser");
const myData = JSON.parse(localStorage.getItem(`user_${me}`));
const searchInput = document.getElementById("searchUser");
const suggestionList = document.createElement("ul"); // สร้าง List สำหรับแสดงผลการค้นหา
suggestionList.id = "suggestionList";
searchInput.parentNode.appendChild(suggestionList);

// 1. ระบบค้นหาแบบ Real-time (แสดงรายชื่อที่คล้ายกัน)
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestionList.innerHTML = "";
  
  if (query.length < 1) return;

  // วนลูปหา User ทั้งหมดใน localStorage (ในระบบจริงจะดึงจาก Database)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("user_")) {
      const userName = key.replace("user_", "");
      
      // ถ้าชื่อคล้ายกับที่พิมพ์ และไม่ใช่ตัวเอง และยังไม่ได้ติดตาม
      if (userName.toLowerCase().includes(query) && userName !== me && !myData.following.includes(userName)) {
        const li = document.createElement("li");
        li.innerHTML = `<span>${userName}</span> <button onclick="followUser('${userName}')" style="padding:4px 8px; font-size:12px;">+ ติดตาม</button>`;
        li.style = "display:flex; justify-content:space-between; background:#333; padding:10px; margin-top:2px; border-radius:5px;";
        suggestionList.appendChild(li);
      }
    }
  }
});

// 2. ฟังก์ชันกดติดตาม (Add Friend)
window.followUser = (target) => {
  myData.following.push(target);
  localStorage.setItem(`user_${me}`, JSON.stringify(myData));
  alert(`ติดตาม ${target} เรียบร้อยแล้ว`);
  searchInput.value = "";
  suggestionList.innerHTML = "";
  renderFriends();
};

// 3. ฟังก์ชันเลิกติดตาม (Unfriend)
window.unfollowUser = (target) => {
  if (confirm(`คุณต้องการเลิกติดตาม ${target} ใช่หรือไม่?`)) {
    myData.following = myData.following.filter(user => user !== target);
    localStorage.setItem(`user_${me}`, JSON.stringify(myData));
    renderFriends();
  }
};

// 4. แสดงรายชื่อเพื่อนพร้อมปุ่ม Unfriend
function renderFriends() {
  const list = document.getElementById("followingList");
  list.innerHTML = "";
  myData.following.forEach(user => {
    const li = document.createElement("li");
    li.style = "display:flex; justify-content:space-between; align-items:center; background:#222; padding:12px; margin-bottom:8px; border-radius:8px;";
    li.innerHTML = `
      <span>👤 ${user}</span>
      <button onclick="unfollowUser('${user}')" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">ลบเพื่อน</button>
    `;
    list.appendChild(li);
  });
}

renderFriends();