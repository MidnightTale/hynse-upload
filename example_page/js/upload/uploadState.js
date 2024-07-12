export let uploading = false;
export let fileSizeMB = 0;
export let startTime = 0;

export function setUploading(value) {
    uploading = value;
}

export function setFileSizeMB(value) {
    fileSizeMB = value;
}

export function setStartTime(value) {
    startTime = value;
}