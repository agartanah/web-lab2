let open = { isOpen: false };

//
// Принимает 1. контейнер списка задач; 2. название; 3. описание;
// 4. метод для слушателя кнопки удаления 5. id задачи
// 6. объект с модальным окном, кнопками Да и Нет.
//
export default function taskBuilder(
    listTaskContainer, 
    titleTask, 
    descriptionTask, 
    deleteTask, 
    taskId, 
    modal,
    onClickTask,
    taskButtonsContainer
) {
    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';
    taskContainer.id = taskId;

    const task = document.createElement('div');
    task.className = 'task';
    task.addEventListener('click', () => onClickTask(
        taskContainer, 
        taskButtonsContainer, 
        open
    ));

    const taskText = document.createElement('div');
    taskText.className = 'task-text';

    const pTitle = document.createElement('p');
    pTitle.className = 'task-title';
    pTitle.textContent = titleTask;

    const pDescription = document.createElement('p');
    pDescription.className = 'task-description';
    pDescription.textContent = descriptionTask;

    taskText.appendChild(pTitle);
    taskText.appendChild(pDescription);

    const dellTaskButtonContainer = document.createElement('div');
    dellTaskButtonContainer.className = 'dell-task-button-container';

    const dellButton = document.createElement('button');
    dellButton.className = 'dell-button';
    dellButton.addEventListener('click', (event) => {
        deleteTask(taskContainer, modal);
        event.stopPropagation();
    });

    dellTaskButtonContainer.appendChild(dellButton);

    task.appendChild(taskText);
    task.appendChild(dellTaskButtonContainer);

    taskContainer.appendChild(task);
    listTaskContainer.insertBefore(taskContainer, listTaskContainer.firstChild);
}