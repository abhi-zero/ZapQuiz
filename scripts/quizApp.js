import { animateText,scrollToSection } from "./animations.js";

// DOM Elements
const skipButton = document.querySelector(".skip-button");
const nextButton = document.querySelector(".next-button");
const toQuizSection = document.getElementById("toQuizSection");
const sectionQuizOptions = document.querySelector(".quiz-option");
const openDialogButtons = document.querySelectorAll(".quiz-option-card .card-button");
const dialogCloseButtons = document.querySelectorAll("dialog .close-button");
const resetButton = document.querySelector(".reset-button");
const retakeButton = document.querySelector(".retake-button");
const sectionQuiz = document.querySelector(".quiz-section");
const dialogStartButtons = document.querySelectorAll("dialog form button[type='submit']");
const navLinks = document.querySelectorAll(".nav-link");
const linkToCategories = navLinks[1];
const linkToHowItWorks = navLinks[2];
const linkToContact = navLinks[3];
const sectionHowItWorks = document.querySelector(".how-it-works");
const sectionContact = document.querySelector("#footer");
const sectionHero = document.getElementById("hero-section");

// State and Configuration
export const quizState = {
  selectedCategory: {
    name: "",
    id: 0,
  },
  level: "easy",
  amount: 15,
  currentQuestionIndex: 0,
  score: 0,
  wrongAnswers: 0,
  questions: [],
  skippedQuestions: [],
};

const categories = {
  "General Knowledge": 9,
  Books: 10,
  Film: 11,
  Music: 12,
  "Musicals & Theatres": 13,
  Television: 14,
  "Video Games": 15,
  "Board Games": 16,
  "Science & Nature": 17,
  Computers: 18,
  Mathematics: 19,
  Mythology: 20,
  Sports: 21,
  Geography: 22,
  History: 23,
  Politics: 24,
  Art: 25,
  Celebrities: 26,
  Animals: 27,
  Vehicles: 28,
  Comics: 29,
  Gadgets: 30,
  "Anime & Manga": 31,
  Cartoon: 32,
};

const stats = JSON.parse(localStorage.getItem("stats")) || {
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  totalSkippedQuestions: 0,
  badges: {
    1: "Beginner, Just started",
    2: "Intermediate, Good at it",
    3: "Advanced, Knows it all",
    4: "Expert, Quick thinker",
    5: "Master, Quizz master",
  },
};

displayStats();

scrollToSection(linkToCategories,sectionQuizOptions);
scrollToSection(linkToHowItWorks,sectionHowItWorks);
scrollToSection(linkToContact,sectionContact);
scrollToSection(toQuizSection,sectionQuizOptions);
dialogStartButtons.forEach((button) => {
  scrollToSection(button,sectionQuiz);
});
scrollToSection(retakeButton,sectionQuiz);

// Utility Functions
function getCategoryId(categoryName) {
  return categories[categoryName];
}

function addCategoryToState(categoryName) {
  quizState.selectedCategory = {
    name: categoryName,
    id: getCategoryId(editCategoryName(categoryName)),
  };
}

function shuffleAnswers(answers) {
  return answers.sort(() => Math.random() - 0.5);
}

function breakText(textString) {
  let splittedText = textString.split(" ");
  let clutter = "";
  splittedText.forEach((word, idx) => {
    clutter += `<span class="word">${word}</span> `;
  });
  return clutter;
}

function editCategoryName(categoryName) {
  if (!categoryName.includes(":")) {
    return categoryName;
  }
  let splittedCategory = categoryName.split(": ");
  return splittedCategory[1];
}

// Question Processing Functions
function processQuestions(questions) {
  resetQuizState();
  questions = questions.map((question) => {
    const answers = [...question.incorrect_answers, question.correct_answer];
    const shuffledAnswers = shuffleAnswers(answers);
    return {
      question: question.question,
      answers: shuffledAnswers,
      correctAnswer: question.correct_answer,
      category: question.category,
    };
  });
  return questions;
}

// API Functions
async function fetchQuestions(amount = 10, level = "easy", category = 0) {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${level}&type=multiple`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.response_code !== 0) {
      if (data.response_code === 1) {
        throw new Error(
          "We couldn't find questions for the selected category. Please choose another category or try again later."
        );
      } else {
        throw new Error("Failed to fetch questions. Please try again later.");
      }
    }
    quizState.questions = processQuestions(data.results);
    renderQuestion();
    return quizState.questions;
  } catch (error) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = error.message;
    errorMessage.classList.remove("hidden");
    setTimeout(() => {
      errorMessage.classList.add("hidden");
    }, 5000);
    return 0;
  }
}

function fetchQuestionsUsingCategory(totalQuestions, difficulty, category) {
  const categoryId = getCategoryId(category);
  fetchQuestions(totalQuestions, difficulty, categoryId);
}

function fetchQuestionsUsingCard(target) {
  const totalQuestions = document.querySelectorAll(
    "dialog select[name='total-questions']"
  );
  const difficulty = document.querySelectorAll(
    "dialog select[name='difficulty']"
  );
  const category = document.querySelector(
    "dialog select[name='category']"
  ).value;

  if (target.classList.contains("daily")) {
    fetchQuestions(totalQuestions[0].value, difficulty[0].value);
  } else {
    resetQuizState();
    fetchQuestionsUsingCategory(
      totalQuestions[1].value,
      difficulty[1].value,
      category
    );
  }
}

// UI Feedback Functions
function displayFeedbackColor(messaageType) {
  const fact = document.querySelector(".fact");
  if (messaageType === "success") {
    fact.classList.add("success");
  } else if (messaageType === "info") {
    fact.classList.add("info");
  } else if (messaageType === "error") {
    fact.classList.add("error");
  }
}

function showFeedback(title, message) {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.innerHTML = `<p>${title} :<span class="fact">${message}</span></p>`;
  feedbackDiv.classList.add("feedback-text");
}

function resetFeedback() {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.innerHTML = "";
}

// Quiz Control Functions
function checkQuizCompletion() {
  return quizState.currentQuestionIndex >= quizState.questions.length;
}

function handleAnswerClick(e) {
  const question = quizState.questions[quizState.currentQuestionIndex];
  const button = e.target;
  const selectedOption = e.target.dataset.option;
  const answerButtons = document.querySelectorAll(".quiz-option-button");
  const correctAnswers = document.querySelector(".correct-answers-count");
  const wrongAnswers = document.querySelector(".wrong-answers-count");

  if (selectedOption == question.correctAnswer) {
    quizState.score++;
    correctAnswers.textContent = quizState.score;
    button.classList.add("correct-answer");
    showFeedback(
      "Correct Answer",
      `You answered ${selectedOption} question correctly`
    );
    displayFeedbackColor("success");
    setTimeout(resetFeedback, 5000);
  } else {
    quizState.wrongAnswers++;
    wrongAnswers.textContent = quizState.wrongAnswers;

    button.classList.add("wrong-answer");
    answerButtons.forEach((button) => {
      if (button.dataset.option === question.correctAnswer) {
        button.classList.add("correct-answer");
      }
    });

    answerButtons.forEach((button) => {
      button.disabled = true;
    });

    showFeedback(
      "Wrong Answer",
      `You answered ${selectedOption} questions incorrectly`
    );
    displayFeedbackColor("error");
    setTimeout(resetFeedback, 5000);
  }
}

function renderQuestion() {
  const question = quizState.questions[quizState.currentQuestionIndex];
  const quizElement = document.getElementById("quiz");
  const answerButtons = document.querySelectorAll(".quiz-option-button");
  const categoryName = document.querySelector(".quiz-category-name");
  const questionNumber = document.querySelector(".question-number-count");
  const totalQuestions = document.querySelectorAll(".total-questions");

  const correctAnswers = document.querySelector(".correct-answers-count");
  const wrongAnswers = document.querySelector(".wrong-answers-count");
  correctAnswers.textContent = quizState.score;
  wrongAnswers.textContent = quizState.wrongAnswers;
  quizElement.innerHTML = breakText(question.question);
  answerButtons.forEach((button, idx) => {
    button.textContent = question.answers[idx];
    button.dataset.option = question.answers[idx];
    button.classList.remove("correct-answer", "wrong-answer");
    button.disabled = false;
    button.removeEventListener("click", handleAnswerClick);
    button.addEventListener("click", handleAnswerClick);
  });

  categoryName.innerHTML = editCategoryName(
    quizState.questions[quizState.currentQuestionIndex].category
  );
  totalQuestions.forEach((total) => {
    total.textContent = quizState.questions.length;
  });
  questionNumber.textContent = quizState.currentQuestionIndex + 1;
  nextButton.textContent = "Next";
}

// Event Listeners
const dialogs = document.querySelectorAll("dialog form");

dialogs.forEach((dialog) => {
  
  dialog.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchQuestionsUsingCard(e.target);
    e.target.closest("dialog").classList.add("loading-cursor");
    setTimeout(() => {
      e.target.closest("dialog").close();
    }, 2000);
  });
});



skipButton.addEventListener("click", () => {
  if (!checkQuizCompletion()) {
    quizState.currentQuestionIndex++;
    
   if(!checkQuizCompletion()){
    quizState.skippedQuestions.push(quizState.currentQuestionIndex);
    renderQuestion();
    animateText();
    }else{
      
      showFeedback(
        "Skipped",
        `You have skipped the ${quizState.skippedQuestions.length} questions`
      );
      displayFeedbackColor("info");
      setTimeout(resetFeedback, 3000);
    }
  }
  if(quizState.currentQuestionIndex >= quizState.questions.length -1){
    nextButton.textContent = "Done";
  }
  
});

function isAnswerSelected(){
  const answerButtons = document.querySelectorAll(".quiz-option-button");
  return  [...answerButtons].some((button) => button.classList.contains("correct-answer") || button.classList.contains("wrong-answer"));
}

nextButton.addEventListener("click", () => {
  if (!isAnswerSelected()) {
    showFeedback("No Answer Selected", "Please select an answer");
    displayFeedbackColor("error");
    setTimeout(resetFeedback, 3000);
    return; // Prevent further execution
  }

  if (!checkQuizCompletion()) {
    quizState.currentQuestionIndex++;
    if (!checkQuizCompletion()) {
      renderQuestion();
      animateText();
    } else {
      showFeedback("Quiz Completed", "You have completed the quiz");
      displayFeedbackColor("info");
      setTimeout(resetFeedback, 3000);
      updateStats();
      displayStats();
    }
  }
  if(quizState.currentQuestionIndex >= quizState.questions.length -1){
    nextButton.textContent = "Done";
  }
});





openDialogButtons.forEach((button) => {
  console.log(button.dataset.cardType);
  button.addEventListener("click", () => {
    const dialog = document.querySelector(
      `[data-dialog-type="${button.dataset.cardType}"]`
    );
    dialog.showModal();
  });
});


dialogCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");
    dialog.close();
  });
});

function updateStats() {
  stats.totalCorrectAnswers += quizState.score;
  stats.totalWrongAnswers += quizState.wrongAnswers;
  stats.totalSkippedQuestions += quizState.skippedQuestions.length;
  console.log(
    stats.totalCorrectAnswers,
    stats.totalWrongAnswers,
    stats.totalSkippedQuestions
  );
  console.log(quizState.wrongAnswers);
  localStorage.setItem("stats", JSON.stringify(stats));
}

function displayStats() {
  const totalCorrectAnswers = document.querySelector("#total-correct-answers");
  const totalWrongAnswers = document.querySelector("#total-wrong-answers");
  const totalSkippedAnswers = document.querySelector("#total-skipped-answers");
  totalCorrectAnswers.textContent = stats.totalCorrectAnswers;
  totalWrongAnswers.textContent = stats.totalWrongAnswers;
  totalSkippedAnswers.textContent = stats.totalSkippedQuestions;
}

function resetStats() {
  stats.totalCorrectAnswers = 0;
  stats.totalWrongAnswers = 0;
  stats.totalSkippedQuestions = 0;
  localStorage.setItem("stats", JSON.stringify(stats));
  displayStats();
}

function resetQuizState() {
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.wrongAnswers = 0;
  quizState.skippedQuestions = [];
}


resetButton.addEventListener("click", () => {
  resetStats();
  resetQuizState();
});


retakeButton.addEventListener("click", () => {
  resetQuizState();
 setTimeout(() => {
  fetchQuestions(10, "easy", quizState.selectedCategory.id);
 }, 1000);
});

fetchQuestions(10, "easy");
