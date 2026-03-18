// src/modules/dom.js
export const dom = {
    previewContent: null,
    departmentTabs: null,
    departmentPanels: null,
    btnLogin: null,
    btnLogout: null,
    btnSettings: null,
    settingsModal: null,
    btnCloseSettings: null,
    btnSaveSettings: null,
    inputTheme: null,
    inputFont: null,
    inputFontSize: null,
    inputPrimaryColor: null,
    formatFont: null,
    formatSize: null,
    formatColor: null,
    formatOutline: null,
    formatOutlineThickness: null,
    formatShadow: null,
    formatShadowAngle: null,
    formatShadowDistance: null,
    formatShadowBlur: null,
    formatShadowThickness: null,
    formatGlow: null,
    formatGlowThickness: null,
    optionsToggles: null,
    bgPreviewArea: null,
    bgPreviewImage: null,
    bgPreviewVideo: null,
    formatBgType: null,
    formatBgColor: null,
    formatBgFile: null,
    formatEntryType: null,
    formatEntryDuration: null,
    formatExitType: null,
    formatExitDuration: null,
    formatPosX: null,
    formatPosY: null,
    bibleBooksGrid: null,
    bibleChaptersGrid: null,
    bibleVersesGrid: null,
    bibleSelectionDisplay: null,
    bibleText: null,
    btnPresentBible: null,
    btnRemoveBible: null,
    inputBibleDuration: null,
    btnOpenDisplay: null,
    historyList: null,
    btnClearHistory: null,
    mediaUpload: null,
    mediaList: null,
    activeMediaName: null,
    btnMediaPlay: null,
    btnMediaStop: null,
    mediaLoop: null,
    mediaOverlay: null,
    mediaVolume: null,

    cacheDom() {
        this.previewContent = document.getElementById('preview-content');
        this.departmentTabs = document.querySelectorAll('.department-btn');
        this.departmentPanels = document.querySelectorAll('.dept-panel');
        this.btnLogin = document.getElementById('btn-login');
        this.btnLogout = document.getElementById('btn-logout');
        this.btnSettings = document.getElementById('btn-settings');
        this.settingsModal = document.getElementById('settings-modal');
        this.btnCloseSettings = document.getElementById('close-settings');
        this.btnSaveSettings = document.getElementById('save-settings-btn');
        this.inputTheme = document.getElementById('setting-theme');
        this.inputFont = document.getElementById('setting-font');
        this.inputFontSize = document.getElementById('setting-font-size');
        this.inputPrimaryColor = document.getElementById('setting-primary-color');
        this.formatFont = document.getElementById('font-family');
        this.formatSize = document.getElementById('font-size');
        this.formatColor = document.getElementById('font-color');
        this.formatOutline = document.getElementById('outline-color');
        this.formatOutlineThickness = document.getElementById('outline-thickness');
        this.formatShadow = document.getElementById('shadow-color');
        this.formatShadowAngle = document.getElementById('shadow-angle');
        this.formatShadowDistance = document.getElementById('shadow-distance');
        this.formatShadowBlur = document.getElementById('shadow-blur');
        this.formatShadowThickness = document.getElementById('shadow-thickness');
        this.formatGlow = document.getElementById('glow-color');
        this.formatGlowThickness = document.getElementById('glow-thickness');
        this.optionsToggles = document.querySelectorAll('.options-toggle');
        this.noneColor = document.getElementById('font-color-none');
        this.noneOutline = document.getElementById('outline-none');
        this.noneShadow = document.getElementById('shadow-none');
        this.noneGlow = document.getElementById('glow-none');
        this.bgPreviewArea = document.getElementById('preview-area');
        this.bgPreviewImage = document.getElementById('preview-bg-image');
        this.bgPreviewVideo = document.getElementById('preview-bg-video');
        this.formatBgType = document.getElementById('bg-type');
        this.formatBgColor = document.getElementById('bg-color-picker');
        this.formatBgFile = document.getElementById('bg-file-input');
        this.formatEntryType = document.getElementById('entry-animation');
        this.formatEntryDuration = document.getElementById('entry-duration');
        this.formatExitType = document.getElementById('exit-animation');
        this.formatExitDuration = document.getElementById('exit-duration');
        this.formatPosX = document.getElementById('pos-x');
        this.formatPosY = document.getElementById('pos-y');
        this.bibleBooksGrid = document.getElementById('bible-books-grid');
        this.bibleChaptersGrid = document.getElementById('bible-chapters-grid');
        this.bibleVersesGrid = document.getElementById('bible-verses-grid');
        this.bibleSelectionDisplay = document.getElementById('bible-selection-display');
        this.bibleText = document.getElementById('bible-text');
        this.btnPresentBible = document.getElementById('btn-present-bible');
        this.btnRemoveBible = document.getElementById('btn-remove-bible');
        this.inputBibleDuration = document.getElementById('bible-duration');
        this.btnOpenDisplay = document.getElementById('btn-open-display');
        this.historyList = document.getElementById('history-list');
        this.btnClearHistory = document.getElementById('btn-clear-history');
        this.mediaUpload = document.getElementById('media-upload');
        this.mediaList = document.getElementById('media-list');
        this.activeMediaName = document.getElementById('active-media-name');
        this.btnMediaPlay = document.getElementById('btn-media-play');
        this.btnMediaStop = document.getElementById('btn-media-stop');
        this.mediaLoop = document.getElementById('media-loop');
        this.mediaOverlay = document.getElementById('media-overlay');
        this.mediaVolume = document.getElementById('media-volume');
    }
};
