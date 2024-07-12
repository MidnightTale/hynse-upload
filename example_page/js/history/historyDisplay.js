import { getFileTypeIcon, updateStatusTag } from './historyUtils.js';
import { copyToClipboard } from '../popupHandling.js';

export async function displayHistory(page = 1) {
    const history = JSON.parse(localStorage.getItem('uploadHistory')) || [];
    const historyContainer = document.getElementById('history');
    const historySection = document.getElementById('uploadHistoryHeader');
    historyContainer.innerHTML = '';

    const now = Date.now();
    const updatedHistory = history.filter(item => item.expiration > now);

    if (updatedHistory.length === 0) {
        historySection.style.display = 'none';
        historyContainer.style.display = 'none';
        return;
    } else {
        historySection.style.display = 'block';
        historyContainer.style.display = 'block';
    }

    updatedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const itemsPerPage = 5;
    const totalPages = Math.ceil(updatedHistory.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedHistory = updatedHistory.slice(startIndex, endIndex);

    paginatedHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';

        const fileTypeIcon = document.createElement('i');
        fileTypeIcon.className = getFileTypeIcon(item.fileType);
        fileTypeIcon.style.marginRight = '10px';

        const linkElement = document.createElement('a');
        linkElement.href = item.link;
        linkElement.target = '_blank';
        linkElement.innerText = item.fileName;

        const copyIcon = document.createElement('i');
        copyIcon.className = 'fas fa-copy copy-icon';
        copyIcon.title = 'คัดลอกลิงก์';
        copyIcon.onclick = () => copyToClipboard(item.link);

        const fileInfoContainer = document.createElement('div');
        fileInfoContainer.className = 'file-info-container';
        fileInfoContainer.appendChild(fileTypeIcon);
        fileInfoContainer.appendChild(linkElement);
        fileInfoContainer.appendChild(copyIcon);

        const fileInfo = document.createElement('span');
        fileInfo.innerText = `${item.fileSize}`;

        const timestampElement = document.createElement('span');
        const uploadDate = new Date(item.timestamp);
        timestampElement.innerText = ` ${uploadDate.toLocaleString()}`;

        const statusTag = document.createElement('span');
        statusTag.className = 'status-tag';
        updateStatusTag(statusTag, item.expiration);

        const detailsContainer = document.createElement('div');
        detailsContainer.className = 'details-container';
        detailsContainer.appendChild(fileInfo);
        detailsContainer.appendChild(timestampElement);
        detailsContainer.appendChild(statusTag);

        historyItem.appendChild(fileInfoContainer);
        historyItem.appendChild(detailsContainer);

        historyContainer.appendChild(historyItem);
    });

    if (updatedHistory.length > itemsPerPage) {
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.onclick = () => displayHistory(i);
            if (i === page) {
                pageButton.classList.add('active');
            }
            paginationControls.appendChild(pageButton);
        }

        historyContainer.appendChild(paginationControls);
    }

    localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));
}