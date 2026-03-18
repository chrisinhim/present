// src/modules/media.js
import { state } from './state.js';
import { dom } from './dom.js';
import { pubsub } from './pubsub.js';

export function init() {
    dom.mediaUpload?.addEventListener('change', (e) => handleMediaUpload(e));
    dom.btnMediaPlay?.addEventListener('click', () => handleMediaPlay());
    dom.btnMediaStop?.addEventListener('click', () => handleMediaStop());
    dom.mediaLoop?.addEventListener('change', () => {
        state.media.loop = dom.mediaLoop.checked;
        syncMediaState();
    });
    dom.mediaOverlay?.addEventListener('change', () => {
        state.media.isOverlay = dom.mediaOverlay.checked;
        syncMediaState();
    });
    dom.mediaVolume?.addEventListener('input', () => {
        state.media.volume = dom.mediaVolume.value;
        syncMediaState();
    });
    pubsub.subscribe('app-init', () => renderMediaList());
}

function handleMediaUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            state.media.assets.push({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type.startsWith('image') ? 'image' : 'video',
                data: ev.target.result
            });
            renderMediaList();
        };
        reader.readAsDataURL(file);
    });
    e.target.value = '';
}

function renderMediaList() {
    if (!dom.mediaList) return;
    const assets = state.media.assets;
    if (assets.length === 0) {
        dom.mediaList.innerHTML = '<div class="empty-state">No media loaded.</div>';
        return;
    }
    dom.mediaList.innerHTML = '';
    assets.forEach(a => {
        const item = document.createElement('div');
        item.className = 'media-item';
        if (state.media.activeAsset?.id === a.id) item.classList.add('active');
        item.innerHTML = `
            ${a.type === 'image' ? `<img src="${a.data}" class="media-thumb">` : `<video src="${a.data}" class="media-thumb"></video>`}
            <div class="media-info">${a.name}</div>
            <div class="media-actions">
                <button class="delete-btn"><span class="material-symbols-outlined">delete</span></button>
            </div>`;
        item.querySelector('.delete-btn').onclick = (e) => {
            e.stopPropagation();
            state.media.assets = state.media.assets.filter(x => x.id !== a.id);
            if (state.media.activeAsset?.id === a.id) handleMediaStop();
            renderMediaList();
        };
        item.onclick = () => handleMediaSelect(a);
        dom.mediaList.appendChild(item);
    });
}

function handleMediaSelect(asset) {
    const m = state.media;
    if (m.activeAsset?.id === asset.id) {
        handleMediaPlay();
    } else {
        m.activeAsset = asset;
        m.isPaused = false;
        dom.activeMediaName.textContent = asset.name;
        dom.btnMediaPlay.querySelector('.material-symbols-outlined').textContent = 'pause';
        renderMediaList();
        syncMediaState();
        if (!m.isOverlay) {
            state.formatting.bgType = asset.type;
            state.formatting.bgFile = asset.data;
            pubsub.publish('formatting-updated', state.formatting);
        }
    }
}

function handleMediaPlay() {
    const m = state.media;
    if (!m.activeAsset) return;
    m.isPaused = !m.isPaused;
    dom.btnMediaPlay.querySelector('.material-symbols-outlined').textContent = m.isPaused ? 'play_arrow' : 'pause';
    syncMediaState();
}

function handleMediaStop() {
    const m = state.media;
    m.activeAsset = null;
    m.isPaused = true;
    dom.activeMediaName.textContent = 'No active media';
    dom.btnMediaPlay.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
    renderMediaList();
    syncMediaState();
    state.formatting.bgFile = null;
    pubsub.publish('formatting-updated', state.formatting);
}

function syncMediaState() {
    pubsub.publish('sync-media-state', {
        activeAsset: state.media.activeAsset,
        isPaused: state.media.isPaused,
        loop: state.media.loop,
        isOverlay: state.media.isOverlay,
        volume: state.media.volume
    });
}
