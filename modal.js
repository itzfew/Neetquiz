// Open question modal
function openQuestionModal(questionId) {
    const question = currentQuestions.find(q => q.unique_id === questionId);
    if (!question) return;
    
    // Set modal content
    modalQuestionId.textContent = `ID: ${question.unique_id}`;
    modalQuestionContent.innerHTML = `
        <p class="text-lg font-medium text-gray-800 mb-4">${question.question}</p>
        ${question.topic_name ? `<p class="text-sm text-gray-500 mb-2">Topic: ${question.topic_name}</p>` : ''}
        <div class="flex gap-2">
            <span class="text-xs bg-gray-100 px-2 py-1 rounded">Difficulty: ${question.difficulty_level}/5</span>
            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${question.quiz_type}</span>
        </div>
    `;
    
    // Set options
    if (question.quiz_type === 'mcq') {
        modalOptions.innerHTML = `
            <div onclick="selectOption(this, '${question.answer}')" class="option p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition" data-option="A">
                <span class="font-medium mr-2">A)</span> ${question.option_a}
            </div>
            <div onclick="selectOption(this, '${question.answer}')" class="option p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition" data-option="B">
                <span class="font-medium mr-2">B)</span> ${question.option_b}
            </div>
            <div onclick="selectOption(this, '${question.answer}')" class="option p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition" data-option="C">
                <span class="font-medium mr-2">C)</span> ${question.option_c}
            </div>
            <div onclick="selectOption(this, '${question.answer}')" class="option p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition" data-option="D">
                <span class="font-medium mr-2">D)</span> ${question.option_d}
            </div>
        `;
    } else {
        modalOptions.innerHTML = `
            <div class="p-4 bg-gray-50 rounded-md text-gray-600">
                <i class="fas fa-info-circle mr-2"></i> This is a subjective question. Check the answer below.
            </div>
        `;
    }
    
    // Set answer and explanation
    correctAnswer.textContent = question.answer;
    explantionText.textContent = question.explanation;
    
    // Extract reference from explanation
    const referenceMatch = question.explanation.match(/\(Reference :(.*?)\)/);
    if (referenceMatch) {
        referenceText.textContent = referenceMatch[1];
    } else {
        referenceText.textContent = 'No reference provided';
    }
    
    // Reset modal state
    modalAnswer.classList.add('hidden');
    showAnswerBtn.textContent = 'Show Answer';
    showAnswerBtn.onclick = () => showAnswer();
    
    // Show modal
    questionModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    questionModal.classList.add('hidden');
}

// Select an option
function selectOption(element, correctAnswer) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('option-correct', 'option-incorrect');
    });
    
    const selectedOption = element.getAttribute('data-option');
    const selectedText = element.textContent.trim().replace(/^[A-D]\)\s/, '');
    
    if (selectedText === correctAnswer) {
        element.classList.add('option-correct');
    } else {
        element.classList.add('option-incorrect');
        // Highlight correct answer
        document.querySelectorAll('.option').forEach(opt => {
            const optionText = opt.textContent.trim().replace(/^[A-D]\)\s/, '');
            if (optionText === correctAnswer) {
                opt.classList.add('option-correct');
            }
        });
    }
    
    // Show answer section
    modalAnswer.classList.remove('hidden');
    showAnswerBtn.textContent = 'Close';
    showAnswerBtn.onclick = closeModal;
}

// Show answer
function showAnswer() {
    modalAnswer.classList.remove('hidden');
    showAnswerBtn.textContent = 'Close';
    showAnswerBtn.onclick = closeModal;
}
