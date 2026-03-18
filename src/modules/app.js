// src/modules/app.js
import { state } from './state.js';
import { dom } from './dom.js';
import { pubsub } from './pubsub.js';
import { init as initUI } from './ui.js';
import { init as initBible } from './bible.js';
import { init as initMedia } from './media.js';
import { init as initHistory } from './history.js';
import { setupAuthListener } from './firebase.js';

export const app = {
    init() {
        dom.cacheDom();
        this.bindEvents();
        setupAuthListener();
        initUI();
        initBible();
        initMedia();
        initHistory();
        pubsub.publish('app-init', null);
    },

    bindEvents() {
        dom.departmentTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchDepartment(tab.dataset.dept));
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                pubsub.publish('hotkey-escape', null);
            } else if (e.key === ' ' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                pubsub.publish('hotkey-space', null);
            }
        });
    },

    switchDepartment(id, save = true) {
        state.activeDept = id;
        dom.departmentTabs.forEach(t => t.classList.toggle('active', t.dataset.dept === id));
        dom.departmentPanels.forEach(p => p.classList.toggle('active', p.dataset.dept === id));
        pubsub.publish('department-changed', id);
        if (save) {
            pubsub.publish('save-settings', null);
        }
    }
};
