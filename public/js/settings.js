document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        themeOptions: document.querySelectorAll('.theme-option'),
        exportBtn: document.getElementById('export-btn'),
        importBtn: document.getElementById('import-btn'),
        importFile: document.getElementById('import-file'),
        deleteAllBtn: document.getElementById('delete-all-btn'),
        modal: document.getElementById('confirmation-modal'),
        confirmBtn: document.getElementById('confirm-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
    };

    let isDarkTheme = true;

    function applyTheme() {
        document.body.classList.toggle('dark-theme', isDarkTheme);
        document.body.classList.toggle('light-theme', !isDarkTheme);

        elements.themeOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.theme === (isDarkTheme ? 'dark' : 'light'));
        });
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('therapyAiTheme');
        isDarkTheme = savedTheme ? JSON.parse(savedTheme) : true;
        applyTheme();
    }

    function setTheme(isDark) {
        isDarkTheme = isDark;
        localStorage.setItem('therapyAiTheme', isDarkTheme);
        applyTheme();
    }

    function exportNotes() {
        const notes = localStorage.getItem('therapyNotes') || '[]';
        const blob = new Blob([notes], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `therapy-ai-notes-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importNotes(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const notes = JSON.parse(e.target.result);
                if (Array.isArray(notes)) {
                    localStorage.setItem('therapyNotes', JSON.stringify(notes));
                    showNotification('Notes imported successfully!');
                } else {
                    showNotification('Invalid file format.');
                }
            } catch (error) {
                showNotification('Error reading file. Make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }

    function showModal() {
        elements.modal.classList.remove('hidden');
    }

    function hideModal() {
        elements.modal.classList.add('hidden');
    }

    function deleteAllNotes() {
        localStorage.removeItem('therapyNotes');
        hideModal();
        showNotification('All notes have been deleted.');
    }

    function showNotification(message) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        container.appendChild(notif);

        // Animate in
        setTimeout(() => {
            notif.classList.add('show');
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notif.classList.remove('show');
            notif.addEventListener('transitionend', () => notif.remove());
        }, 3000);
    }

    // Event Listeners
    elements.themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            setTheme(option.dataset.theme === 'dark');
        });
    });

    elements.exportBtn.addEventListener('click', exportNotes);
    elements.importBtn.addEventListener('click', () => elements.importFile.click());
    elements.importFile.addEventListener('change', importNotes);
    elements.deleteAllBtn.addEventListener('click', showModal);
    elements.cancelBtn.addEventListener('click', hideModal);
    elements.confirmBtn.addEventListener('click', deleteAllNotes);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            hideModal();
        }
    });

    // Initial load
    loadTheme();
}); 