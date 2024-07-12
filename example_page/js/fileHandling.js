import { showPopup } from './popupHandling.js';
import { uploadFile } from './upload/uploadFile.js'; // Import uploadFile
import { disableUpload } from './upload/disableUpload.js'; // Import disableUpload
import { setUploading, uploading } from './upload/uploadState.js'; // Import shared state
import { setFileSizeMB, fileSizeMB } from './upload/uploadState.js'; // Import shared state

export function chooseFile() {
    if (!uploading) {
        document.getElementById('fileInput').click();
    }
}

// Attach the function to the window object
window.chooseFile = chooseFile;

export function dragOver(event) {
    event.preventDefault();
    if (!uploading) {
        document.getElementById('dropZone').style.backgroundColor = '#e8f5e9';
    }
}

export function dragLeave(event) {
    event.preventDefault();
    if (!uploading) {
        document.getElementById('dropZone').style.backgroundColor = '#fafafa';
    }
}

export async function dropFile(event) {
    event.preventDefault();
    console.log('File dropped');
    if (!uploading) {
        document.getElementById('dropZone').style.backgroundColor = '#fafafa';
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.size > 1 * 1024 * 1024 * 1024) { // 1GB in bytes
                showPopup('การอัปโหลดล้มเหลว! ขนาดไฟล์เกิน 1GB');
                return;
            }
            console.log('File detected:', file.name);
            displayFileInfo(file);
            await uploadFile(file);
            disableUpload();
        }
    }
}

export async function handleFileUpload(event) {
    if (!uploading) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 1 * 1024 * 1024 * 1024) { // 1GB in bytes
                showPopup('การอัปโหลดล้มเหลว! ขนาดไฟล์เกิน 1GB');
                return;
            }
            displayFileInfo(file);
            await uploadFile(file);
            disableUpload();
        }
    }
}

// Attach the function to the window object
window.handleFileUpload = handleFileUpload;

export function displayFileInfo(file) {
    console.log('Displaying file info:', file.name);
    document.getElementById('fileInfo').style.display = 'block';
    document.getElementById('fileName').innerText = `${file.name} - ${formatBytes(file.size)}`;
    setFileSizeMB(file.size / (1024 * 1024));
}

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}