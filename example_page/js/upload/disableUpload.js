import { setUploading, uploading } from './uploadState.js';

export function disableUpload() {
    setUploading(true);
    document.getElementById('fileInput').disabled = true;
    document.getElementById('dropZone').classList.add('disabled');
}