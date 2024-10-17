export default function editModalBuilder() {
    const editModal = document.createElement('dialog');
    editModal.className = 'edit-modal';

    const editModalContent = document.createElement('div');
    editModalContent.className = 'edit-modal-content';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.placeholder = 'Title...';
    inputTitle.className = 'input-task';

    const textAreaDescription = document.createElement('textarea');
    textAreaDescription.placeholder = 'Description...';
    textAreaDescription.className = 'input-task input-description';

    inputContainer.appendChild(inputTitle);
    inputContainer.appendChild(textAreaDescription);

    const editModalButtonsContainer = document.createElement('div');
    editModalButtonsContainer.className = 'edit-modal-buttons-container';

    const buttonCancel = document.createElement('button');
    buttonCancel.className = 'text-buttons';
    buttonCancel.textContent = 'Cancel';

    const buttonSave = document.createElement('button');
    buttonSave.className = 'text-buttons';
    buttonSave.textContent = 'Save';

    editModalButtonsContainer.appendChild(buttonCancel);
    editModalButtonsContainer.appendChild(buttonSave);

    editModalContent.appendChild(inputContainer);
    editModalContent.appendChild(editModalButtonsContainer);

    editModal.appendChild(editModalContent);

    document.body.appendChild(editModal);

    return {
        modalWindow: editModal,
        buttonCancel: buttonCancel,
        buttonSave: buttonSave,
        inputTitle: inputTitle,
        inputDescription: textAreaDescription
    };
}  