document.addEventListener("DOMContentLoaded", function () {
  checkAuth();
});

// User Authentication (Signup & Login)
function signup() {
  let name = document.getElementById("signup-name").value;
  let email = document.getElementById("signup-email").value;
  let password = document.getElementById("signup-password").value;
  let role = document.getElementById("signup-role").value;

  if (!name || !email || !password || !role) {
      alert("Please fill all fields.");
      return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let existingUser = users.find(user => user.email === email);

  if (existingUser) {
      alert("User already exists! Please login.");
      return;
  }

  users.push({ name, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! You can now login.");
}

function login() {
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(user => user.email === email && user.password === password);

  if (!user) {
      alert("Invalid email or password.");
      return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  if (user.role === "teacher") {
      window.location.href = "teacher.html";
  } else {
      window.location.href = "student.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Check if user is logged in
function checkAuth() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
      window.location.href = "index.html";
  }
}

// Teacher Dashboard - Create Quiz
let currentQuiz = { title: "", questions: [] };

function createQuiz() {
  let quizTitle = document.getElementById("quiz-title").value;
  if (quizTitle.trim() === "") {
      alert("Please enter a quiz title.");
      return;
  }
  currentQuiz = { title: quizTitle, questions: [] };
  document.getElementById("quiz-section").style.display = "block";
}

function addQuestion() {
  let questionText = document.getElementById("question-text").value;
  let option1 = document.getElementById("option1").value;
  let option2 = document.getElementById("option2").value;
  let option3 = document.getElementById("option3").value;
  let option4 = document.getElementById("option4").value;
  let correctAnswer = document.getElementById("correct-answer").value;

  if (!questionText || !option1 || !option2 || !option3 || !option4 || !correctAnswer) {
      alert("Please fill in all fields.");
      return;
  }

  let question = {
      text: questionText,
      options: [option1, option2, option3, option4],
      answer: correctAnswer
  };

  currentQuiz.questions.push(question);
  updateQuestionList();

  // Clear fields after adding a question
  document.getElementById("question-text").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  document.getElementById("correct-answer").value = "";
}

function updateQuestionList() {
  let questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  currentQuiz.questions.forEach((q, index) => {
      let li = document.createElement("li");
      li.innerHTML = `
          <strong>Q${index + 1}: ${q.text}</strong><br>
          1. ${q.options[0]}<br>
          2. ${q.options[1]}<br>
          3. ${q.options[2]}<br>
          4. ${q.options[3]}<br>
          <strong>Correct Answer:</strong> ${q.answer} <br>
          <button onclick="removeQuestion(${index})">Remove</button>
          <hr>
      `;
      questionList.appendChild(li);
  });
}

function removeQuestion(index) {
  currentQuiz.questions.splice(index, 1);
  updateQuestionList();
}

function saveQuiz() {
  if (currentQuiz.questions.length === 0) {
      alert("Add at least one question before saving.");
      return;
  }

  let quizCode = Math.random().toString(36).substr(2, 6); // Generate random quiz code
  localStorage.setItem(quizCode, JSON.stringify(currentQuiz)); // Save quiz in local storage

  document.getElementById("quiz-code").innerText = `Quiz Code: ${quizCode}`;
  alert("Quiz saved! Share this code with students.");
}

// Student Dashboard - Take Quiz
function startQuiz() {
  let quizCode = document.getElementById("quiz-code-input").value;
  let quizData = localStorage.getItem(quizCode);

  if (!quizData) {
      alert("Invalid quiz code!");
      return;
  }

  let quiz = JSON.parse(quizData);
  localStorage.setItem("currentQuiz", JSON.stringify(quiz));
  window.location.href = "quiz.html";
}

// Load Quiz for Students
function loadQuiz() {
  let quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  if (!quiz) {
      alert("No quiz found!");
      return;
  }

  document.getElementById("quiz-title").innerText = quiz.title;
  let quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = "";

  quiz.questions.forEach((q, index) => {
      let div = document.createElement("div");
      div.innerHTML = `
          <h3>Q${index + 1}: ${q.text}</h3>
          <label><input type="radio" name="q${index}" value="${q.options[0]}"> ${q.options[0]}</label><br>
          <label><input type="radio" name="q${index}" value="${q.options[1]}"> ${q.options[1]}</label><br>
          <label><input type="radio" name="q${index}" value="${q.options[2]}"> ${q.options[2]}</label><br>
          <label><input type="radio" name="q${index}" value="${q.options[3]}"> ${q.options[3]}</label><br>
      `;
      quizContainer.appendChild(div);
  });

  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit Quiz";
  submitBtn.onclick = submitQuiz;
  quizContainer.appendChild(submitBtn);
}

// Submit Quiz and Calculate Score
function submitQuiz() {
  let quiz = JSON.parse(localStorage.getItem("currentQuiz"));
  let score = 0;

  quiz.questions.forEach((q, index) => {
      let selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
      if (selectedOption && selectedOption.value === q.answer) {
          score++;
      }
  });

  alert(`Quiz Completed! Your Score: ${score}/${quiz.questions.length}`);
  localStorage.removeItem("currentQuiz");
  window.location.href = "student.html";
}
