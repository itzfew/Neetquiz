// script.js
const DATA_URLS = {
    biology: 'https://itzfew.github.io/NEET-Questions/data/biology.json',
    physics: 'https://itzfew.github.io/NEET-Questions/data/physics.json',
    chemistry: 'https://itzfew.github.io/NEET-Questions/data/chemistry.json'
};

async function fetchQuestions(subject) {
    try {
        const response = await fetch(DATA_URLS[subject]);
        return await response.json();
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}

async function loadChapters(subject) {
    const questions = await fetchQuestions(subject);
    const chapters = [...new Set(questions.map(q => q['Chapter Name']))];
    const chapterList = document.getElementById('chapter-list');
    chapterList.innerHTML = '';
    chapters.forEach(chapter => {
        const slug = chapter.toLowerCase().replace(/ /g, '-');
        const card = document.createElement('a');
        card.href = `chapter.html?subject=${subject}&chapter=${slug}`;
        card.className = 'bg-white p-4 rounded-lg shadow-md hover:bg-gray-200';
        card.textContent = chapter;
        chapterList.appendChild(card);
    });
}

async function loadPages(subject) {
    const questions = await fetchQuestions(subject);
    const pages = [...new Set(questions.map(q => q.ncert22_page))];
    const pageList = document.getElementById('page-list');
    pageList.innerHTML = '';
    pages.forEach(page => {
        const [book, pageNum] = page.split('-');
        const card = document.createElement('a');
        card.href = `page.html?subject=${subject}&book=${book}&page=${pageNum}`;
        card.className = 'bg-white p-4 rounded-lg shadow-md hover:bg-gray-200';
        card.textContent = `NCERT ${book} Page ${pageNum}`;
        pageList.appendChild(card);
    });
}

async function loadTopics(subject, chapter) {
    const questions = await fetchQuestions(subject);
    const topics = [...new Set(questions
        .filter(q => q['Chapter Name'].toLowerCase().replace(/ /g, '-') === chapter)
        .map(q => q.topic_name))];
    const topicList = document.getElementById('topic-list');
    topicList.innerHTML = '';
    topics.forEach(topic => {
        const slug = topic.toLowerCase().replace(/ >> /g, '/').replace(/ /g, '-');
        const card = document.createElement('a');
        card.href = `topic.html?subject=${subject}&chapter=${chapter}&topic=${slug}`;
        card.className = 'bg-white p-4 rounded-lg shadow-md hover:bg-gray-200';
        card.textContent = topic.replace(/ >> /g, ' > ');
        topicList.appendChild(card);
    });
}

async function loadQuestions(subject, topic) {
    const questions = await fetchQuestions(subject);
    const topicSlug = topic.replace(/\//g, ' >> ').replace(/-/g, ' ');
    const filteredQuestions = questions.filter(q => q.topic_name.toLowerCase() === topicSlug.toLowerCase());
    renderQuestions(filteredQuestions);
}

async function loadQuestionsByPage(subject, book, page) {
    const questions = await fetchQuestions(subject);
    const filteredQuestions = questions.filter(q => q.ncert22_page === `${book}-${page}`);
    renderQuestions(filteredQuestions);
}

function renderQuestions(questions) {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';
    questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <p class="font-semibold">${q.question}</p>
            <div class="options space-y-2 mt-2">
                <div class="option" data-answer="${q.option_a === q.answer}">${q.option_a}</div>
                <div class="option" data-answer="${q.option_b === q.answer}">${q.option_b}</div>
                <div class="option" data-answer="${q.option_c === q.answer}">${q.option_c}</div>
                <div class="option" data-answer="${q.option_d === q.answer}">${q.option_d}</div>
            </div>
            <p class="explanation">${q.explanation}</p>
            <button class="show-answer bg-blue-500 text-white px-2 py-1 rounded mt-2">Show Answer</button>
        `;
        questionList.appendChild(card);
    });

    document.querySelectorAll('.show-answer').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.question-card');
            const options = card.querySelectorAll('.option');
            const explanation = card.querySelector('.explanation');
            options.forEach(opt => {
                if (opt.dataset.answer === 'true') {
                    opt.classList.add('correct');
                } else {
                    opt.classList.add('incorrect');
                }
            });
            explanation.classList.add('show');
            button.style.display = 'none';
        });
    });
}
