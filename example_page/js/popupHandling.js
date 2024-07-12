export function showPopup(message) {
    const popupContainer = document.getElementById('popupContainer');
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerText = message;
    popupContainer.appendChild(popup);

    // Add the show class to trigger the animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10); // Slight delay to ensure the element is added to the DOM

    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('fade-out');
        setTimeout(() => {
            popupContainer.removeChild(popup);
        }, 500); // Match this duration with the fade-out transition
    }, 3000); // Duration before starting to fade out
}

export function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showPopup('คัดลอกลิงก์แล้ว');
        }, () => {
            showPopup('ไม่สามารถคัดลอกลิงก์ได้');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showPopup('คัดลอกลิงก์แล้ว');
        } catch (err) {
            showPopup('ไม่สามารถคัดลอกลิงก์ได้');
        }
        document.body.removeChild(textArea);
    }
}

export function openFAQ() {
    const faqOverlay = document.getElementById('faqOverlay');
    faqOverlay.style.display = 'flex';
    setTimeout(() => {
        faqOverlay.classList.add('show');
    }, 10); // Slight delay to ensure the element is added to the DOM

    faqOverlay.addEventListener('click', (event) => {
        if (event.target === faqOverlay) {
            closeFAQ();
        }
    });
}

export function closeFAQ() {
    const faqOverlay = document.getElementById('faqOverlay');
    faqOverlay.classList.remove('show');
    setTimeout(() => {
        faqOverlay.style.display = 'none';
    }, 300); // Match this duration with the transition
}

export function openTermsOfService() {
    const tosOverlay = document.getElementById('termsOfServiceOverlay');
    tosOverlay.style.display = 'flex';
    setTimeout(() => {
        tosOverlay.classList.add('show');
    }, 10); // Slight delay to ensure the element is added to the DOM

    tosOverlay.addEventListener('click', (event) => {
        if (event.target === tosOverlay) {
            closeTermsOfService();
        }
    });
}

export function closeTermsOfService() {
    const tosOverlay = document.getElementById('termsOfServiceOverlay');
    tosOverlay.classList.remove('show');
    setTimeout(() => {
        tosOverlay.style.display = 'none';
    }, 300); // Match this duration with the transition
}

export function openAcceptableUsePolicy() {
    const aupOverlay = document.getElementById('acceptableUsePolicyOverlay');
    aupOverlay.style.display = 'flex';
    setTimeout(() => {
        aupOverlay.classList.add('show');
    }, 10); // Slight delay to ensure the element is added to the DOM

    aupOverlay.addEventListener('click', (event) => {
        if (event.target === aupOverlay) {
            closeAcceptableUsePolicy();
        }
    });
}

export function closeAcceptableUsePolicy() {
    const aupOverlay = document.getElementById('acceptableUsePolicyOverlay');
    aupOverlay.classList.remove('show');
    setTimeout(() => {
        aupOverlay.style.display = 'none';
    }, 300); // Match this duration with the transition
}

export function openDMCAIPPolicy() {
    const dmcaOverlay = document.getElementById('dmcaIpPolicyOverlay');
    dmcaOverlay.style.display = 'flex';
    setTimeout(() => {
        dmcaOverlay.classList.add('show');
    }, 10); // Slight delay to ensure the element is added to the DOM

    dmcaOverlay.addEventListener('click', (event) => {
        if (event.target === dmcaOverlay) {
            closeDMCAIPPolicy();
        }
    });
}

export function closeDMCAIPPolicy() {
    const dmcaOverlay = document.getElementById('dmcaIpPolicyOverlay');
    dmcaOverlay.classList.remove('show');
    setTimeout(() => {
        dmcaOverlay.style.display = 'none';
    }, 300); // Match this duration with the transition
}

// Attach the functions to the window object
window.copyToClipboard = copyToClipboard;
window.openFAQ = openFAQ;
window.closeFAQ = closeFAQ;
window.openTermsOfService = openTermsOfService;
window.closeTermsOfService = closeTermsOfService;
window.openAcceptableUsePolicy = openAcceptableUsePolicy;
window.closeAcceptableUsePolicy = closeAcceptableUsePolicy;
window.openDMCAIPPolicy = openDMCAIPPolicy;
window.closeDMCAIPPolicy = closeDMCAIPPolicy;