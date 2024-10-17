import formBuilder from './builders/formBuilder.js';
import taskBuilder from './builders/taskBuilder.js';
import modalBuilder from './builders/modalBuilder.js';
import taskButtonsContainerBuilder from './builders/taskButtonsContainerBuilder.js';
import { 
    setTaskToLocalStorage, 
    readLocalStorage,
    deleteTaskFromLocalStorage,
    hasKey
} from './data/storage/localStorage.js';
import editModalBuilder from './builders/editModalBuilder.js';
import noTasksBuilder from './builders/noTasksBuilder.js';

const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');

const taskButtons = taskButtonsContainerBuilder();
const modal = modalBuilder();
const editModal = editModalBuilder();
const noTasks = noTasksBuilder();

let index = 0;

// заполнение страницы данными (если они есть в local-storage)
document.addEventListener('DOMContentLoaded', function() {
    formBuilder(formTaskContainer, addTask);

    const localStorageElements = readLocalStorage();
    console.log(localStorageElements);

    if (localStorageElements.length == 0) {
        listTaskContainer.appendChild(noTasks);

        return;
    }

    // localStorageElements.map(task => JSON.parse(task));

    console.log(localStorageElements);

    for (let indexElem = 0; indexElem < localStorageElements.length; ++indexElem) {
        let { title, description } = JSON.parse(localStorageElements[indexElem].value);

        addTaskFromLocalStorage({ 
            id: localStorageElements[indexElem].key,
            title: title,
            description: description 
        });
    }
});

function addTaskFromLocalStorage(task) {
    ++index;
    console.log(index);

    taskBuilder(
        listTaskContainer, 
        task.title, 
        task.description, 
        task.id,
        deleteTask, 
        onClickTask
    );
}

// метод для кнопки добавления таска
function addTask(inputTitle, inputDescription) {
    let title = inputTitle.value;
    let description = inputDescription.value;

    if (title == '') {
        inputTitle.className += ' error-value';

        return;
    } else {
        inputTitle.className = 'input-task';
    }

    if (description == '') {
        description = 'Нет описания';
    }

    ++index;

    const prevIndex = index;

    // Сложно объяснить зачем это, но я постараюсь:
    // когда удаляется элемент удаляется и его ключ, из-за чего возникают коллизии,
    // и при создании нового элемента затирается старый, так как последний элемент
    // имеет ключ 5, например, а после удаления элемента, например 3, их остаётся 4 (штуки), 
    // а ключ у последнего элемента всё также 5-ый.
    // И когда после этого пытается добавиться элемент под индексом 5, у него это не получиться,
    // так как такой ключ уже существует. Значит есть доступный ключ меньшего значения: именно поэтому
    // я начинаю двигаться назад по индексу, чтобы найти индекс ранее затёртого элемента (или элементов, тогда
    // они будут заполняться в обратном порядке), в нашем случае 3, и добавить новый элемент именно
    // по этому индексу.
    // Не понятно получислось наверное, но как-то так ^_^
    while(hasKey(index)) {
        --index;
    }

    noTasks.remove();

    taskBuilder(
        listTaskContainer, 
        title, 
        description, 
        index,
        deleteTask, 
        onClickTask
    );
    setTaskToLocalStorage(index, title, description);

    index = prevIndex;

    inputTitle.value = '';
    inputDescription.value = '';
}

let taskForModalDelete; // переменная для слушателя кнопки Да

// метод для кнопки удаления
function deleteTask(task) {
    taskForModalDelete = task;    

    modal.modalWindow.showModal();

    modal.buttonYes.addEventListener(
        'click', 
        onClickYes,
        { once: true } // listener сработает один раз и удалится
    );
    modal.buttonNo.addEventListener(
        'click', 
        onClickNo,
        { once: true }
    )
}

// Метод для кнопки Да
function onClickYes() {
    modal.modalWindow.close();
    modal.buttonYes.removeEventListener('click', onClickYes);

    taskForModalDelete.remove();
    deleteTaskFromLocalStorage(taskForModalDelete.id);
    
    --index;

    if (index == 0) {
        listTaskContainer.appendChild(noTasks);
    }
    console.log(index);
}

// Метод для кнопки Нет
function onClickNo() {
    modal.modalWindow.close();
    modal.buttonYes.removeEventListener('click', onClickYes);
}

let titleElem, descriptionElem, taskForTaskButtons; // переменные для слушателей таска

// Метод для события нажатия на таск
function onClickTask(task, title, description, open) {
    titleElem = title;
    descriptionElem = description;
    taskForTaskButtons = task;

    if (open.isOpen) { // Если окно с кнопками открыто
        if (task == taskButtons.taskButtonsContainer.parentNode) { // если нажат таск с открытым окном
            open.isOpen = false;

            taskButtons.taskButtonsContainer.remove(); // окно закрывается при нажатии

            // удаляются слушатели с кнопок
            taskButtons.editButton.removeEventListener('click', onClickEditButton);

            return;
        }

        taskButtons.taskButtonsContainer.remove(); // окно закрывается при нажатии
        taskButtons.editButton.removeEventListener('click', onClickEditButton);
    }

    // Если окно закрыто
    task.appendChild(taskButtons.taskButtonsContainer); // откроется у нажатого таска

    // Установка слушателей для кнопок таска
    taskButtons.editButton.addEventListener('click', onClickEditButton);

    open.isOpen = true;
}

function onClickEditButton() {
    editModal.modalWindow.showModal();
    
    editModal.inputTitle.value = titleElem.textContent;
    editModal.inputDescription.value = descriptionElem.textContent;

    editModal.buttonCancel.addEventListener('click', () => {
        editModal.modalWindow.close();
    }, { once: true });

    editModal.buttonSave.addEventListener('click', () => {
        const title = editModal.inputTitle.value;
        const description = editModal.inputDescription.value;

        if (title == '') {
            editModal.inputTitle.className += ' error-value';

            return;
        }

        titleElem.textContent = title;
        descriptionElem.textContent = description;

        setTaskToLocalStorage(taskForTaskButtons.id, title, description); // обновляю значения в localstorage

        editModal.modalWindow.close();
    }, { once: true });
}