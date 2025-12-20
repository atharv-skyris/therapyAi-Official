// document.addEventListener('DOMContentLoaded', () => {
//     // --- Application State ---

// });

let allNotes = [];
let filteredNotes = [];
let currentNote = null;
const fonts = ["font-handwriting", "font-serif", "font-sans"];
let currentFontIndex = 0;
let isDarkTheme = true;

// --- DOM Element Cache ---
const elements = {
  body: document.body,
  themeToggle: document.querySelector(".theme-toggle"),
  notesGrid: document.querySelector(".notes-grid"),
  searchInput: document.getElementById("newNoteInput"),
  addNoteBtn: document.getElementById("add-note-btn"),
  noteModal: document.getElementById("noteModal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  noteTitleInput: document.getElementById("noteTitleInput"),
  noteDescriptionInput: document.getElementById("noteDescriptionInput"),
  closeModalBtn: document.querySelector(".close-modal-btn"),
  saveNoteBtn: document.querySelector(".save-note-btn"),
  heightCheckUtil: createHeightCheckUtil(),
  fontToggleBtn: document.getElementById("font-toggle-btn"),
  notificationContainer: document.getElementById("notification-container"),
};

// --- Initialization ---
function init() {
  loadFont();
  loadTheme();
  loadNotes();
  setupEventListeners();
  renderNotes();
}

// --- Theme Management ---
function loadTheme() {
  const savedTheme = localStorage.getItem("therapyAiTheme");
  isDarkTheme = savedTheme ? JSON.parse(savedTheme) : true;
  applyTheme();
}

function applyTheme() {
  elements.body.classList.toggle("light-theme", !isDarkTheme);
  const theme = isDarkTheme ? "dark" : "light";
  elements.body.dataset.theme = theme;

  const newLabel = `Switch to ${isDarkTheme ? "light" : "dark"} theme`;
  elements.themeToggle.setAttribute("aria-label", newLabel);

  elements.body.classList.add("theme-transitioning");
  setTimeout(() => {
    elements.body.classList.remove("theme-transitioning");
  }, 500);
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  applyTheme();
  localStorage.setItem("therapyAiTheme", JSON.stringify(isDarkTheme));
}

// --- Font Handling ---

/**
 * Applies a font class to the body.
 * @param {string} fontClass - The CSS class for the font.
 */
function applyFont(fontClass) {
  document.body.classList.remove(...fonts);
  document.body.classList.add(fontClass);
}

/**
 * Cycles to the next font and applies it.
 */
function cycleFont() {
  currentFontIndex = (currentFontIndex + 1) % fonts.length;
  const nextFont = fonts[currentFontIndex];
  applyFont(nextFont);
  localStorage.setItem("notesFont", nextFont);
}

/**
 * Loads the saved font from localStorage.
 */
function loadFont() {
  const savedFont = localStorage.getItem("notesFont") || "font-handwriting";
  currentFontIndex = fonts.indexOf(savedFont);
  applyFont(savedFont);
}

// --- Core Functions ---

function renderNotes() {
  const fragment = document.createDocumentFragment();
  elements.notesGrid.innerHTML = "";

  const notesToRender = filteredNotes;

  if (notesToRender.length === 0) {
    displayEmptyState();
    return;
  }

  notesToRender
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .forEach((note, index) => {
      const noteCard = createNoteCard(note);
      noteCard.style.setProperty("--order", index);
      fragment.appendChild(noteCard);
    });
  elements.notesGrid.appendChild(fragment);
}

async function loadNotes() {
//   allNotes = JSON.parse(localStorage.getItem("therapyNotes")) || [];
//   if (allNotes.length === 0) {
//     loadSampleNotes();
//   }
    await loadSampleNotes();
    filterNotes();
}

function saveNotes() {
  localStorage.setItem("therapyNotes", JSON.stringify(allNotes));
}

async function handleSave() {
  const title = elements.noteTitleInput.value.trim();
  const content = elements.noteDescriptionInput.value.trim();
  if (!content && !title) {
    hideModal();
    return;
  }

  if (currentNote) {
    currentNote.title = title;
    currentNote.content = content;
    currentNote.date = new Date().toISOString();
    const _id  = currentNote.id
    console.log("updating note");
    const  obj = {
        _id,
        title,
        content
    }
    let response = await fetch('/notes/update' ,  {
        method:"PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({_id , title , content})
    })
    response = await response.json()
    // newNote.id = response.data

    if(!response.success){
        alert("Error updating  note ");
        return
    }
  } else {
    const newNote = {
      title,
      content,
      date: new Date().toISOString(),
    };

    let response = await fetch('/notes/create' ,  {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title , content})
    })
    response = await response.json()
    console.log(response)
    if(!response.success){
        alert("Error saving note to server.");
        return
    }

    newNote.id = response.data
    allNotes.unshift(newNote);
  }

  saveNotes();
  filterNotes();
  renderNotes();
  hideModal();
  showNotification("Note saved!");
}

// --- Search ---
function filterNotes() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  if (searchTerm) {
    filteredNotes = allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
  } else {
    filteredNotes = [...allNotes];
  }
  renderNotes();
}

// --- UI / UX ---

function displayEmptyState() {
  const searchTerm = elements.searchInput.value;
  const message = searchTerm
    ? `No notes found for "<strong>${sanitizeText(searchTerm)}</strong>"`
    : "You have no notes. Let's create one!";
  const icon = searchTerm ? "😕" : "📝";

  elements.notesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h2>${searchTerm ? "No Results" : "Journal is Empty"}</h2>
                <p>${message}</p>
            </div>
        `;
}

function showNotification(message) {
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = message;
  elements.notificationContainer.appendChild(notif);

  // Animate in
  setTimeout(() => {
    notif.classList.add("show");
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    notif.classList.remove("show");
    notif.addEventListener("transitionend", () => notif.remove());
  }, 3000);
}

// --- Modal Management ---

/**
 * Shows the note modal for editing or creating a note.
 * @param {object | null} noteToEdit - The note object to edit, or null to create a new one.
 */
function showModal(noteToEdit = null) {
  currentNote = noteToEdit;

  elements.noteTitleInput.value = noteToEdit?.title || "";
  elements.noteDescriptionInput.value = noteToEdit?.content || "";

  elements.modalBackdrop.classList.add("active");
  elements.noteModal.classList.add("active");
  elements.noteDescriptionInput.focus();
}

/**
 * Hides the note modal and resets its state.
 */
function hideModal() {
  elements.modalBackdrop.classList.remove("active");
  elements.noteModal.classList.remove("active");

  elements.noteTitleInput.value = "";
  elements.noteDescriptionInput.value = "";
  currentNote = null;
}

// --- Note Card Creation ---

/**
 * Creates a note card element.
 * @param {object} note - The note object.
 * @returns {HTMLElement} The created card element.
 */
function createNoteCard(note) {
  const card = document.createElement("div");
  card.className = "note-card";
  console.log(note)
  card.id = note.id

  const sanitizedTitle = sanitizeText(note.title || "");

  const renderedContent = `<pre class="plaintext-content">${sanitizeText(
    note.content
  )}</pre>`;
  const isLongContent = checkContentHeight(renderedContent);

  card.innerHTML = `
            ${
              sanitizedTitle
                ? `<div class="note-card-title">${sanitizedTitle}</div>`
                : ""
            }
            <div class="note-content ${
              isLongContent ? "truncated" : ""
            }">${renderedContent}</div>
            ${
              isLongContent
                ? '<span class="show-more">Click to read more</span>'
                : ""
            }
            <span class="note-date">${formatDate(note.date)}</span>
        `;

  card.addEventListener("click", () => showModal(note));
  card.addEventListener("contextmenu", async(e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      const response = await  fetch('/notes/delete' ,  {
        method:"DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({_id :note.id})
      })
      const data = await response.json()
      if(!data.success){
        alert("Error deleting note from server.");
        return
      }
      console.log("deleting note");
      
      document.getElementById(note.id).remove();
      allNotes = allNotes.filter((n) => n.id !== note.id);
      console.log("allNotes after deletion" ,  allNotes);
      // saveNotes();
      // renderNotes();
    }
  });

  return card;
}

// --- Utility Functions ---

/**
 * Creates a reusable, hidden element to measure content height efficiently.
 * @returns {HTMLElement} The utility element.
 */
function createHeightCheckUtil() {
  const util = document.createElement("div");
  util.style.cssText =
    "position:absolute; visibility:hidden; width:250px; font-size:1.1rem; line-height:1.4;";
  document.body.appendChild(util);
  return util;
}

/**
 * Checks if the rendered content of a note exceeds a certain height.
 * @param {string} contentHtml - The rendered HTML of the note content.
 * @returns {boolean} True if the content is long, false otherwise.
 */
function checkContentHeight(contentHtml) {
  elements.heightCheckUtil.innerHTML = contentHtml;
  return elements.heightCheckUtil.offsetHeight > 200;
}

/**
 * Sanitizes plain text to prevent XSS.
 * @param {string} text - The text to sanitize.
 * @returns {string} The sanitized text.
 */
function sanitizeText(text) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Formats a date string into a relative time string.
 * @param {string} date - The ISO date string.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  const now = new Date();
  const noteDate = new Date(date);
  const diffTime = Math.abs(now - noteDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return noteDate.toLocaleDateString();
}

function debounce(func, delay = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Sets up all the initial event listeners for the application.
 */
function setupEventListeners() {
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.addNoteBtn.addEventListener("click", () => showModal());
  elements.searchInput.addEventListener("input", debounce(filterNotes));
  elements.saveNoteBtn.addEventListener("click", handleSave);
  elements.closeModalBtn.addEventListener("click", hideModal);
  elements.modalBackdrop.addEventListener("click", hideModal);
  elements.fontToggleBtn.addEventListener("click", cycleFont);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.noteModal.classList.contains("active")) {
      hideModal();
    }
  });

  elements.noteModal.addEventListener("click", (e) => e.stopPropagation());
}

/**
 * Loads sample notes if the store is empty.
 */


async function loadSampleNotes() {
    console.log("at smaple notes")
    try {
        const reponse = await fetch('/notes/getNotes')
        const data = await reponse.json()
        if(data.success){
            allNotes =  data.data.notes.map(note =>{
                return{
                    id: note.id,
                    title: note.title,
                    content: note.content,
                    date: note.createdAt
                }
            })
            saveNotes();
            renderNotes();
        }else{
            alert("unable to get the note.");
            return
        }
    } catch (error) {
        alert(error.message)
        return
    }

}


// allNotes = [
//     {
//       id: Date.now() + 1,
//       title: "Welcome to Your Journal",
//       content:
//         "Welcome!\nYour therapy session notes will appear here...\n\nStart writing your thoughts and feelings.",
//       date: new Date(Date.now() - 86400000 * 3).toISOString(),
//     },
//     {
//       id: Date.now() + 2,
//       title: "Getting Started",
//       content:
//         "Click the input bar or + button to add a new note.\n\nWrite freely about your thoughts, feelings, and experiences.",
//       date: new Date(Date.now() - 86400000 * 2).toISOString(),
//     },
//     {
//       id: Date.now() + 3,
//       title: "Your First Note",
//       content:
//         "This is your first note.\n\nNew lines are preserved, and you can write as much as you need.",
//       date: new Date(Date.now() - 86400000).toISOString(),
//     },
//     {
//       id: Date.now() + 4,
//       title: "Track Your Progress",
//       content:
//         "Keep track of your therapy journey here...\n\nWrite about your sessions, insights, and progress.",
//       date: new Date().toISOString(),
//     },
//   ];
//   saveNotes();
//   renderNotes();
init();
