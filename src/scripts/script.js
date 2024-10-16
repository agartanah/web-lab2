import formBuilder from './builders/formBuilder.js';
import taskBuilder from './builders/taskBuilder.js';
import modalBuilder from './builders/modalBuilder.js';
import taskButtonsContainerBuilder from './builders/taskButtonsContainerBuilder.js';
import { 
    setTaskToLocalStorage, 
    readLocalStorage,
    deleteTaskFromLocalStorage 
} from './data/storage/localStorage.js';
import editModalBuilder from './builders/editModalBuilder.js';

const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');

const taskButtonsContainer = taskButtonsContainerBuilder();
const modal = modalBuilder();
const editModal = editModalBuilder();

let index = 0;

// заполнение страницы данными (если они есть в local-storage)
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

// метод для кнопки добавления таска
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
    taskBuilder(
        listTaskContainer, 
        title, 
        description, 
        deleteTask, 
        index, 
        modal, 
        onClickTask, 
        taskButtonsContainer
    );
    setTaskToLocalStorage(index, title, description);

    inputTitle.value = '';
    inputDescription.value = '';
}

// метод для кнопки удаления
function deleteTask(task, modal) {
    console.log(modal);

    modal.modalWindow.showModal();

    modal.buttonYes.addEventListener(
        'click', 
        () => onClickYes(modal.modalWindow, task),
        { once: true } // listener сработает один раз и удалится
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

// Метод для события нажатия на таск
function onClickTask(task, taskButtonsContainer, open) {
    if (open.isOpen) { // Если окно с кнопками открыто
        if (task == taskButtonsContainer.parentNode) { // И пользователь нажал на таск с открытым окном
            taskButtonsContainer.remove(); // то это окно закрывается
        } else { // И пользователь нажал на таск, в котором это окно не открыто
            taskButtonsContainer.remove(); // окно закрывается
            task.appendChild(taskButtonsContainer); // и добавляется к другому таску
        }
    } else { // Если окно закрыто
        task.appendChild(taskButtonsContainer); // откроется у нажатого таска
    }

    open.isOpen = !open.isOpen;
}

// function editTask(modal) {
//     modal.modalWindow.showModal();
// }