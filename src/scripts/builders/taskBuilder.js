export default function taskBuilder(listTaskContainer, titleTask, descriptionTask, deleteTask, taskId) {
    const task = document.createElement('div');
    task.className = 'task';
    task.id = taskId;

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
    dellButton.addEventListener('click', () => deleteTask(task));

    dellTaskButtonContainer.appendChild(dellButton);

    task.appendChild(taskText);
    task.appendChild(dellTaskButtonContainer);

    listTaskContainer.insertBefore(task, listTaskContainer.firstChild);
}