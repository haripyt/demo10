const users = JSON.parse(localStorage.getItem("users")) || {};
const currentUser = localStorage.getItem("currentUser");

if (!currentUser || !users[currentUser]) {
  window.location.href = "index.html";
}

const user = users[currentUser];

document.getElementById("userName").innerText = user.name;
document.getElementById("examName").innerText = user.exam;

// mock values (connect later to MCQ engine)
const testsTaken = 0;
const bestScore = 0;
const accuracy = 0;
const correctAnswers = 0;

testsTakenEl = document.getElementById("testsTaken");
bestScoreEl = document.getElementById("bestScore");
accuracyEl = document.getElementById("accuracy");
correctAnswersEl = document.getElementById("correctAnswers");

testsTakenEl.innerText = testsTaken;
bestScoreEl.innerText = bestScore + "%";
accuracyEl.innerText = accuracy + "%";
correctAnswersEl.innerText = correctAnswers;

const progressPercent = Math.min((testsTaken / 10) * 100, 100);
document.getElementById("progressFill").style.width = progressPercent + "%";
document.getElementById("progressLabel").innerText =
  `${testsTaken} of 10 tests completed`;

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
function goToTestSetup() {
  window.location.href = "test-setup.html";
}
function goToProfile() {
  window.location.href = "profile.html";
}
function goToMaterials() {
  window.location.href = "study-materials.html";
}
