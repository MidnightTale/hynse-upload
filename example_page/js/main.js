import { chooseFile, dragOver, dragLeave, dropFile, handleFileUpload } from './fileHandling.js';
import { cycleTheme, applyTheme, getSavedTheme } from './themeManagement.js';
import { loadExpirationSetting, startExpirationCountdown } from './uiUpdates.js';
import { resetUpload } from './upload/resetUpload.js';
import { copyToClipboard } from './popupHandling.js';
import { displayHistory } from './history/historyDisplay.js';

document.addEventListener('DOMContentLoaded', () => {
    loadExpirationSetting();
    applyTheme(getSavedTheme());
    displayHistory();

    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const copyButton = document.getElementById('copyButton');
    const uploadAgainButton = document.getElementById('uploadAgainButton');

    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    if (dropZone) {
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('dragleave', dragLeave);
        dropZone.addEventListener('drop', dropFile);
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const downloadLink = document.getElementById('downloadLink').innerText;
            copyToClipboard(downloadLink);
        });
    }
    
    const downloadLinkElement = document.getElementById('downloadLink');
    if (downloadLinkElement) {
        downloadLinkElement.addEventListener('click', (event) => {
            event.preventDefault();
            const downloadLink = downloadLinkElement.innerText;
            copyToClipboard(downloadLink);
        });
    }

    if (uploadAgainButton) {
        uploadAgainButton.addEventListener('click', resetUpload);
    }
});

