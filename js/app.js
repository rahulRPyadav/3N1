// Global State Variable for Date & Tab Management
let currentDate = new Date().toISOString().split('T')[0];
const ACTIVE_TAB_KEY = 'tracker_active_tab';

// Storage Helper Functions
function getStorageData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setStorageData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function removeStorageData(key) {
  localStorage.removeItem(key);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupDatePicker();
  
  // Render modules
  if (typeof renderDiet === 'function') renderDiet();
  if (typeof renderWorkout === 'function') renderWorkout();
  if (typeof renderStudy === 'function') renderStudy();
});

// Tab Navigation Logic with Refresh Persistence
function setupNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Check last saved tab from localStorage (Default: 'diet')
  const savedTab = localStorage.getItem(ACTIVE_TAB_KEY) || 'diet';
  switchTab(savedTab);

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
      navMenu.classList.remove('show');
    });
  });

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
}

function switchTab(tabName) {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Save active tab in localStorage so refresh preserves current view
  localStorage.setItem(ACTIVE_TAB_KEY, tabName);

  navBtns.forEach(b => {
    if (b.getAttribute('data-tab') === tabName) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  tabContents.forEach(c => {
    if (c.id === `section-${tabName}`) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });
}

// Date Selector Logic
function setupDatePicker() {
  const datePicker = document.getElementById('globalDatePicker');
  const btnToday = document.getElementById('btnToday');
  const btnTomorrow = document.getElementById('btnTomorrow');

  datePicker.value = currentDate;

  datePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      currentDate = e.target.value;
      refreshAllSections();
    }
  });

  btnToday.addEventListener('click', () => {
    currentDate = new Date().toISOString().split('T')[0];
    datePicker.value = currentDate;
    refreshAllSections();
  });

  btnTomorrow.addEventListener('click', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    currentDate = tomorrow.toISOString().split('T')[0];
    datePicker.value = currentDate;
    refreshAllSections();
  });
}

function refreshAllSections() {
  if (typeof renderDiet === 'function') renderDiet();
  if (typeof renderWorkout === 'function') renderWorkout();
  if (typeof renderStudy === 'function') renderStudy();
}

/* Master Reset Function: Clears all localStorage keys starting with tracker_ */
function clearAllAppData() {
  if (confirm('⚠️ WARNING: Do you want to permanently delete all data from the entire application (diet, workout, study, and routine templates)? This action cannot be undone!')) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tracker_')) {
        localStorage.removeItem(key);
      }
    });
    alert('The entire history has been permanently deleted.');
    refreshAllSections();
  }
}