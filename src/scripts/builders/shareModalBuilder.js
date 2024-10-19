export default function shareModalBuilder() {
    const shareModal = document.createElement('dialog');
    shareModal.className = 'share-modal';

    const shareModalContent = document.createElement('div')
    shareModalContent.className = 'share-modal-content';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';

    const vkButton = document.createElement('button');
    vkButton.className = 'vk-button';

    const telegramButton = document.createElement('button');
    telegramButton.className = 'telegram-button';

    const whatsupButton = document.createElement('button');
    whatsupButton.className = 'whatsup-button';

    const facebookButton = document.createElement('button');
    facebookButton.className = 'facebook-button';

    shareModalContent.appendChild(copyButton);
    shareModalContent.appendChild(vkButton);
    shareModalContent.appendChild(telegramButton);
    shareModalContent.appendChild(whatsupButton);
    shareModalContent.appendChild(facebookButton);

    shareModal.appendChild(shareModalContent);

    document.body.appendChild(shareModal);

    return {
        modalWindow: shareModal,
        modalContent: shareModalContent,
        buttonCopy: copyButton,
        buttonVk: vkButton,
        buttonTelegram: telegramButton,
        buttonWhatsup: whatsupButton,
        buttonFacebook: facebookButton
    }
}