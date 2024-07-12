export function getSavedTheme() {
    return localStorage.getItem('theme') || 'light';
}

export function setTheme(theme) {
    console.log(`Setting theme to: ${theme}`);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

export function applyTheme(theme) {
    console.log(`Applying theme: ${theme}`);
    document.documentElement.classList.remove('dark', 'light');
    const themeIcon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        console.log('Dark theme applied');
        themeIcon.className = 'fas fa-moon';
    } else {
        document.documentElement.classList.add('light');
        console.log('Light theme applied');
        themeIcon.className = 'fas fa-sun';
    }
}

export function cycleTheme() {
    const currentTheme = getSavedTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Attach the function to the window object
window.cycleTheme = cycleTheme;