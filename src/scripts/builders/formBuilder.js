export default function formBuilder(formTaskContainer, addTask) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';
    
    const inputTitle = document.createElement('input');
    initInput(inputTitle, 'Title...', 'input-title');

    const inputDescription = document.createElement('input');
    initInput(inputDescription, 'About...', 'input-description');

    inputContainer.appendChild(inputTitle);
    inputContainer.appendChild(inputDescription);

    const addTaskButtonContainer = document.createElement('div');
    addTaskButtonContainer.className = 'add-task-button-container';

    const addButton = document.createElement('button');
    addButton.id = 'add-button';
    addButton.className = 'add-button';
    addButton.addEventListener('click', () => addTask(inputTitle, inputDescription));

    addTaskButtonContainer.appendChild(addButton);

    formTaskContainer.appendChild(inputContainer);
    formTaskContainer.appendChild(addTaskButtonContainer);

    function initInput(input, placeholderText, id) {
        input.type = 'text';
        input.className = 'input-task';
        input.placeholder = placeholderText;
        input.id = id;
    }
}