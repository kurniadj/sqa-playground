// SQA Playground — Shared App Logic
// Handles: localStorage, navigation active state

const APP_KEY = 'sqa_playground_data';

const AppData = {
    get() {
        try {
            return JSON.parse(localStorage.getItem(APP_KEY)) || {};
        } catch { return {}; }
    },
    set(data) {
        localStorage.setItem(APP_KEY, JSON.stringify(data));
    },
    update(partial) {
        const current = this.get();
        this.set({ ...current, ...partial });
    },
    clear() {
        localStorage.removeItem(APP_KEY);
    }
};

// Mark active nav link
(function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();
