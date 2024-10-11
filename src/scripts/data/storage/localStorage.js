function setTaskToLocalStorage(taskId, taskTitle, taskDescription) {
    localStorage.setItem(taskId, JSON.stringify({
        title: taskTitle,
        description: taskDescription
    }));
}

function readLocalStorage() {
    let array = [];

    console.log(localStorage.length);

    for (let index = 0; index < localStorage.length; ++index) {
        array[index] = localStorage.getItem(index + 1);
        console.log(array[index]);
    }

    return array;
}

function deleteTaskFromLocalStorage(taskId) {
    localStorage.removeItem(taskId);
}

export { setTaskToLocalStorage, readLocalStorage, deleteTaskFromLocalStorage };