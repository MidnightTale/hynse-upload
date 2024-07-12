import { fileSizeMB, startTime } from './uploadState.js';

let lastUpdate = 0;

export function updateProgress(loaded) {
    const now = Date.now();
    if (now - lastUpdate < 1000) return;

    lastUpdate = now;

    const percentComplete = (loaded / (fileSizeMB * 1024 * 1024)) * 100;
    const uploadedMB = loaded / (1024 * 1024);
    const speed = loaded / ((Date.now() - startTime) / 1000);

    const progressBar = document.getElementById('progress');
    progressBar.style.width = percentComplete + '%';
    progressBar.style.filter = `saturate(${percentComplete}%)`;

    document.getElementById('uploadStatus').innerText = `${uploadedMB.toFixed(2)} MB (${(speed / (1024 * 1024)).toFixed(2)} MB/s)`;

    if (percentComplete >= 100) {
        progressBar.classList.add('complete');
    }
}