// src/modules/history.js
import { state } from './state.js';
import { dom } from './dom.js';
import { pubsub } from './pubsub.js';

export function init() {
    dom.btnClearHistory?.addEventListener('click', () => clearHistory());
    dom.historyList?.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const item = btn.closest('.history-item');
        const id = item.dataset.id;
        if (btn.classList.contains('present-btn')) presentHistoryItem(id);
        else if (btn.classList.contains('stage-btn')) stageHistoryItem(id);
        else if (btn.classList.contains('pin-btn')) togglePinHistoryItem(id);
        else if (btn.classList.contains('delete-btn')) deleteHistoryItem(id);
    });

    pubsub.subscribe('department-changed', () => renderHistory());
    pubsub.subscribe('app-init', () => {
        loadHistoryData();
        renderHistory();
    });
    pubsub.subscribe('add-to-history', (text) => saveToHistory(text));
}

function saveToHistory(text) {
    const activeHistory = state.history[state.activeDept];
    if (!text || text.trim() === "" || (activeHistory.length > 0 && activeHistory[0].text === text)) return;

    activeHistory.unshift({ id: Date.now().toString(), text, pinned: false, timestamp: new Date().toISOString() });
    if (activeHistory.length > 100) {
        const idx = [...activeHistory].reverse().findIndex(i => !i.pinned);
        if (idx !== -1) activeHistory.splice(activeHistory.length - 1 - idx, 1);
    }
    renderHistory();
    saveHistoryData();
}

function renderHistory() {
    if (!dom.historyList) return;
    const activeHistory = state.history[state.activeDept] || [];
    if (activeHistory.length === 0) {
        dom.historyList.innerHTML = '<div class="empty-state">No recent history</div>';
        return;
    }
    dom.historyList.innerHTML = activeHistory.map(i => `<div class="history-item ${i.pinned ? 'pinned' : ''}" data-id="${i.id}"><span class="history-text">${i.text}</span><div class="history-actions"><button class="pin-btn ${i.pinned ? 'active' : ''}"><span class="material-symbols-outlined">${i.pinned ? 'keep' : 'keep_off'}</span></button><button class="stage-btn"><span class="material-symbols-outlined">edit_note</span></button><button class="present-btn"><span class="material-symbols-outlined">play_arrow</span></button><button class="delete-btn"><span class="material-symbols-outlined">delete</span></button></div></div>`).join('');
}

function deleteHistoryItem(id) {
    const activeHistory = state.history[state.activeDept];
    state.history[state.activeDept] = activeHistory.filter(i => i.id !== id);
    renderHistory();
    saveHistoryData();
}

function togglePinHistoryItem(id) {
    const activeHistory = state.history[state.activeDept];
    const item = activeHistory.find(x => x.id === id);
    if (item) {
        item.pinned = !item.pinned;
        renderHistory();
        saveHistoryData();
    }
}

function stageHistoryItem(id) {
    const activeHistory = state.history[state.activeDept];
    const item = activeHistory.find(x => x.id === id);
    if (item) {
        pubsub.publish('stage-history-item', item.text);
    }
}

function presentHistoryItem(id) {
    const activeHistory = state.history[state.activeDept];
    const item = activeHistory.find(x => x.id === id);
    if (item) {
        pubsub.publish('present-history-item', item.text);
    }
}

function clearHistory() {
    const activeHistory = state.history[state.activeDept];
    state.history[state.activeDept] = activeHistory.filter(i => i.pinned);
    renderHistory();
    saveHistoryData();
}

function saveHistoryData() {
    localStorage.setItem('presentation_history_v2', JSON.stringify(state.history));
}

function loadHistoryData() {
    const savedHistory = localStorage.getItem('presentation_history_v2');
    if (savedHistory) {
        try {
            const parsed = JSON.parse(savedHistory);
            state.history = { ...state.history, ...parsed };
        } catch (e) {
            console.error("Error loading history data", e);
            // Try to load old format
            const oldHistory = localStorage.getItem('presentation_history');
            if (oldHistory) {
                try {
                    state.history.bible = JSON.parse(oldHistory);
                } catch (e2) {
                    console.error("Error loading old history data", e2);
                }
            }
        }
    }
}
