const pathToImg = '/src/images/no-tasks.svg'

export default function noTasksBuilder() {
    const imgNoTasks = document.createElement('img');
    imgNoTasks.src = pathToImg;
    imgNoTasks.className = 'no-tasks';

    return imgNoTasks;
}