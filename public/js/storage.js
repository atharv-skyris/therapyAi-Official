/**
 * Local Storage Manager
 *
 * A centralized module for getting and setting all application data
 * stored in the browser's localStorage. This ensures consistency and
 * abstracts the underlying storage mechanism.
 */

// --- Keys ---
const NOTES_KEY = 'notes';
const FONT_KEY = 'journalFont';
const THEME_KEY = 'therapyAiTheme';

// --- Generic Helpers ---

function get(key) {
    return localStorage.getItem(key);
}

function set(key, value) {
    localStorage.setItem(key, value);
}

function remove(key) {
    localStorage.removeItem(key);
}

function getJson(key, defaultValue = []) {
    try {
        const value = get(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
        return defaultValue;
    }
}

function setJson(key, value) {
    set(key, JSON.stringify(value));
}


// --- Public API ---

// Notes
export const getNotes = () => getJson(NOTES_KEY, []);
export const saveNotes = (notes) => setJson(NOTES_KEY, notes);
export const deleteNotes = () => remove(NOTES_KEY);

// Font
export const getFont = () => get(FONT_KEY) || 'handwriting';
export const saveFont = (font) => set(FONT_KEY, font);

// Theme
export const getTheme = () => get(THEME_KEY);
export const saveTheme = (isDarkTheme) => set(THEME_KEY, isDarkTheme); 