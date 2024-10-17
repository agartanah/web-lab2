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
        const key = localStorage.key(index);
        array[index] = { key: key, value: localStorage.getItem(key) };
    }

    array.sort((a, b) => a.key - b.key); // сортировка элементов к порядку их добавления

    console.log(array);

    return array;
}

function deleteTaskFromLocalStorage(taskId) {
    localStorage.removeItem(taskId);
}

function hasKey(key) {
    return localStorage.getItem(key) !== null;
}

export { setTaskToLocalStorage, readLocalStorage, deleteTaskFromLocalStorage, hasKey };