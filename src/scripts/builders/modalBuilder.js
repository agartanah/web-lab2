// let modal, buttonYes, buttonNo;

export default function modalBuilder() {
    const modal = document.createElement('dialog');
    modal.className = 'modal-window';

    const modalContentContainer = document.createElement('div');
    modalContentContainer.className = 'modal-content-container';

    const modalDecoration = document.createElement('div');
    modalDecoration.className = 'modal-decoration';

    const modalTextContainer = document.createElement('div');
    modalTextContainer.className = 'modal-text-container';

    const modalText = document.createElement('p');
    modalText.className = 'modal-text';
    modalText.textContent = 'Delete this task?';

    modalTextContainer.appendChild(modalText);

    const modalButtonsContainer = document.createElement('div');
    modalButtonsContainer.className = 'modal-buttons-container';

    const buttonYes = document.createElement('button');
    buttonYes.className = 'text-buttons';
    buttonYes.textContent = 'Да';

    const buttonNo = document.createElement('button');
    buttonNo.className = 'text-buttons re-bg';
    buttonNo.textContent = 'Нет';

    modalButtonsContainer.appendChild(buttonYes);
    modalButtonsContainer.appendChild(buttonNo);

    modalContentContainer.appendChild(modalDecoration);
    modalContentContainer.appendChild(modalTextContainer);
    modalContentContainer.appendChild(modalButtonsContainer);

    modal.appendChild(modalContentContainer);

    document.body.appendChild(modal);

    return { 
        modalWindow: modal,
        modalContent: modalContentContainer,
        buttonYes: buttonYes, 
        buttonNo: buttonNo 
    };
}

// function setListenersToModalButtons(onClickYes, onClickNo, task, modal) {
//     buttonYes.addEventListener('click', () => onClickYes(task, modal));
//     buttonNo.addEventListener('click', () => onClickNo(modal));
// }