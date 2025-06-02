// Subject URLs
const subjectUrls = {
    biology: 'https://itzfew.github.io/NEET-Questions/data/biology.json',
    chemistry: 'https://itzfew.github.io/NEET-Questions/data/chemistry.json',
    physics: 'https://itzfew.github.io/NEET-Questions/data/physics.json'
};

// Load a subject
async function loadSubject(subject) {
    // Update UI
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.classList.remove('active-subject');
    });
    event.target.classList.add('active-subject');
    
    currentSubject = subject;
    
    // Show loading state
    contentArea.innerHTML = `
        <div class="text-center py-12">
            <i class="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
            <p>Loading ${subject} questions...</p>
        </div>
    `;

    try {
        // Fetch questions
        const response = await fetch(subjectUrls[subject]);
        currentQuestions = await response.json();
        
        // Show chapter view by default
        showView('chapter');
    } catch (error) {
        console.error('Error loading questions:', error);
        contentArea.innerHTML = `
            <div class="text-center py-12 text-red-500">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>Failed to load questions. Please try again.</p>
            </div>
        `;
    }
}
