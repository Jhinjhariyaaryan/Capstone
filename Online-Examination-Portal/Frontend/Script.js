// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "/api";

// Temporary Auth Credentials (Replace dynamically after Login)
const CURRENT_USER_ID = "6630f1e8a24c13001f3b8901"; 
const AUTH_TOKEN = "YOUR_JWT_TOKEN_HERE"; 

// Global State
let currentExamId = null;
let currentExamData = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let examTimerInterval = null;
let tabSwitchCounter = 0;
let lastSubmissionId = null;

// Page Navigation
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  const sidebarItems = document.querySelectorAll('.sidebar li');
  sidebarItems.forEach(item => item.classList.remove('active'));
  const targetNav = document.getElementById(`nav-${pageId}`);
  if (targetNav) targetNav.classList.add('active');

  if (pageId === 'dashboard') loadDashboardData();
  if (pageId === 'myExams') loadExamsList();
}

// Initial Loading
window.onload = function () {
  showGreeting();
  loadUserProfile();
  loadDashboardData();
  setupAntiCheating();
};

// Greeting Generator
function showGreeting() {
  const hour = new Date().getHours();
  let greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const userGreeting = document.getElementById("greeting");
  if (userGreeting) userGreeting.innerHTML = `${greeting}, Aryan!`;
}

// API: Load Profile
async function loadUserProfile() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile/${CURRENT_USER_ID}`);
    if (res.ok) {
      const user = await res.json();
      document.getElementById("showName").innerText = user.name;
      document.getElementById("showId").innerText = user.studentId;
      document.getElementById("showEmail").innerText = user.email;
      document.getElementById("showCourse").innerText = user.course;
      document.getElementById("showSemester").innerText = user.semester;
      if (user.profilePic) document.getElementById("profilePic").src = user.profilePic;
    }
  } catch (err) {
    console.error("Profile load error:", err);
  }
}

// API: Load Dashboard Statistics & Exams
async function loadDashboardData() {
  try {
    const statsRes = await fetch(`${API_BASE_URL}/results/dashboard-stats/${CURRENT_USER_ID}`);
    if (statsRes.ok) {
      const stats = await statsRes.json();
      document.getElementById("upcomingCount").innerText = stats.upcomingCount;
      document.getElementById("progressCount").innerText = stats.progressCount;
      document.getElementById("completedCount").innerText = stats.completedCount;
    }

    const examsRes = await fetch(`${API_BASE_URL}/exams/list`);
    if (examsRes.ok) {
      const exams = await examsRes.json();
      renderDashboardExams(exams);
    }
  } catch (err) {
    console.error("Dashboard error:", err);
  }
  // Dashboard Load hone par execute hone wala function
async function loadDashboardData() {
  try {
    // 1. Fetch Exams List
    const examsRes = await fetch(`${API_BASE_URL}/exams/list`);
    const exams = await examsRes.json();
    renderDashboardExams(exams);

    // 2. Fetch Recent Submissions
    fetchRecentSubmissions();

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

// Recent Submissions fetch aur render karne ka logic
async function fetchRecentSubmissions() {
  const container = document.getElementById("recentSubmissionsList");
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/results/recent/${CURRENT_USER_ID}`);
    const submissions = await res.json();

    if (!submissions || submissions.length === 0) {
      container.innerHTML = "<p style='color: gray;'>No submissions found yet. Take an exam to see your results here!</p>";
      return;
    }

    container.innerHTML = submissions.map(sub => {
      const examTitle = sub.examId ? sub.examId.title : "DSA Exam";
      const date = new Date(sub.submittedAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="exam-item" style="border-left: 5px solid #2563eb; margin-bottom: 10px;">
          <div>
            <h3>${examTitle}</h3>
            <p style="font-size: 13px; color: #666; margin-top: 4px;">Submitted on: ${date}</p>
          </div>
          <div style="text-align: right;">
            <h3 style="color: #16a34a; margin: 0;">${sub.score} / ${sub.totalMarks}</h3>
            <p style="font-size: 13px; font-weight: bold; margin-top: 2px;">${sub.percentage}% Score</p>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error fetching recent submissions:", error);
    container.innerHTML = "<p style='color: red;'>Failed to load recent submissions.</p>";
  }
}

// Submit Handler inside Script.js
if (data.success) {
    // Refresh Dashboard Data in background
    loadDashboardData();
    
    // Switch to Results Page
    showPage("results");
}
}

function renderDashboardExams(exams) {
  const listContainer = document.getElementById("dashboardExamList");
  listContainer.innerHTML = "";

  exams.forEach(exam => {
    const item = document.createElement("div");
    item.className = "exam-item";
    item.innerHTML = `
      <div>
        <h3>${exam.title}</h3>
        <p>${exam.date} | ${exam.timeSlot}</p>
      </div>
      <button onclick="prepareExam('${exam._id}')">Start Exam</button>
    `;
    listContainer.appendChild(item);
  });
}

// API: Load My Exams
async function loadExamsList() {
  const examsRes = await fetch(`${API_BASE_URL}/exams/list`);
  if (examsRes.ok) {
    const exams = await examsRes.json();
    const listContainer = document.getElementById("myExamsList");
    listContainer.innerHTML = "";

    exams.forEach(exam => {
      const item = document.createElement("div");
      item.className = "exam-item";
      item.innerHTML = `
        <span>${exam.title}</span>
        <button onclick="prepareExam('${exam._id}')">Start Exam</button>
      `;
      listContainer.appendChild(item);
    });
  }
}

// Prepare Exam & Payment Gate
async function prepareExam(examId) {
  currentExamId = examId;
  const res = await fetch(`${API_BASE_URL}/exams/${examId}`);
  if (res.ok) {
    currentExamData = await res.json();
    document.getElementById("instructionExamTitle").innerText = currentExamData.title;

    if (currentExamData.isPaid) {
      document.getElementById("paymentContainer").style.display = "block";
      document.getElementById("examFeeDisplay").innerText = currentExamData.feeAmount;
      document.getElementById("startExamBtn").style.display = "none";
    } else {
      document.getElementById("paymentContainer").style.display = "none";
      document.getElementById("startExamBtn").style.display = "inline-block";
    }
    showPage("instructions");
  }
}

// Apply Fee Waiver
async function applyWaiverCode() {
  const code = document.getElementById("waiverCodeInput").value;
  const res = await fetch(`${API_BASE_URL}/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
      examId: currentExamId,
      waiverCode: code,
      userEmail: document.getElementById("showEmail").innerText
    })
  });
  const data = await res.json();
  if (data.success) {
    alert(data.message);
    document.getElementById("paymentContainer").style.display = "none";
    document.getElementById("startExamBtn").style.display = "inline-block";
  } else {
    alert("Invalid waiver code.");
  }
}

// Start Timed Exam
function startSelectedExam() {
  if (!currentExamData || !currentExamData.questions.length) {
    alert("Exam questions unavailable.");
    return;
  }

  currentQuestionIndex = 0;
  userAnswers = {};
  tabSwitchCounter = 0;

  document.getElementById("activeExamTitle").innerText = currentExamData.title;
  showPage("exam");

  startTimer(currentExamData.durationMinutes * 60);
  renderCurrentQuestion();
}

// Timer Logic
function startTimer(durationSeconds) {
  let timer = durationSeconds;
  const timerDisplay = document.getElementById("timer");

  clearInterval(examTimerInterval);
  examTimerInterval = setInterval(() => {
    let hours = Math.floor(timer / 3600);
    let minutes = Math.floor((timer % 3600) / 60);
    let seconds = Math.floor(timer % 60);

    timerDisplay.textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (--timer < 0) {
      clearInterval(examTimerInterval);
      alert("Time is up! Submitting exam automatically...");
      submitExamBackend();
    }
  }, 1000);
}

// Render Question Navigation
function renderCurrentQuestion() {
  const question = currentExamData.questions[currentQuestionIndex];
  document.getElementById("qText").innerText = `Q${currentQuestionIndex + 1}: ${question.questionText}`;

  const optionsContainer = document.getElementById("optionsContainer");
  optionsContainer.innerHTML = "";

  question.options.forEach(opt => {
    const isChecked = userAnswers[question._id] === opt ? "checked" : "";
    const label = document.createElement("label");
    label.innerHTML = `<input type="radio" name="option" value="${opt}" ${isChecked} onchange="saveAnswer('${question._id}', '${opt}')"> ${opt}`;
    optionsContainer.appendChild(label);
  });
}

function saveAnswer(qId, val) {
  userAnswers[qId] = val;
}

function navigateQuestion(step) {
  const newIdx = currentQuestionIndex + step;
  if (newIdx >= 0 && newIdx < currentExamData.questions.length) {
    currentQuestionIndex = newIdx;
    renderCurrentQuestion();
  }
}

// API: Submit Exam
async function submitExamBackend() {
  clearInterval(examTimerInterval);

  const formattedAnswers = Object.keys(userAnswers).map(qId => ({
    questionId: qId,
    answer: userAnswers[qId]
  }));

  const res = await fetch(`${API_BASE_URL}/results/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: CURRENT_USER_ID,
      examId: currentExamId,
      userAnswers: formattedAnswers,
      tabSwitches: tabSwitchCounter
    })
  });

  if (res.ok) {
    const data = await res.json();
    lastSubmissionId = data.submissionId;

    document.getElementById("resExamTitle").innerText = currentExamData.title;
    document.getElementById("resScore").innerText = `${data.score}%`;
    document.getElementById("resTotal").innerText = data.totalQuestions;
    document.getElementById("resAttempted").innerText = data.attempted;
    document.getElementById("resCorrect").innerText = data.correct;
    document.getElementById("resIncorrect").innerText = data.incorrect;

    showPage("results");
  }
}

// Anti-Cheating Controls
function setupAntiCheating() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && document.getElementById("exam").classList.contains("active")) {
      tabSwitchCounter++;
      alert(`Warning: Tab switching recorded! Total switches: ${tabSwitchCounter}`);
    }
  });

  document.addEventListener("copy", e => e.preventDefault());
  document.addEventListener("paste", e => e.preventDefault());
}

// View Solution Toggle
async function toggleSolution() {
  const solDiv = document.getElementById("solution");
  if (solDiv.style.display === "block") {
    solDiv.style.display = "none";
    return;
  }

  if (!lastSubmissionId) return;

  const res = await fetch(`${API_BASE_URL}/results/solutions/${lastSubmissionId}`);
  if (res.ok) {
    const data = await res.json();
    const container = document.getElementById("solutionContainer");
    container.innerHTML = "";

    data.solutions.forEach(s => {
      container.innerHTML += `
        <p><b>Q${s.index}.</b> ${s.questionText}</p>
        <p><b>Your Answer:</b> ${s.givenAnswer || 'Unattempted'}</p>
        <p><b>Correct Answer:</b> ${s.correctAnswer}</p>
        <p><i>Explanation:</i> ${s.explanation}</p>
        <hr>
      `;
    });
    solDiv.style.display = "block";
  }
}

// PDF Certificate Download
function downloadPDFCertificate() {
  if (!lastSubmissionId) {
    alert("No submission record found.");
    return;
  }
  window.open(`${API_BASE_URL}/results/certificate/${lastSubmissionId}`, '_blank');
}

// Modal Profile Handlers
const modal = document.getElementById("profileModal");
document.getElementById("editBtn").onclick = () => {
  modal.style.display = "block";
  document.getElementById("nameInput").value = document.getElementById("showName").innerText;
  document.getElementById("idInput").value = document.getElementById("showId").innerText;
  document.getElementById("emailInput").value = document.getElementById("showEmail").innerText;
  document.getElementById("courseInput").value = document.getElementById("showCourse").innerText;
  document.getElementById("semesterInput").value = document.getElementById("showSemester").innerText;
};

document.querySelector(".close").onclick = () => modal.style.display = "none";

document.getElementById("saveBtn").onclick = async () => {
  const formData = new FormData();
  formData.append("name", document.getElementById("nameInput").value);
  formData.append("studentId", document.getElementById("idInput").value);
  formData.append("email", document.getElementById("emailInput").value);
  formData.append("course", document.getElementById("courseInput").value);
  formData.append("semester", document.getElementById("semesterInput").value);

  const imgFile = document.getElementById("imageInput").files[0];
  if (imgFile) formData.append("profilePic", imgFile);

  const res = await fetch(`${API_BASE_URL}/auth/profile/update/${CURRENT_USER_ID}`, {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    loadUserProfile();
    modal.style.display = "none";
  }
};

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggle").innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function logout() {
  alert("Logged out successfully.");
  window.location.reload();
}

async function submitExam(userAnswers) {
  try {
    const response = await fetch(`${API_BASE_URL}/results/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: CURRENT_USER_ID,
        examId: currentExamId,
        userAnswers: userAnswers
      })
    });

    const data = await response.json();

    if (data.success) {
      // 1. Force update Result UI elements with NEW submission data
      const resultData = data.result;

      // Update score display in UI
      document.querySelector(".score h2").innerText = `${resultData.score}/${resultData.totalMarks}`;
      document.querySelector(".score p").innerText = `${resultData.percentage}%`;

      // Update breakdown boxes
      document.getElementById("totalQuestionsCount").innerText = resultData.userAnswers ? Object.keys(resultData.userAnswers).length : 0;
      document.getElementById("correctAnswersCount").innerText = resultData.correctCount;
      document.getElementById("wrongAnswersCount").innerText = resultData.incorrectCount;
      document.getElementById("unattemptedCount").innerText = resultData.unattemptedCount;

      // 2. Switch to Results Page
      showPage("results");
    } else {
      alert("Submission failed. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting exam:", error);
  }
}

document.getElementById("saveBtn").onclick = async () => {
  try {
    const formData = new FormData();
    formData.append("name", document.getElementById("nameInput").value);
    formData.append("studentId", document.getElementById("idInput").value);
    formData.append("email", document.getElementById("emailInput").value);
    formData.append("course", document.getElementById("courseInput").value);
    formData.append("semester", document.getElementById("semesterInput").value);

    const imgInput = document.getElementById("imageInput");
    if (imgInput && imgInput.files.length > 0) {
      formData.append("profilePic", imgInput.files[0]);
    }

    // Network request
    const res = await fetch(`${API_BASE_URL}/auth/profile/update/${CURRENT_USER_ID}`, {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      // Local UI update instantly (Server Response ke pehle quick update ke liye)
      document.getElementById("showName").innerText = document.getElementById("nameInput").value;
      document.getElementById("showId").innerText = document.getElementById("idInput").value;
      document.getElementById("showEmail").innerText = document.getElementById("showEmail").value || document.getElementById("emailInput").value;
      document.getElementById("showCourse").innerText = document.getElementById("courseInput").value;
      document.getElementById("showSemester").innerText = document.getElementById("semesterInput").value;

      // Re-fetch latest updated profile from backend
      await loadUserProfile();

      // Modal Hide & Input Reset
      document.getElementById("profileModal").style.display = "none";
      if (imgInput) imgInput.value = ""; 
      
      alert("Profile updated successfully!");
    } else {
      const errData = await res.json().catch(() => ({}));
      alert("Failed to update profile: " + (errData.message || res.statusText));
    }
  } catch (error) {
    console.error("Profile Save Error:", error);
    alert("Server error! Please check if your backend server is running on localhost:5000.");
  }
};
