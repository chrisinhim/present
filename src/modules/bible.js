// src/modules/bible.js
import { state } from './state.js';
import { dom } from './dom.js';
import { pubsub } from './pubsub.js';

export function init() {
    dom.bibleBooksGrid?.addEventListener('wheel', (e) => handleGridScroll(e, dom.bibleBooksGrid));
    dom.bibleChaptersGrid?.addEventListener('wheel', (e) => handleGridScroll(e, dom.bibleChaptersGrid));
    dom.bibleVersesGrid?.addEventListener('wheel', (e) => handleGridScroll(e, dom.bibleVersesGrid));

    dom.bibleVersesGrid?.addEventListener('mousedown', (e) => handleVerseDragStart(e));
    window.addEventListener('mousemove', (e) => handleVerseDragMove(e));
    window.addEventListener('mouseup', () => handleVerseDragEnd());

    dom.bibleText?.addEventListener('input', (e) => handleBibleAutocomplete(e));
    dom.bibleText?.addEventListener('keydown', (e) => handleBibleHotkey(e));
    dom.btnPresentBible?.addEventListener('click', () => handlePresentBible());
    dom.btnRemoveBible?.addEventListener('click', () => handleRemoveBible());

    pubsub.subscribe('app-init', () => renderBooksGrid());
    pubsub.subscribe('stage-history-item', (text) => {
        if (state.activeDept === 'bible') {
            dom.bibleText.value = text;
            pubsub.publish('preview-update', text);
        }
    });
    pubsub.subscribe('present-history-item', (text) => {
        if (state.activeDept === 'bible') {
            dom.bibleText.value = text;
            handlePresentBible();
        }
    });
}

function handleGridScroll(e, container) {
    if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
    }
}

function renderBooksGrid() {
    if (!dom.bibleBooksGrid) return;
    dom.bibleBooksGrid.innerHTML = '';
    state.bible.books.forEach(book => {
        const btn = document.createElement('button');
        btn.className = 'book-btn';
        btn.textContent = book.code;
        btn.title = book.name;
        btn.onclick = () => handleBookSelect(book);
        dom.bibleBooksGrid.appendChild(btn);
    });
}

function handleBookSelect(book) {
    state.bible.selectedBook = book;
    state.bible.selectedChapter = null;
    state.bible.selectedVerses = [];
    if (dom.bibleText) dom.bibleText.value = '';
    dom.bibleBooksGrid.querySelectorAll('.book-btn').forEach(b => b.classList.toggle('active', b.textContent === book.code));
    renderChaptersGrid(book.chapters);
    updateBibleUI();
}

function renderChaptersGrid(count) {
    if (!dom.bibleChaptersGrid) return;
    dom.bibleChaptersGrid.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const btn = document.createElement('button');
        btn.className = 'chapter-btn';
        btn.textContent = i;
        btn.onclick = () => handleChapterSelect(i);
        dom.bibleChaptersGrid.appendChild(btn);
    }
}

function handleChapterSelect(chapter) {
    state.bible.selectedChapter = chapter;
    state.bible.selectedVerses = [];
    if (dom.bibleText) dom.bibleText.value = '';
    dom.bibleChaptersGrid.querySelectorAll('.chapter-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === chapter));
    renderVersesGrid(30); // Assuming max 30 verses for simplicity, this should be dynamic in a real app
    updateBibleUI();
}

function renderVersesGrid(count) {
    if (!dom.bibleVersesGrid) return;
    dom.bibleVersesGrid.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const btn = document.createElement('button');
        btn.className = 'verse-btn';
        btn.textContent = i;
        btn.onclick = (e) => handleVerseSelect(i, e.shiftKey);
        dom.bibleVersesGrid.appendChild(btn);
    }
}

function handleVerseSelect(verse, isShift) {
    if (state.bible.hasMoved) {
        state.bible.hasMoved = false;
        return;
    }
    let verses = [...state.bible.selectedVerses];
    if (dom.bibleText) dom.bibleText.value = '';
    if (isShift && verses.length > 0) {
        const min = Math.min(verses[0], verse), max = Math.max(verses[0], verse);
        verses = [];
        for (let i = min; i <= max; i++) verses.push(i);
    } else {
        const idx = verses.indexOf(verse);
        if (idx > -1) verses.splice(idx, 1);
        else verses.push(verse);
    }
    state.bible.selectedVerses = verses.sort((a, b) => a - b);
    updateBibleUI();
}

function updateBibleUI() {
    const b = state.bible;
    const text = dom.bibleText?.value || getBibleReferenceString() || 'Preview Area';
    pubsub.publish('preview-update', text);
    const hasContent = (dom.bibleText?.value) || (b.selectedBook && b.selectedChapter);
    if (dom.btnPresentBible) dom.btnPresentBible.disabled = !hasContent;
    if (dom.bibleVersesGrid) {
        const verses = b.selectedVerses;
        dom.bibleVersesGrid.querySelectorAll('.verse-btn').forEach(btn => {
            const v = parseInt(btn.textContent);
            btn.classList.toggle('active', verses.includes(v));
            if (verses.length > 1) {
                const min = Math.min(...verses), max = Math.max(...verses);
                btn.classList.toggle('in-range', v > min && v < max);
            } else {
                btn.classList.remove('in-range');
            }
        });
    }
}

function getBibleReferenceString() {
    const b = state.bible;
    if (!b.selectedBook) return '';
    let s = b.selectedBook.name;
    if (b.selectedChapter) {
        s += ` ${b.selectedChapter}`;
        if (b.selectedVerses.length > 0) {
            const min = Math.min(...b.selectedVerses), max = Math.max(...b.selectedVerses);
            s += min === max ? `:${min}` : `:${min}-${max}`;
        }
    }
    return s;
}

function handleVerseDragStart(e) {
    const btn = e.target.closest('.verse-btn');
    if (!btn) return;
    state.bible.isDragging = true;
    state.bible.hasMoved = false;
    state.bible.dragStartVerse = parseInt(btn.textContent);
}

function handleVerseDragMove(e) {
    if (!state.bible.isDragging) return;
    const t = document.elementFromPoint(e.clientX, e.clientY);
    if (!t || !t.classList.contains('verse-btn')) return;
    const cur = parseInt(t.textContent), start = state.bible.dragStartVerse;
    if (cur !== start) state.bible.hasMoved = true;
    const min = Math.min(start, cur), max = Math.max(start, cur);
    const vs = [];
    for (let i = min; i <= max; i++) vs.push(i);
    state.bible.selectedVerses = vs;
    updateBibleUI();
}

function handleVerseDragEnd() {
    state.bible.isDragging = false;
}

function handleBibleAutocomplete(e) {
    const text = e.target.value;
    if (text.length > 0) {
        state.bible.selectedBook = null;
        state.bible.selectedChapter = null;
        state.bible.selectedVerses = [];
        
        const suggestions = state.bible.books.filter(book => 
            book.name.toLowerCase().includes(text.toLowerCase()) || 
            book.code.toLowerCase().includes(text.toLowerCase())
        );
        renderSuggestions(suggestions);
    } else {
        dom.bibleSuggestions.style.display = 'none';
    }
    updateBibleUI();
}

function renderSuggestions(suggestions) {
    if (!dom.bibleSuggestions) return;
    dom.bibleSuggestions.innerHTML = '';
    if (suggestions.length > 0) {
        suggestions.forEach((book, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-suggestion';
            div.textContent = book.name;
            div.onclick = () => selectSuggestion(book);
            dom.bibleSuggestions.appendChild(div);
        });
        dom.bibleSuggestions.style.display = 'block';
    } else {
        dom.bibleSuggestions.style.display = 'none';
    }
}

function selectSuggestion(book) {
    dom.bibleText.value = book.name + ' ';
    dom.bibleSuggestions.style.display = 'none';
    dom.bibleText.focus();
    updateBibleUI();
}

function handleBibleHotkey(e) {
    const suggestions = dom.bibleSuggestions.querySelectorAll('.autocomplete-suggestion');
    const selected = dom.bibleSuggestions.querySelector('.autocomplete-suggestion.selected');
    let selectedIndex = Array.from(suggestions).indexOf(selected);

    if (e.key === 'ArrowDown' && dom.bibleSuggestions.style.display === 'block') {
        e.preventDefault();
        moveSuggestionSelection(1);
    } else if (e.key === 'ArrowUp' && dom.bibleSuggestions.style.display === 'block') {
        e.preventDefault();
        moveSuggestionSelection(-1);
    } else if ((e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') && dom.bibleSuggestions.style.display === 'block') {
        if (selected) {
            e.preventDefault();
            selectSuggestion(state.bible.books.find(b => b.name === selected.textContent));
        } else if (e.key === 'Tab' || e.key === ' ') {
            e.preventDefault();
            if (suggestions.length > 0) {
                selectSuggestion(state.bible.books.find(b => b.name === suggestions[0].textContent));
            }
        }
    } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handlePresentBible();
    }
}

function moveSuggestionSelection(direction) {
    const suggestions = dom.bibleSuggestions.querySelectorAll('.autocomplete-suggestion');
    if (suggestions.length === 0) return;
    let selected = dom.bibleSuggestions.querySelector('.autocomplete-suggestion.selected');
    let index = Array.from(suggestions).indexOf(selected);
    
    if (selected) selected.classList.remove('selected');
    
    index += direction;
    if (index >= suggestions.length) index = 0;
    if (index < 0) index = suggestions.length - 1;
    
    suggestions[index].classList.add('selected');
    suggestions[index].scrollIntoView({ block: 'nearest' });
}

function handlePresentBible() {
    const p = state.presentation;
    const text = dom.bibleText.value.trim() || getBibleReferenceString();
    if (!text) {
        alert("Please enter some text to show on the screen");
        return;
    }
    if (p.timerId && p.currentText === text) {
        pubsub.publish('timer-toggle');
        return;
    }
    const dur = parseInt(dom.inputBibleDuration.value) || 5;
    dom.btnPresentBible.textContent = 'Pause';
    pubsub.publish('present-text', { text, duration: dur });
    pubsub.publish('add-to-history', text);
    dom.bibleSuggestions.style.display = 'none';
}

function handleRemoveBible() {
    pubsub.publish('remove-text');
    dom.btnPresentBible.textContent = 'Present';
}
