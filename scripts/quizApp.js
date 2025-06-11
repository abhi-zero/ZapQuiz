import { animateText } from "./animations.js";

const quizState = {
  selectedCategory: "Vehicles",
  currentQuestionIndex: 0,
  score: 0,
  wrongAnswers: 0,
  questions: [],
  skippedQuestions: [],
};

async function fetchQuestions(category, level = "easy") {
  const url = `https://opentdb.com/api.php?amount=15&category=${category}&difficulty=${level}&type=multiple`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.response_code !== 0) {
        if(data.response_code === 1){
            throw new Error("We couldn't find questions for the selected category. Please choose another category or try again later.");
        }else{
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

function shuffleAnswers(answers) {
  return answers.sort(() => Math.random() - 0.5);
}

function processQuestions(questions) {
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

function handleAnswerClick(e) {
  const question = quizState.questions[quizState.currentQuestionIndex];
  const button = e.target;
  const selectedOption = e.target.dataset.option;
  const answerButtons = document.querySelectorAll(".quiz-option-button");
  const correctAnswers = document.querySelector(".correct-answers-count");
  const wrongAnswers = document.querySelector(".wrong-answers-count");

  if (selectedOption === question.correctAnswer) {
    quizState.score++;
    correctAnswers.textContent = quizState.score;
    console.log("right answer");
    button.classList.add("correct-answer");
    // answerButtons.forEach(button =>{
    //     if(button.dataset.option !== question.correctAnswer){
    //         button.classList.add("wrong-answer");
    //     }
    // })
    showFeedback(
      "Correct Answer",
      `You answered ${selectedOption} question correctly`
    );
    displayFeedbackColor("success");
    setTimeout(resetFeedback, 5000);
  } else {
    console.log("wrong answer");
    quizState.wrongAnswers++;
    wrongAnswers.textContent = quizState.wrongAnswers;
    console.log(wrongAnswers.textContent);
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

function breakText(textString){

    let splittedText = textString.split(" ");

    let halfValue = Math.floor(splittedText.length / 2);

    let clutter = "";

    splittedText.forEach((word,idx) => {
        if(idx < halfValue){
            clutter += `<span class="first-word">${word}</span> `;
        }else{
            clutter += `<span class="last-word">${word}</span> `;
        }
    })
    return clutter;
}

function renderQuestion() {
  const question = quizState.questions[quizState.currentQuestionIndex];
  const quizElement = document.getElementById("quiz");
  const answerButtons = document.querySelectorAll(".quiz-option-button");
  const categoryName = document.querySelector(".quiz-category-name");
  const questionNumber = document.querySelector(".question-number-count");
  const totalQuestions = document.querySelectorAll(".total-questions");

  quizElement.innerHTML = breakText(question.question);
  answerButtons.forEach((button, idx) => {
    button.textContent = question.answers[idx];
    button.dataset.option = question.answers[idx];
    button.classList.remove("correct-answer", "wrong-answer");
    button.disabled = false;
    button.removeEventListener("click", handleAnswerClick);
    button.addEventListener("click", handleAnswerClick);
  });

  categoryName.textContent = quizState.selectedCategory;
  totalQuestions.forEach((total) => {
    total.textContent = quizState.questions.length;
  });
  questionNumber.textContent = quizState.currentQuestionIndex + 1;

  if (quizState.currentQuestionIndex >= quizState.questions.length) {
    showFeedback("Quiz Completed", "You have completed all the questions!");
    displayFeedbackColor("info");
    return;
  }
}

function resetFeedback() {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.innerHTML = "";
}

function checkQuizCompletion() {
  if (quizState.currentQuestionIndex >= quizState.questions.length) {
    console.log("Quiz completed");
    return true;
  }
  return false;
}

const skipButton = document.querySelector(".skip-button");
const nextButton = document.querySelector(".next-button");
skipButton.addEventListener("click", () => {
  if (!checkQuizCompletion()) {
    quizState.skippedQuestions.push(quizState.currentQuestionIndex);
    quizState.currentQuestionIndex++;
    renderQuestion();
    animateText();
  } else {
    showFeedback(
      "Skipped :",
      `You skipped ${quizState.skippedQuestions.length} questions`
    );
    displayFeedbackColor("info");
    setTimeout(resetFeedback, 3000);
  }
});

nextButton.addEventListener("click", () => {
  if (!checkQuizCompletion()) {
    quizState.currentQuestionIndex++;
    renderQuestion();
    animateText();
  } else {
    showFeedback("Quiz Completed", "You have completed the quiz");
    displayFeedbackColor("info");
    setTimeout(resetFeedback, 3000);
  }
});

fetchQuestions(28, "easy");
