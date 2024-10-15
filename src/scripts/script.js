import formBuilder from './builders/formBuilder.js';
import taskBuilder from './builders/taskBuilder.js';
import modalBuilder from './builders/modalBuilder.js';
import { 
    setTaskToLocalStorage, 
    readLocalStorage,
    deleteTaskFromLocalStorage 
} from './data/storage/localStorage.js';

const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');

const modal = modalBuilder();
let index = 0;

document.addEventListener('DOMContentLoaded', function() {
    formBuilder(formTaskContainer, addTask);

    const localStorageElements = readLocalStorage();
    console.log(localStorageElements);

    if (localStorageElements.length == 0) {
        return;
    }

    // localStorageElements.map(task => JSON.parse(task));

    console.log(localStorageElements);

    for (let indexElem = 0; indexElem < localStorageElements.length; ++indexElem) {
        let { title, description } = JSON.parse(localStorageElements[indexElem]);
        console.log(title);
        console.log(description);

        addTask(
            { value: title },
            { value: description }
        );
    }
});


function addTask(inputTitle, inputDescription) {
    // const inputTitle = formTaskContainer.querySelector('#input-title');
    // const inputDescription = formTaskContainer.querySelector('#input-description');
    console.log(inputTitle.value);
    console.log(inputDescription.value);
    
    let title = inputTitle.value;
    let description = inputDescription.value;

    if (title == '') {
        return;
    }

    if (description == '') {
        description = 'Нет описания';
    }

    ++index;
    taskBuilder(listTaskContainer, title, description, deleteTask, index, modal);
    setTaskToLocalStorage(index, title, description);

    inputTitle.value = '';
    inputDescription.value = '';
}

function deleteTask(task, modal) {
    console.log(modal);

    modal.modalWindow.showModal();

    modal.buttonYes.addEventListener(
        'click', 
        () => onClickYes(modal.modalWindow, task),
        { once: true }
    );
    modal.buttonNo.addEventListener(
        'click', 
        () => onClickNo(modal.modalWindow),
        { once: true }
    )
}

// Метод для кнопки Да
function onClickYes(modal, task) {
    modal.close();

    task.remove();
    deleteTaskFromLocalStorage(task.id);

    --index;
}

// Метод для кнопки Нет
function onClickNo(modal) {
    modal.close();
}


