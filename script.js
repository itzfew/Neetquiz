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
    const topics
