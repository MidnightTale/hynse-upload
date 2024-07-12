import { showPopup } from './popupHandling.js';

export function setExpiration(minutes) {
    localStorage.setItem('expiration', minutes);
    updateExpirationButtons(minutes);
    showPopup(`ตั้งค่าหมดอายุเป็น ${minutes} นาที`);
}

export function loadExpirationSetting() {
    const savedExpiration = localStorage.getItem('expiration') || 60;
    updateExpirationButtons(savedExpiration);
}

function updateExpirationButtons(selectedMinutes) {
    const buttons = document.querySelectorAll('#expirationButtons button');
    buttons.forEach(button => {
        const buttonMinutes = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        if (buttonMinutes === parseInt(selectedMinutes)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

let countdownInterval;

export function startExpirationCountdown(expirationMinutes) {
    const countdownText = document.getElementById('countdownText');
    if (!countdownText) {
        console.error('Element with ID "countdownText" not found.');
        return;
    }
    const expirationTime = Date.now() + expirationMinutes * 60 * 1000;

    function updateCountdown() {
        const now = Date.now();
        const timeLeft = expirationTime - now;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownText.innerText = 'หมดอายุ';
            return;
        }

        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const hours = Math.floor(minutes / 60);
        const displayMinutes = minutes % 60;

        let countdownTextContent = 'หมดอายุในอีก ';
        if (hours > 0) {
            countdownTextContent += `${hours} ชั่วโมง `;
        }
        countdownTextContent += `${displayMinutes}:${seconds.toString().padStart(2, '0')} นาที`;

        countdownText.innerText = countdownTextContent;
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Attach the function to the window object
window.setExpiration = setExpiration;