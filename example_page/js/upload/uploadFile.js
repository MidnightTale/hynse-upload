import { showPopup } from '../popupHandling.js';
import { updateProgress } from './updateProgress.js';
import { disableUpload } from './disableUpload.js';
import { resetUpload } from './resetUpload.js';
import { saveHistory } from '../history/historyStorage.js';
import { formatBytes } from '../fileHandling.js';
import { startExpirationCountdown } from '../uiUpdates.js';
import { setUploading, setStartTime } from './uploadState.js';

let uploading = false;
let startTime = 0;

export async function uploadFile(file) {
    try {
        console.log('Starting upload for file:', file.name);
        setUploading(true);
        setStartTime(Date.now());

        showPopup('เริ่มการอัปโหลดไฟล์...');

        document.getElementById('progressBar').style.display = 'block';
        document.getElementById('expirationContainer').style.display = 'none';
        document.getElementById('dropZone').style.display = 'none';

        const formData = new FormData();
        formData.append('file', file);
        const expirationMinutes = localStorage.getItem('expiration') || 60;
        formData.append('expiration', expirationMinutes);

        const progressBar = document.getElementById('progress');

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                console.log(`Upload progress: ${percentComplete}%`);
                progressBar.style.width = percentComplete + '%';
                progressBar.style.filter = `saturate(${percentComplete}%)`;
                updateProgress(event.loaded);
            }
        });

        xhr.onload = function() {
            console.log('Upload completed with status:', xhr.status);
            if (xhr.status === 200) {
                const result = JSON.parse(xhr.responseText);
                console.log('Upload result:', result);
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.innerHTML = `<a href="${result.downloadLink}" target="_blank"><i class="fas fa-link"></i> ${result.downloadLink}</a>`;
                startExpirationCountdown(expirationMinutes);

                document.getElementById('copyButton').style.display = 'inline-block';
                document.getElementById('uploadAgainButton').style.display = 'inline-block';
                document.getElementById('expirationCountdown').style.display = 'block';

                const fileName = file.name;
                const fileSize = formatBytes(file.size);
                const fileType = file.type;
                const expiration = Date.now() + expirationMinutes * 60 * 1000;

                saveHistory(result.downloadLink, fileName, fileSize, fileType, expiration);

                progressBar.style.width = '100%';
                progressBar.style.filter = 'saturate(100%)';
                progressBar.classList.add('complete');

                setTimeout(() => {
                    progressBar.classList.add('progress-bar-fade-out');
                }, 1000);

                showPopup('การอัปโหลดเสร็จสมบูรณ์!');
            } else {
                const errorResponse = JSON.parse(xhr.responseText);
                console.error('Upload failed with status:', xhr.status, errorResponse.error);
                if (errorResponse.error === 'file_limit') {
                    showPopup('การอัปโหลดล้มเหลว! ขนาดไฟล์เกิน 1GB');
                } else if (errorResponse.error === 'duplicate') {
                    showPopup('การอัปโหลดล้มเหลว! ไฟล์นี้ถูกอัปโหลดแล้ว');
                } else if (errorResponse.error === 'disallowed_file_type') {
                    showPopup('การอัปโหลดล้มเหลว! ประเภทไฟล์นี้ไม่ได้รับอนุญาต');
                } else {
                    showPopup(`การอัปโหลดล้มเหลว! Error: ${errorResponse.error}`);
                }
                resetUpload();
            }
            setUploading(false);
        };

        xhr.onerror = function() {
            console.error('Error uploading file.');
            showPopup('เกิดข้อผิดพลาดในการอัปโหลดไฟล์!');
            setUploading(false);
        };

        xhr.open('POST', '/upload');
        xhr.send(formData);
    } catch (error) {
        console.error('Error uploading file:', error);
        showPopup('เกิดข้อผิดพลาดในการอัปโหลดไฟล์!');
        setUploading(false);
    }
}