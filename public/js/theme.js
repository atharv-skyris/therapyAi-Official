import { getTheme, saveTheme } from './storage.js';

/**
 * Theme Management
 * 
 * Handles loading, applying, and toggling the light/dark theme for the application.
 * It uses localStorage to persist the theme choice and updates the DOM accordingly.
 */

// --- State ---
let isDarkTheme = true;

// --- Private Functions ---

/**
 * Applies the current theme to the document body and updates the ARIA label
 * on all theme toggle buttons.
 */
function applyTheme() {
    const theme = isDarkTheme ? 'dark' : 'light';
    document.body.classList.toggle('light-theme', !isDarkTheme);
    document.body.dataset.theme = theme;

    // Update all theme toggle buttons on the page
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const newLabel = `Switch to ${isDarkTheme ? 'light' : 'dark'} theme`;
    themeToggles.forEach(btn => btn.setAttribute('aria-label', newLabel));

    // Add a class to enable smooth transitions after the initial load
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 500);
}

// --- Public API ---

/**
 * Loads the theme from localStorage and applies it. Should be called once on startup.
 */
export function loadTheme() {
    const savedTheme = getTheme();
    isDarkTheme = savedTheme ? JSON.parse(savedTheme) : true;
    applyTheme();
}

/**
 * Toggles the theme between dark and light, saves the preference, and applies the change.
 */
export function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    saveTheme(isDarkTheme);
    applyTheme();
}

/**
 * Initializes theme functionality by loading the theme and attaching a click listener
 * to all theme toggle buttons.
 * @param {boolean} listenForClicks - If true, attaches event listeners to toggle buttons.
 */
export function initializeTheme(listenForClicks = true) {
    loadTheme();
    if (listenForClicks) {
        // Use event delegation on the body to handle clicks on any theme-toggle,
        // even those added to the DOM later.
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                toggleTheme();
            }
        });
    }
} 