const users = JSON.parse(localStorage.getItem("users")) || {};
const currentUser = localStorage.getItem("currentUser");

if (!currentUser || !users[currentUser]) {
  window.location.href = "index.html";
}

const user = users[currentUser];

// SET USER INFO
document.getElementById("userName").innerText = user.name;
document.getElementById("userMobile").innerText = user.mobile;
document.getElementById("username").innerText = user.mobile;
document.getElementById("userExam").innerText = user.exam;

// MEMBER SINCE
const date = new Date(user.createdAt || Date.now());
document.getElementById("memberSince").innerText =
  date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

// STATS (mock for now)
document.getElementById("totalTests").innerText = 0;
document.getElementById("bestScore").innerText = "0%";
document.getElementById("average").innerText = "0%";
document.getElementById("accuracy").innerText = "0%";

// NAV
function goBack() {
  window.location.href = "dashboard.html";
}


function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
