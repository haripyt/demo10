// PREVENT BACK / RELOAD
window.history.pushState(null, null, window.location.href);
window.onpopstate = function () {
  window.history.pushState(null, null, window.location.href);
  alert("⚠️ Test in progress. You cannot go back.");
};

// PREVENT TAB CLOSE / RELOAD
window.addEventListener("beforeunload", function (e) {
  if (!testSubmitted) {
    e.preventDefault();
    e.returnValue = "Test in progress. Are you sure?";
  }
});


/************************
 * LOAD TEST CONFIG
 ************************/
const testConfig = JSON.parse(localStorage.getItem("testConfig"));

if (!testConfig) {
  alert("Test configuration missing!");
  window.location.href = "dashboard.html";
}

const totalQuestions = testConfig.questions;
const totalTime = testConfig.duration * 60;
const examGroup = testConfig.group;

/************************
 * DOM REFERENCES
 ************************/
const questionText = document.getElementById("questionText");
const optionsDiv = document.getElementById("options");
const qNo = document.getElementById("qNo");
const qCounter = document.getElementById("qCounter");
const timerEl = document.getElementById("timer");

const answeredCountEl = document.getElementById("answeredCount");
const totalCountEl = document.getElementById("totalCount");
const progressFill = document.getElementById("progressFill");

const palette = document.getElementById("palette");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const timeUpModal = document.getElementById("timeUpModal");

/************************
 * INIT STATE
 ************************/
totalCountEl.innerText = totalQuestions;

let current = 0;
let answers = Array(totalQuestions).fill(null);
let timeLeft = totalTime;
let testSubmitted = false;

/************************
 * QUESTION BANK (DUMMY)
 ************************/
const questions = Array.from({ length: totalQuestions }, (_, i) => ({
  q: `Question ${i + 1}: The capital of Tamil Nadu is`,
  options: ["Madurai", "Chennai", "Coimbatore", "Trichy"],
  answer: 1
}));

/************************
 * TIMER (AUTO SUBMIT)
 ************************/
const timeWarning = document.getElementById("timeWarning");
let warningShown = false;

const timerInterval = setInterval(() => {
  if (testSubmitted) return;

  timeLeft--;

  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerEl.innerText = `${min}:${sec.toString().padStart(2, "0")}`;

  // 🔥 TIMER TURNS RED + BLINKS (< 3 MIN)
  if (timeLeft <= 180) {
    timerEl.classList.add("timer-warning");
  }

  // 🔔 3-MIN WARNING MESSAGE (ONCE)
  if (timeLeft === 180 && !warningShown) {
    warningShown = true;
    timeWarning.style.display = "block";

    setTimeout(() => {
      timeWarning.style.display = "none";
    }, 5000);
  }

  // ⏰ TIME UP
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    timerEl.classList.remove("timer-warning"); // stop blink
    showTimeUpModal();
  }
}, 1000);

/************************
 * SHOW TIME UP MODAL
 ************************/
function showTimeUpModal() {
  testSubmitted = true;

  // Disable UI
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
  optionsDiv.style.pointerEvents = "none";

  // Show modal
  timeUpModal.style.display = "flex";

  // Auto submit after 2.5 sec
  setTimeout(() => {
    submitTest(true);
  }, 2500);
}
// ENSURE MODAL IS HIDDEN ON LOAD
timeUpModal.style.display = "none";

/************************
 * RENDER QUESTION
 ************************/
function renderQuestion() {
  qNo.innerText = current + 1;
  qCounter.innerText = `Question ${current + 1} of ${totalQuestions}`;
  questionText.innerText = questions[current].q;

  optionsDiv.innerHTML = "";

  questions[current].options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;

    if (answers[current] === i) btn.classList.add("selected");

    btn.onclick = () => {
      if (testSubmitted) return;
      answers[current] = i;
      updateUI();
      renderQuestion();
    };

    optionsDiv.appendChild(btn);
  });
}

/************************
 * UPDATE UI (PALETTE + PROGRESS)
 ************************/
function updateUI() {
  palette.innerHTML = "";

  answers.forEach((a, i) => {
    const pBtn = document.createElement("button");

    if (i === current) pBtn.className = "current";
    else if (a !== null) pBtn.className = "answered";
    else pBtn.className = "not";

    pBtn.innerText = i + 1;
    pBtn.onclick = () => {
      if (testSubmitted) return;
      current = i;
      renderQuestion();
      updateUI();
    };

    palette.appendChild(pBtn);
  });

  const answered = answers.filter(a => a !== null).length;
  answeredCountEl.innerText = answered;

  progressFill.style.width =
    `${(answered / totalQuestions) * 100}%`;

  const allAnswered = answered === totalQuestions;
  const isLast = current === totalQuestions - 1;

  nextBtn.style.display = (!isLast && !allAnswered) ? "inline-block" : "none";
  submitBtn.style.display = (isLast || allAnswered) ? "inline-block" : "inline-block";
}

/************************
 * NAVIGATION
 ************************/
function nextQuestion() {
  if (current < totalQuestions - 1) {
    current++;
    renderQuestion();
    updateUI();
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    renderQuestion();
    updateUI();
  }
}

/************************
 * SUBMIT TEST
 ************************/
function submitTest(auto = false) {
  if (testSubmitted && !auto) return;

  testSubmitted = true;
  clearInterval(timerInterval);

  timerEl.classList.remove("timer-warning");

  const correct = answers.filter(
    (a, i) => a === questions[i].answer
  ).length;

  localStorage.setItem("lastResult", JSON.stringify({
    total: totalQuestions,
    correct,
    answers,
    group: examGroup,
    duration: testConfig.duration,
    autoSubmitted: auto
  }));

  window.location.href = "result.html";
}

/************************
 * INIT
 ************************/
renderQuestion();
updateUI();
