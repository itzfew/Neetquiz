// Show a specific view
function showView(view) {
    currentView = view;
    
    // Update active tab
    document.querySelectorAll('[id^="tab-"]').forEach(tab => {
        tab.classList.remove('border-indigo-500', 'text-indigo-600');
    });
    document.getElementById(`tab-${view}`).classList.add('border-indigo-500', 'text-indigo-600');
    
    if (!currentSubject) {
        contentArea.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-book-open text-4xl mb-4"></i>
                <p>Select a subject to begin</p>
            </div>
        `;
        return;
    }
    
    switch(view) {
        case 'chapter':
            showChapterView();
            break;
        case 'page':
            showPageView();
            break;
        case 'search':
            showSearchView();
            break;
    }
}

// Show chapter view
function showChapterView() {
    // Group questions by chapter/topic
    const chapters = {};
    
    currentQuestions.forEach(question => {
        const path = question.topic_name.split(' >> ');
        let currentLevel = chapters;
        
        path.forEach((segment, index) => {
            if (!currentLevel[segment]) {
                currentLevel[segment] = {};
            }
            
            if (index === path.length - 1) {
                if (!currentLevel[segment].questions) {
                    currentLevel[segment].questions = [];
                }
                currentLevel[segment].questions.push(question);
            } else {
                currentLevel = currentLevel[segment];
            }
        });
    });
    
    // Render chapter tree
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">${capitalizeFirstLetter(currentSubject)} Chapters</h2>
            <div class="space-y-2">
                ${renderChapterTree(chapters)}
            </div>
        </div>
    `;
}

// Recursive function to render chapter tree
function renderChapterTree(chapters, level = 0) {
    let html = '';
    
    for (const chapter in chapters) {
        const hasChildren = Object.keys(chapters[chapter]).length > 0 && !chapters[chapter].questions;
        const hasQuestions = chapters[chapter].questions && chapters[chapter].questions.length > 0;
        
        html += `
            <div class="pl-${level * 4}">
                <div class="flex items-center py-2 px-3 rounded-md hover:bg-gray-50">
                    <i class="fas fa-${hasChildren || hasQuestions ? 'folder' : 'file'} text-yellow-500 mr-2"></i>
                    <span class="font-medium">${chapter}</span>
                    ${hasQuestions ? `<span class="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${chapters[chapter].questions.length} Qs</span>` : ''}
                </div>
                ${hasChildren ? renderChapterTree(chapters[chapter], level + 1) : ''}
                ${hasQuestions ? renderQuestionsList(chapters[chapter].questions) : ''}
            </div>
        `;
    }
    
    return html;
}

// Render questions list
function renderQuestionsList(questions) {
    return `
        <div class="ml-6 border-l-2 border-gray-200 pl-4 space-y-3 my-3">
            ${questions.map((question, index) => `
                <div onclick="openQuestionModal('${question.unique_id}')" class="cursor-pointer p-3 rounded-md hover:bg-gray-100 transition">
                    <div class="flex items-start">
                        <span class="text-gray-500 text-sm mr-2">${index + 1}.</span>
                        <div>
                            <p class="text-gray-800">${question.question}</p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span class="text-xs bg-gray-100 px-2 py-1 rounded">${question.difficulty_level}/5</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${question.quiz_type}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Show page view
function showPageView() {
    // Group questions by NCERT page reference
    const pages = {};
    
    currentQuestions.forEach(question => {
        const pageRef = question.ncert22_page || question.ncert23_page || 'No reference';
        if (!pages[pageRef]) {
            pages[pageRef] = [];
        }
        pages[pageRef].push(question);
    });
    
    // Convert to array and sort
    const sortedPages = Object.entries(pages).sort((a, b) => {
        const extractNumbers = (str) => {
            const match = str.match(/(\d+)-(\d+)/);
            return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
        };
        
        const aNums = extractNumbers(a[0]);
        const bNums = extractNumbers(b[0]);
        
        if (aNums[0] !== bNums[0]) return aNums[0] - bNums[0];
        return aNums[1] - bNums[1];
    });
    
    // Render page view
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">${capitalizeFirstLetter(currentSubject)} by NCERT Page</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${sortedPages.map(([page, questions]) => `
                    <div onclick="showPageQuestions('${page}')" class="cursor-pointer border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div class="flex justify-between items-center">
                            <h3 class="font-medium text-gray-800">${page || 'No reference'}</h3>
                            <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${questions.length} Qs</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show questions for a specific page
function showPageQuestions(pageRef) {
    const pageQuestions = currentQuestions.filter(q => 
        (q.ncert22_page === pageRef) || (q.ncert23_page === pageRef)
    );
    
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center mb-4">
                <button onclick="showView('page')" class="mr-2 text-indigo-600 hover:text-indigo-800">
                    <i preparation class="fas fa-arrow-left"></i>
                </button>
                <h2 class="text-xl font-semibold text-gray-800">${pageRef || 'No reference'}</h2>
            </div>
            <div class="space-y-4">
                ${pageQuestions.map((question, index) => `
                    <div onclick="openQuestionModal('${question.unique_id}')" class="cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition">
                        <div class="flex items-start">
                            <span class="text-gray-500 text-sm mr-2">${index + 1}.</span>
                            <div>
                                <p class="text-gray-800">${question.question}</p>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${question.difficulty_level}/5</span>
                                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${question.quiz_type}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Show search view
function showSearchView() {
    contentArea.innerHTML = `
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">Search ${capitalizeFirstLetter(currentSubject)} Questions</h2>
            <div class="mb-6">
                <div class="relative">
                    <input type="text" id="search-input" placeholder="Search questions..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <button onclick="performSearch()" class="absolute right-2 top-2 text-gray-500 hover:text-indigo-600">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div id="search-results" class="space-y-4">
                <div class="text-center py-12 text-gray-400">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p>Enter a search term to find questions</p>
                </div>
            </div>
        </div>
    `;
    
    // Add event listener for Enter key
    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

// Perform search
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (!searchTerm.trim()) return;
    
    const results = currentQuestions.filter(q => 
        q.question.toLowerCase().includes(searchTerm) ||
        (q.option_a && q.option_a.toLowerCase().includes(searchTerm)) ||
        (q.option_b && q.option_b.toLowerCase().includes(searchTerm)) ||
        (q.option_c && q.option_c.toLowerCase().includes(searchTerm)) ||
        (q.option_d && q.option_d.toLowerCase().includes(searchTerm)) ||
        (q.answer && q.answer.toLowerCase().includes(searchTerm)) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchTerm)) ||
        (q.topic_name && q.topic_name.toLowerCase().includes(searchTerm))
    );
    
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>No questions found for "${searchTerm}"</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = `
        <div class="mb-4">
            <p class="text-sm text-gray-600">Found ${results.length} question${results.length !== 1 ? 's' : ''}</p>
        </div>
        <div class="space-y-4">
            ${results.map((question, index) => `
                <div onclick="openQuestionModal('${question.unique_id}')" class="cursor-pointer p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div class="flex items-start">
                        <span class="text-gray-500 text-sm mr-2">${index + 1}.</span>
                        <div>
                            <p class="text-gray-800">${question.question}</p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span class="text-xs bg-gray-100 px-2 py-1 rounded">${question.difficulty_level}/5</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${question.quiz_type}</span>
                                ${question.topic_name ? `<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${question.topic_name.split(' >> ')[0]}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
