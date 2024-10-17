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

// localStorage.clear();

const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');

const taskButtons = taskButtonsContainerBuilder();
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
        let { title, description } = JSON.parse(localStorageElements[indexElem].value);
        console.log(title);
        console.log(description);

        addTaskFromLocalStorage({ 
            id: localStorageElements[indexElem].key,
            title: title,
            description: description 
        }
        );
    }
});

function addTaskFromLocalStorage(task) {
    ++index;
    console.log(index);

    taskBuilder(
        listTaskContainer, 
        task.title, 
        task.description, 
        deleteTask, 
        task.id, 
        modal, 
        onClickTask, 
        taskButtons,
        editModal
    );
}

// метод для кнопки добавления таска
function addTask(inputTitle, inputDescription) {
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
    // как-то так ^_^
    while(hasKey(index)) {
        --index;
    }

    console.log(index);

    taskBuilder(
        listTaskContainer, 
        title, 
        description, 
        deleteTask, 
        index, 
        modal, 
        onClickTask, 
        taskButtons,
        editModal
    );
    setTaskToLocalStorage(index, title, description);

    index = prevIndex;

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
    console.log(task.id);
    deleteTaskFromLocalStorage(task.id);

    --index;
    console.log(index);
}

// Метод для кнопки Нет
function onClickNo(modal) {
    modal.close();
}

// Метод для события нажатия на таск
function onClickTask(task, taskButtons, editModal, open) {
    if (open.isOpen) { // Если окно с кнопками открыто
        if (task == taskButtons.taskButtonsContainer.parentNode) { // И пользователь нажал на таск с открытым окном
            taskButtons.taskButtonsContainer.remove(); // то это окно закрывается
            taskButtons.taskButtonsContainer = taskButtons.taskButtonsContainer.cloneNode(true);
        } else { // И пользователь нажал на таск, в котором это окно не открыто
            taskButtons.taskButtonsContainer.remove(); // окно закрывается
            taskButtons.taskButtonsContainer = taskButtons.taskButtonsContainer.cloneNode(true);
            task.appendChild(taskButtonsContainer); // и добавляется к другому таску
        }
    } else { // Если окно закрыто
        task.appendChild(taskButtons.taskButtonsContainer); // откроется у нажатого таска

        taskButtons.editButton.addEventListener('click', () => { // Устанавливаются слушатели на кнопки таска
            editModal.modalWindow.showModal();
            
            editModal.buttonCancel.addEventListener('click', () => {
                editModal.modalWindow.close();
            }, { once: true });
        });
    }

    open.isOpen = !open.isOpen;
}

// function editTask(modal) {
//     modal.modalWindow.showModal();
// }