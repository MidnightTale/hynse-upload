import { setFileSizeMB, setStartTime, setUploading } from './uploadState.js';

let countdownInterval;

export function resetUpload() {
    setUploading(false);
    setFileSizeMB(0);
    setStartTime(0);

    document.getElementById('fileInput').disabled = false;
    document.getElementById('dropZone').classList.remove('disabled');
    document.getElementById('dropZone').style.display = 'block';
    document.getElementById('expirationContainer').style.display = 'flex';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('progress').style.width = '0%';
    document.getElementById('uploadStatus').innerText = '';
    document.getElementById('downloadLink').innerHTML = '';
    document.getElementById('expirationCountdown').innerText = '';
    document.getElementById('copyButton').style.display = 'none';
    document.getElementById('uploadAgainButton').style.display = 'none';
    document.getElementById('expirationCountdown').style.display = 'none';
    document.getElementById('progressBar').style.display = 'none';
    document.getElementById('dropZone').style.display = 'block';

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    // Ensure the countdownText element is reset
    let countdownText = document.getElementById('countdownText');
    if (!countdownText) {
        // If the element doesn't exist, create it and append it to the expirationCountdown
        countdownText = document.createElement('span');
        countdownText.id = 'countdownText';
        document.getElementById('expirationCountdown').appendChild(countdownText);
    }
    countdownText.innerText = '';
}

// Attach the function to the window object
window.resetUpload = resetUpload;