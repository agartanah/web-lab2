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
import shareModalBuilder from './builders/shareModalBuilder.js';
import backdropBuilder from './builders/backdropBuilder.js';

// получаю объекты модальных окон
const modal = modalBuilder();
const editModal = editModalBuilder();
const shareModal = shareModalBuilder();
const backdrop = backdropBuilder(); // и фона

// здесь контейнеры для формы и списка задач
const formTaskContainer = document.getElementById('form-task-container');
const listTaskContainer = document.getElementById('list-task-container');

// вспомогательные контейнеры
const taskButtons = taskButtonsContainerBuilder(); // для кнопок таска
const noTasks = noTasksBuilder(); // для отображения нулевого списка задач

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

    // отображение уже существующих задач при запуске страницы
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

    console.log('ADD TASK');
}

let taskForModalDelete; // переменная для слушателя кнопки Да

// метод для кнопки удаления
function deleteTask(task) {
    taskForModalDelete = task;    

    modal.modalWindow.showModal();
    modal.modalWindow.addEventListener('click', onClickBackdrop);

    backdrop.classList.add('backdrop-open');

    modal.buttonYes.addEventListener(
        'click', 
        onClickYes,
        { once: true } // listener сработает один раз и удалится
    );
    modal.buttonNo.addEventListener(
        'click', 
        onClickNo,
        { once: true }
    );

    console.log('DELETE');
}

// Метод для кнопки Да
function onClickYes() {
    modal.modalWindow.close();
    // modal.buttonYes.removeEventListener('click', onClickNo);
    modal.modalWindow.removeEventListener('click', onClickBackdrop);
    
    backdrop.classList.remove('backdrop-open');

    taskForModalDelete.remove();
    deleteTaskFromLocalStorage(taskForModalDelete.id);
    
    --index;

    if (index == 0) {
        listTaskContainer.appendChild(noTasks);
    }

    console.log('YES');
}

// Метод для кнопки Нет
function onClickNo() {
    modal.modalWindow.close();
    // modal.buttonYes.removeEventListener('click', onClickYes);
    modal.modalWindow.removeEventListener('click', onClickBackdrop);
    
    backdrop.classList.remove('backdrop-open');

    console.log('NO');
}

let titleElem, descriptionElem, taskForTaskButtons; // переменные для слушателей кнопок таска

// Метод для события нажатия на таск
function onClickTask(task, title, description, open) {
    console.log('TASK');

    titleElem = title;
    descriptionElem = description;
    taskForTaskButtons = task;

    if (open.isOpen) { // Если окно с кнопками открыто
        if (task == taskButtons.taskButtonsContainer.parentNode) { // если нажат таск с открытым окном
            open.isOpen = false;

            taskButtons.taskButtonsContainer.remove(); // окно закрывается при нажатии

            // удаляются слушатели с кнопок
            taskButtons.editButton.removeEventListener('click', onClickEditButton);
            taskButtons.shareButton.removeEventListener('click', onClickShareButton);
            taskButtons.infoButton.removeEventListener('click', onClickInfoButton);

            return;
        }

        taskButtons.taskButtonsContainer.remove(); // окно закрывается при нажатии

        // удаляются слушатели с кнопок
        taskButtons.editButton.removeEventListener('click', onClickEditButton);
        taskButtons.shareButton.removeEventListener('click', onClickShareButton);
        taskButtons.infoButton.removeEventListener('click', onClickInfoButton);
    }

    // Если окно закрыто
    task.appendChild(taskButtons.taskButtonsContainer); // откроется у нажатого таска

    // Установка слушателей для кнопок таска
    taskButtons.editButton.addEventListener('click', onClickEditButton);
    taskButtons.shareButton.addEventListener('click', onClickShareButton);
    taskButtons.infoButton.addEventListener('click', onClickInfoButton);

    open.isOpen = true;
}

// Метод для кнопки редактирования таска
function onClickEditButton() {
    editModal.modalWindow.showModal();
    // слушатель для фона, чтобы при нажати закрывать модальное окно
    editModal.modalWindow.addEventListener('mousedown', onClickBackdrop);
    
    backdrop.classList.add('backdrop-open'); // отрисовка фона

    editModal.inputTitle.value = titleElem.textContent;
    editModal.inputDescription.value = descriptionElem.textContent;

    editModal.buttonCancel.addEventListener('click', onClickCancel, { once: true });
    editModal.buttonSave.addEventListener('click', onClickSave);

    console.log('EDIT');
}

// метод для кнопки Save
function onClickSave() {
    console.log('SAVE');

    const title = editModal.inputTitle.value;
    const description = editModal.inputDescription.value;

    if (title == '') {
        editModal.inputTitle.classList.add('error-value');

        return;
    }
    editModal.inputTitle.classList.remove('error-value');

    titleElem.textContent = title;
    descriptionElem.textContent = description;

    setTaskToLocalStorage(taskForTaskButtons.id, title, description); // обновляю значения в localstorage

    editModal.modalWindow.close();
    editModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // editModal.buttonCancel.removeEventListener('click', onClickCancel);
    // editModal.buttonSave.removeEventListener('click', onClickSave);
    
    backdrop.classList.remove('backdrop-open');
}

// метод для кнопки Cancel
function onClickCancel() {
    editModal.modalWindow.close();
    editModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // editModal.buttonCancel.removeEventListener('click', onClickCancel);
    // editModal.buttonSave.removeEventListener('click', onClickSave);
    
    backdrop.classList.remove('backdrop-open');
    editModal.inputTitle.classList.remove('error-value');

    console.log('CANCEL');
}

function onClickShareButton() {
    shareModal.modalWindow.showModal();
    // слушатель для фона, чтобы при нажати закрывать модальное окно
    shareModal.modalWindow.addEventListener('click', onClickBackdrop);
    
    backdrop.classList.add('backdrop-open'); // отрисовка фона

    shareModal.buttonCopy.addEventListener('click', onClickCopy, { once: true });
    shareModal.buttonVk.addEventListener('click', onClickVk, { once: true });
    shareModal.buttonTelegram.addEventListener('click', onClickTelegram, { once: true });
    shareModal.buttonWhatsup.addEventListener('click', onClickWhatsup, { once: true });
    shareModal.buttonFacebook.addEventListener('click', onClickFacebook, { once: true });

    console.log('SHARE');
}

function onClickCopy(event) {
    event.stopPropagation();

    navigator.clipboard.writeText(
        `Title: ${ titleElem.textContent }
        Description: ${ descriptionElem.textContent }`
    ); // скопировать данные таска в буфер

    shareModal.modalWindow.close(); 
    shareModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
    // shareModal.buttonVk.removeEventListener('click', onClickVk);
    // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
    // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
    // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

    backdrop.classList.remove('backdrop-open'); 

    console.log('COPY');
}

function onClickVk(event) {
    event.stopPropagation();
        
    // код для поделиться в вк
    
    shareModal.modalWindow.close(); 
    shareModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
    // shareModal.buttonVk.removeEventListener('click', onClickVk);
    // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
    // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
    // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

    backdrop.classList.remove('backdrop-open'); 

    console.log('VK');
}

function onClickTelegram(event) {
    event.stopPropagation();
        
    // код для поделиться в телеграме

    shareModal.modalWindow.close(); 
    shareModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
    // shareModal.buttonVk.removeEventListener('click', onClickVk);
    // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
    // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
    // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

    backdrop.classList.remove('backdrop-open');

    console.log('TG');
}

function onClickWhatsup(event) {
    event.stopPropagation();
        
    // код для поделиться в ватс апе

    shareModal.modalWindow.close(); 
    shareModal.modalWindow.removeEventListener('click', onClickBackdrop); 
    // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
    // shareModal.buttonVk.removeEventListener('click', onClickVk);
    // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
    // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
    // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

    backdrop.classList.remove('backdrop-open');
   
    console.log('WUP');
}

function onClickFacebook(event) {
    event.stopPropagation();
        
    // код для поделиться в фэйсбуке

    shareModal.modalWindow.close(); 
    shareModal.modalWindow.removeEventListener('click', onClickBackdrop);
    // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
    // shareModal.buttonVk.removeEventListener('click', onClickVk);
    // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
    // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
    // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

    backdrop.classList.remove('backdrop-open');

    console.log('FBOK');
}

function onClickBackdrop(event) {
    if (event.target == shareModal.modalWindow && event.target != shareModal.modalContent) {
        shareModal.modalWindow.close();
        shareModal.modalWindow.removeEventListener('click', onClickBackdrop);
        // shareModal.buttonCopy.removeEventListener('click', onClickCopy);
        // shareModal.buttonVk.removeEventListener('click', onClickVk);
        // shareModal.buttonTelegram.removeEventListener('click', onClickTelegram);
        // shareModal.buttonWhatsup.removeEventListener('click', onClickWhatsup);
        // shareModal.buttonFacebook.removeEventListener('click', onClickFacebook);

        backdrop.classList.remove('backdrop-open');

        console.log('BDR-SHARE');
    } else if (event.target == editModal.modalWindow && 
        (event.target != editModal.modalContent &&
        event.target != editModal.inputTitle &&
        event.target != editModal.inputDescription)) {
        editModal.modalWindow.close();
        editModal.modalWindow.removeEventListener('mousedown', onClickBackdrop);
        // editModal.buttonCancel.removeEventListener('click', onClickCancel);
        // editModal.buttonSave.removeEventListener('click', onClickSave);
        
        backdrop.classList.remove('backdrop-open');
        editModal.inputTitle.classList.remove('error-value');

        console.log("BDR-EDIT");
    } else if (event.target == modal.modalWindow && event.target != modal.modalContent) {
        modal.modalWindow.close();
        modal.modalWindow.removeEventListener('click', onClickBackdrop);
        
        backdrop.classList.remove('backdrop-open');

        console.log('BDR-DEL');
    }
}

function onClickInfoButton() {
    console.log('INFO');

    if (titleElem.classList.contains('task-title-extend')) {
        titleElem.classList.remove('task-title-extend');
    } else {
        titleElem.classList.add('task-title-extend');
    }

    if (descriptionElem.classList.contains('task-description-extend')) {
        descriptionElem.classList.remove('task-description-extend');
    } else {
        descriptionElem.classList.add('task-description-extend');
    }
}