import formBuilder from './builders/formBuilder.js'
import taskBuilder from './builders/taskBuilder.js';
import { 
    setTaskToLocalStorage, 
    readLocalStorage,
    deleteTaskFromLocalStorage 
} from './data/storage/localStorage.js';

const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');
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
    
    const title = inputTitle.value;
    const description = inputDescription.value;

    if (title == '') {
        return;
    }

    if (description == '') {
        inputDescription.value = 'No content';
    }

    ++index;
    taskBuilder(listTaskContainer, title, description, deleteTask, index);
    setTaskToLocalStorage(index, title, description);

    inputTitle.value = '';
    inputDescription.value = '';
}

function deleteTask(task) {
    task.remove();
    deleteTaskFromLocalStorage(task.id);

    --index;
}


