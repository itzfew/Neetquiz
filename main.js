  // Global variables
let currentSubject = null;
let currentQuestions = [];
let currentView = null;

// DOM elements
const contentArea = document.getElementById('content-area');
const questionModal = document.getElementById('question-modal');
const modalQuestionContent = document.getElementById('modal-question-content');
const modalOptions = document.getElementById('modal-options');
const modalAnswer = document.getElementById('modal-answer');
const correctAnswer = document.getElementById('correct-answer');
const explantionText = document.getElementById('explanation-text');
const referenceText = document.getElementById('reference-text');
const showAnswerBtn = document.getElementById('show-answer-btn');
const modalQuestionId = document.getElementById('modal-question-id');

// Close modal when clicking outside
questionModal.addEventListener('click', function(e) {
    if (e.target === questionModal) {
        closeModal();
    }
});
