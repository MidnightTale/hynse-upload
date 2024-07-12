export function getFileTypeIcon(fileType) {
    switch (fileType) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
            return 'fas fa-file-image';
        case 'application/pdf':
            return 'fas fa-file-pdf';
        case 'text/plain':
            return 'fas fa-file-alt';
        case 'application/zip':
        case 'application/x-rar-compressed':
            return 'fas fa-file-archive';
        default:
            return 'fas fa-file';
    }
}

export function updateStatusTag(element, expiration) {
    let interval;

    function update() {
        const now = Date.now();
        const timeLeft = expiration - now;

        if (timeLeft <= 0) {
            element.innerText = 'หมดอายุ';
            element.classList.add('expired');
            clearInterval(interval);
            return;
        }

        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const hours = Math.floor(minutes / 60);
        const displayMinutes = minutes % 60;

        if (hours > 0) {
            element.innerText = `${hours}:${displayMinutes.toString().padStart(2, '0')} ชม.`;
        } else if (minutes > 0) {
            element.innerText = `${displayMinutes}:${seconds.toString().padStart(2, '0')} นาที`;
        } else {
            element.innerText = `${seconds} วินาที`;
        }

        if (timeLeft < 10 * 60 * 1000) {
            element.classList.add('low-expiration');
        } else if (timeLeft > 1) {
            element.classList.remove('low-expiration');
        }
    }

    update();
    interval = setInterval(update, 1000);
}