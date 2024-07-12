import { displayHistory } from './historyDisplay.js';

export async function saveHistory(link, fileName, fileSize, fileType, expiration, uuid) {
    let history = JSON.parse(localStorage.getItem('uploadHistory')) || [];
    history.push({ link, fileName, fileSize, fileType, expiration, timestamp: new Date().toISOString(), uuid });
    localStorage.setItem('uploadHistory', JSON.stringify(history));
    displayHistory();
}