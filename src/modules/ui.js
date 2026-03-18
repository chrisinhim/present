// src/modules/ui.js
import { state } from './state.js';
import { dom } from './dom.js';
import { pubsub } from './pubsub.js';
import { handleLogin, handleLogout, saveSettings, loadSettings } from './firebase.js';

let presentationWindow = null;

export function init() {
    // Settings Modal
    dom.btnSettings?.addEventListener('click', () => openSettings());
    dom.btnCloseSettings?.addEventListener('click', () => closeSettings());
    dom.btnSaveSettings?.addEventListener('click', () => handleSaveSettings());
    window.addEventListener('click', (e) => {
        if (e.target === dom.settingsModal) closeSettings();
    });

    // Login/Logout
    dom.btnLogin?.addEventListener('click', () => handleLogin());
    dom.btnLogout?.addEventListener('click', () => handleLogout());

    // Formatting
    const formatEvents = ['input', 'change'];
    formatEvents.forEach(evt => {
        dom.formatFont?.addEventListener(evt, () => updateFormatting());
        dom.formatSize?.addEventListener(evt, () => updateFormatting());
        dom.formatColor?.addEventListener(evt, () => updateFormatting());
        dom.formatOutline?.addEventListener(evt, () => updateFormatting());
        dom.formatOutlineThickness?.addEventListener(evt, () => updateFormatting());
        dom.formatShadow?.addEventListener(evt, () => updateFormatting());
        dom.formatShadowAngle?.addEventListener(evt, () => updateFormatting());
        dom.formatShadowDistance?.addEventListener(evt, () => updateFormatting());
        dom.formatShadowBlur?.addEventListener(evt, () => updateFormatting());
        dom.formatShadowThickness?.addEventListener(evt, () => updateFormatting());
        dom.formatGlow?.addEventListener(evt, () => updateFormatting());
        dom.formatGlowThickness?.addEventListener(evt, () => updateFormatting());
    });
    ['noneColor', 'noneOutline', 'noneShadow', 'noneGlow'].forEach(key => {
        dom[key]?.addEventListener('change', () => updateFormatting());
    });

    // Background
    dom.formatBgType?.addEventListener('change', () => {
        handleBgTypeChange();
        updateFormatting();
    });
    dom.formatBgColor?.addEventListener('input', () => updateFormatting());
    dom.formatBgFile?.addEventListener('change', (e) => handleBgFileSelect(e));

    // Animation
    dom.formatEntryType?.addEventListener('change', () => updateFormatting());
    dom.formatEntryDuration?.addEventListener('input', () => updateFormatting());
    dom.formatExitType?.addEventListener('change', () => updateFormatting());
    dom.formatExitDuration?.addEventListener('input', () => updateFormatting());

    // Position
    dom.formatPosX?.addEventListener('input', () => updateFormatting());
    dom.formatPosY?.addEventListener('input', () => updateFormatting());

    // Dropdowns
    dom.optionsToggles.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const group = btn.closest('.format-group');
            const isActive = group.classList.contains('active');
            document.querySelectorAll('.format-group.dropdown').forEach(g => g.classList.remove('active'));
            if (!isActive) group.classList.add('active');
        });
    });
    window.addEventListener('click', () => {
        document.querySelectorAll('.format-group.dropdown').forEach(g => g.classList.remove('active'));
    });
    document.querySelectorAll('.dropdown-panel').forEach(panel => {
        panel.addEventListener('click', (e) => e.stopPropagation());
    });

    // Presentation Window
    dom.btnOpenDisplay?.addEventListener('click', () => togglePresentationWindow());

    // Wheel input
    [dom.formatSize, dom.formatPosX, dom.formatPosY, dom.inputBibleDuration, dom.inputFontSize].forEach(el => {
        el?.addEventListener('wheel', (e) => handleWheelInput(e), { passive: false });
    });

    pubsub.subscribe('app-init', () => {
        applySettings();
        applyFormatting();
    });
    pubsub.subscribe('settings-loaded', () => {
        applySettings();
    });
    pubsub.subscribe('preview-update', (text) => updatePreviewContent(text));
    pubsub.subscribe('present-text', ({ text, duration }) => presentText(text, duration));
    pubsub.subscribe('remove-text', () => removeText());
    pubsub.subscribe('timer-toggle', () => toggleTimer());

    pubsub.subscribe('sync-media-state', (mediaState) => {
        sendToPresentationWindow('syncMedia', mediaState);
    });

    pubsub.subscribe('hotkey-escape', () => {
        pubsub.publish('remove-text');
    });

    pubsub.subscribe('hotkey-space', () => {
        pubsub.publish('timer-toggle');
    });
    
    pubsub.subscribe('formatting-updated', () => applyFormatting());

}

function openSettings() {
    if (dom.inputTheme) dom.inputTheme.value = state.settings.theme;
    if (dom.inputFont) dom.inputFont.value = state.settings.fontFamily;
    if (dom.inputFontSize) dom.inputFontSize.value = state.settings.fontSize;
    if (dom.inputPrimaryColor) dom.inputPrimaryColor.value = state.settings.primaryColor;
    dom.settingsModal.style.display = 'flex';
}

function closeSettings() {
    dom.settingsModal.style.display = 'none';
}

async function handleSaveSettings() {
    state.settings = {
        theme: dom.inputTheme.value,
        fontFamily: dom.inputFont.value,
        fontSize: parseInt(dom.inputFontSize.value),
        primaryColor: dom.inputPrimaryColor.value
    };
    applySettings();
    await saveSettings();
    closeSettings();
}

function applySettings() {
    const root = document.documentElement;
    const s = state.settings;
    root.dataset.theme = s.theme;
    root.style.setProperty('--primary-color', s.primaryColor);
    root.style.setProperty('--font-family', s.fontFamily);
    root.style.setProperty('--display-font-size', `${s.fontSize}px`);
    switch (s.theme) {
        case 'light':
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#000000');
            root.style.setProperty('--surface-color', '#f2f2f2');
            root.style.setProperty('--border-color', '#999999');
            break;
        case 'warm':
            root.style.setProperty('--bg-color', '#1a1816');
            root.style.setProperty('--text-color', '#fef6e4');
            root.style.setProperty('--surface-color', '#25211e');
            root.style.setProperty('--border-color', '#4d413b');
            break;
        case 'cool':
            root.style.setProperty('--bg-color', '#0f172a');
            root.style.setProperty('--text-color', '#f1f5f9');
            root.style.setProperty('--surface-color', '#1e293b');
            root.style.setProperty('--border-color', '#334155');
            break;
        case 'glass':
            root.style.setProperty('--bg-color', '#0f172a');
            root.style.setProperty('--surface-color', 'rgba(255, 255, 255, 0.05)');
            root.style.setProperty('--text-color', '#fff');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.2)');
            break;
        case 'obs':
            root.style.setProperty('--bg-color', '#1c1c1c');
            root.style.setProperty('--text-color', '#e0e0e0');
            root.style.setProperty('--surface-color', '#2b2b2b');
            root.style.setProperty('--border-color', '#404040');
            break;
        default:
            root.style.setProperty('--bg-color', '#000000');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--surface-color', '#121212');
            root.style.setProperty('--border-color', '#444444');
    }
}

function updateFormatting() {
    if (!dom.formatFont) return;
    state.formatting = {
        ...state.formatting,
        fontFamily: dom.formatFont.value,
        fontSize: parseInt(dom.formatSize.value),
        color: !dom.noneColor.checked ? 'transparent' : dom.formatColor.value,
        outlineColor: !dom.noneOutline.checked ? 'transparent' : dom.formatOutline.value,
        outlineThickness: parseInt(dom.formatOutlineThickness.value),
        shadowColor: !dom.noneShadow.checked ? 'transparent' : dom.formatShadow.value,
        shadowAngle: parseInt(dom.formatShadowAngle.value),
        shadowDistance: parseInt(dom.formatShadowDistance.value),
        shadowBlur: parseInt(dom.formatShadowBlur.value),
        shadowThickness: parseInt(dom.formatShadowThickness.value),
        glowColor: !dom.noneGlow.checked ? 'transparent' : dom.formatGlow.value,
        glowThickness: parseInt(dom.formatGlowThickness.value),
        bgType: dom.formatBgType.value,
        bgColor: dom.formatBgColor.value,
        entryType: dom.formatEntryType.value,
        entryDuration: parseInt(dom.formatEntryDuration.value),
        exitType: dom.formatExitType.value,
        exitDuration: parseInt(dom.formatExitDuration.value),
        posX: parseFloat(dom.formatPosX.value),
        posY: parseFloat(dom.formatPosY.value)
    };
    applyFormatting();
}

function applyFormatting() {
    const root = dom.previewContent;
    if (!root) return;
    const f = state.formatting;
    root.style.setProperty('--preview-font-family', f.fontFamily);
    root.style.setProperty('--preview-font-color', f.color);
    root.style.setProperty('--preview-outline-color', f.outlineColor);
    root.style.setProperty('--preview-outline-size', `${f.outlineThickness}px`);
    const angleRad = (f.shadowAngle * Math.PI) / 180;
    const shadowX = Math.round(Math.cos(angleRad) * f.shadowDistance);
    const shadowY = Math.round(Math.sin(angleRad) * f.shadowDistance);
    root.style.setProperty('--preview-shadow-color', f.shadowColor);
    root.style.setProperty('--preview-shadow-offset-x', `${shadowX}px`);
    root.style.setProperty('--preview-shadow-offset-y', `${shadowY}px`);
    root.style.setProperty('--preview-shadow-blur', `${f.shadowBlur + (f.shadowThickness * 0.5)}px`);
    root.style.setProperty('--preview-glow-color', f.glowColor);
    root.style.setProperty('--preview-glow-blur', `${f.glowThickness}px`);

    if (dom.bgPreviewArea) dom.bgPreviewArea.style.backgroundColor = f.bgType === 'color' ? f.bgColor : 'transparent';
    if (dom.bgPreviewImage) dom.bgPreviewImage.style.display = 'none';
    if (dom.bgPreviewVideo) dom.bgPreviewVideo.style.display = 'none';
    if (f.bgFile) {
        if (f.bgType === 'image' && dom.bgPreviewImage) {
            dom.bgPreviewImage.src = f.bgFile;
            dom.bgPreviewImage.style.display = 'block';
        } else if (f.bgType === 'video' && dom.bgPreviewVideo) {
            dom.bgPreviewVideo.src = f.bgFile;
            dom.bgPreviewVideo.style.display = 'block';
            dom.bgPreviewVideo.play().catch(() => { });
        }
    }
    const shadowBlur = f.shadowBlur + (f.shadowThickness * 0.5);
    sendToPresentationWindow('applyStyles', {
        styles: {
            '--font-family': f.fontFamily,
            '--font-size': `${f.fontSize}px`,
            '--color': f.color,
            '--outline-color': f.outlineColor,
            '--outline-size': `${f.outlineThickness}px`,
            '--shadow-color': f.shadowColor,
            '--shadow-x': `${shadowX}px`,
            '--shadow-y': `${shadowY}px`,
            '--shadow-blur': `${shadowBlur}px`,
            '--glow-color': f.glowColor,
            '--glow-blur': `${f.glowThickness}px`,
            '--bg-color': f.bgType === 'color' ? f.bgColor : '#000',
            '--pos-x': `${f.posX}%`,
            '--pos-y': `${f.posY}%`
        },
        bgType: f.bgType, bgFile: f.bgFile
    });
}

function handleWheelInput(e) {
    e.preventDefault();
    const input = e.target;
    const step = parseFloat(input.getAttribute('step')) || 1;
    const dir = e.deltaY > 0 ? -1 : 1;
    const newVal = (parseFloat(input.value) || 0) + (dir * step);
    const min = input.min !== "" ? parseFloat(input.min) : -Infinity;
    const max = input.max !== "" ? parseFloat(input.max) : Infinity;
    if (newVal >= min && newVal <= max) {
        const prec = (step.toString().split('.')[1] || '').length;
        input.value = newVal.toFixed(prec);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function handleBgTypeChange() {
    const type = dom.formatBgType.value;
    const cg = document.getElementById('bg-input-color'),
        fg = document.getElementById('bg-input-file'),
        fl = document.getElementById('bg-file-label');
    if (cg) cg.style.display = type === 'color' ? 'block' : 'none';
    if (fg) fg.style.display = type !== 'color' ? 'block' : 'none';
    if (fl) fl.textContent = type === 'image' ? 'Select Picture' : 'Select Video';
    if (dom.formatBgFile) dom.formatBgFile.accept = type === 'image' ? 'image/*' : 'video/*';
}

function handleBgFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        state.formatting.bgFile = ev.target.result;
        updateFormatting();
    };
    reader.readAsDataURL(file);
}

async function updatePreviewContent(newText) {
    const el = dom.previewContent;
    if (!el) return;
    const f = state.formatting;
    if (f.exitType !== 'none') {
        el.className = `anim-${f.exitType}-out`;
        el.style.animationDuration = `${f.exitDuration}ms`;
        await new Promise(r => setTimeout(r, f.exitDuration));
    }
    el.textContent = newText;
    el.className = '';
    if (f.entryType !== 'none') {
        el.className = `anim-${f.entryType}-in`;
        el.style.animationDuration = `${f.entryDuration}ms`;
        await new Promise(r => setTimeout(r, f.entryDuration));
    }
    if (state.presentation.timerId) {
        sendToPresentationWindow('present', { text: newText, anim: 'none', duration: 0 });
    }
}

function presentText(text, duration) {
    const p = state.presentation;
    const f = state.formatting;
    sendToPresentationWindow('present', { text: text, anim: f.entryType, duration: f.entryDuration });
    p.currentText = text;
    p.remainingTime = duration * 1000;
    p.isPaused = false;
    p.lastTimestamp = Date.now();
    startTimer();
}

function removeText() {
    const p = state.presentation;
    const f = state.formatting;
    if (p.timerId) {
        clearInterval(p.timerId);
        p.timerId = null;
    }
    sendToPresentationWindow('remove', { anim: f.exitType, duration: f.exitDuration });
}

function startTimer() {
    const p = state.presentation;
    if (p.timerId) clearInterval(p.timerId);
    p.timerId = setInterval(() => {
        if (!p.isPaused) {
            const now = Date.now();
            p.remainingTime -= (now - p.lastTimestamp);
            p.lastTimestamp = now;
            if (p.remainingTime <= 0) {
                removeText();
            }
        }
    }, 100);
}

function toggleTimer() {
    const p = state.presentation;
    if (!p.timerId) return;
    p.isPaused = !p.isPaused;
    p.lastTimestamp = Date.now();
    // Update UI to show paused state if needed
}

function sendToPresentationWindow(command, data) {
    if (presentationWindow && !presentationWindow.closed) {
        presentationWindow.postMessage({ command, ...data }, '*');
    }
}

function togglePresentationWindow() {
    if (presentationWindow && !presentationWindow.closed) {
        presentationWindow.close();
        presentationWindow = null;
    } else {
        presentationWindow = window.open('', 'Presentation', 'width=1280,height=720');
        if (!presentationWindow) {
            alert('Please allow popups for the presentation window.');
            return;
        }
        const doc = presentationWindow.document;
        doc.write(`
            <html>
                <head>
                    <title>Active Display</title>
                    <style>
                        :root {
                            --font-family: 'Inter', sans-serif;
                            --font-size: 80px;
                            --color: #ffffff;
                            --outline-color: transparent;
                            --outline-size: 0px;
                            --shadow-color: transparent;
                            --shadow-x: 0px;
                            --shadow-y: 0px;
                            --shadow-blur: 0px;
                            --glow-color: transparent;
                            --glow-blur: 0px;
                            --bg-color: #000000;
                            --pos-x: 50%;
                            --pos-y: 50%;
                        }
                        body { margin: 0; background-color: var(--bg-color); color: var(--color); height: 100vh; font-family: var(--font-family); overflow: hidden; position: relative; }
                        #container { position: absolute; left: var(--pos-x); top: calc(100% - var(--pos-y)); transform: translate(calc(-1 * var(--pos-x)), calc(-1 * (100% - var(--pos-y)))); display: flex; align-items: center; justify-content: center; width: max-content; max-width: 90%; z-index: 10; }
                        #display { font-size: var(--font-size); text-align: center; line-height: 1.2; font-weight: bold; -webkit-text-stroke: var(--outline-size) var(--outline-color); text-shadow: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-color), 0 0 var(--glow-blur) var(--glow-color); opacity: 0; }
                        .bg-layer { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1; object-fit: cover; display: none; pointer-events: none; }
                        #display.anim-none-in { opacity: 1; }
                        #display.anim-none-out { opacity: 0; }
                        #display.anim-fade-in { animation: fadeIn 1s forwards; }
                        #display.anim-fade-out { animation: fadeOut 1s forwards; }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
                        .overlay-layer { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 80%; max-height: 80%; z-index: 5; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 2px solid rgba(255,255,255,0.1); }
                    </style>
                </head>
                <body>
                    <img id="bg-image" class="bg-layer">
                    <video id="bg-video" class="bg-layer" loop muted></video>
                    <div id="container"><div id="display"></div></div>
                    <script>
                        const el = document.getElementById('display');
                        const bgImg = document.getElementById('bg-image');
                        const bgVid = document.getElementById('bg-video');
                        window.onmessage = function(e) {
                            const { command, text, styles, anim, duration, bgType, bgFile, activeAsset, isPaused, loop, isOverlay, volume } = e.data;
                            if (command === 'applyStyles') {
                                if (styles) Object.keys(styles).forEach(k => document.documentElement.style.setProperty(k, styles[k]));
                                bgImg.style.display = 'none'; bgVid.style.display = 'none';
                                if (bgType === 'image' && bgFile) { bgImg.src = bgFile; bgImg.style.display = 'block'; }
                                else if (bgType === 'video' && bgFile) { bgVid.src = bgFile; bgVid.style.display = 'block'; bgVid.play().catch(()=>{}); }
                            } else if (command === 'present') { el.textContent = text; el.className = 'anim-' + anim + '-in'; el.style.animationDuration = duration + 'ms'; }
                            else if (command === 'remove') { el.className = 'anim-' + anim + '-out'; el.style.animationDuration = duration + 'ms'; setTimeout(() => { if(el.className.includes('-out')) el.textContent = ''; }, duration); }
                            else if (command === 'syncMedia') {
                                let oImg = document.getElementById('overlay-image'), oVid = document.getElementById('overlay-video');
                                if (!oImg) { oImg = document.createElement('img'); oImg.id = 'overlay-image'; oImg.className = 'overlay-layer'; document.body.appendChild(oImg); }
                                if (!oVid) { oVid = document.createElement('video'); oVid.id = 'overlay-video'; oVid.className = 'overlay-layer'; document.body.appendChild(oVid); }
                                oImg.style.display = 'none'; oVid.style.display = 'none';
                                if (!isOverlay) { bgImg.style.display = 'none'; bgVid.style.display = 'none'; }
                                if (activeAsset) {
                                    const tImg = isOverlay ? oImg : bgImg, tVid = isOverlay ? oVid : bgVid;
                                    if (activeAsset.type === 'image') { tImg.src = activeAsset.data; tImg.style.display = 'block'; }
                                    else { if (tVid.src !== activeAsset.data) tVid.src = activeAsset.data; tVid.style.display = 'block'; tVid.loop = loop; tVid.volume = volume / 100; if (isPaused) tVid.pause(); else tVid.play().catch(()=>{}); }
                                }
                            }
                        };
                    </script>
                </body>
            </html>
        `);
        doc.close();
        setTimeout(() => applyFormatting(), 500);
    }
}
