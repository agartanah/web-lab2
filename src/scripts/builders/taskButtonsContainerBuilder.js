export default function taskButtonsContainerBuilder(task) {
    const taskButtonsContainer = document.createElement('div');
    taskButtonsContainer.className = 'task-buttons-container';

    const buttonShare = document.createElement('button');
    buttonShare.className = 'share-button';

    const buttonInfo = document.createElement('button');
    buttonInfo.className = 'info-button';

    const buttonEdit = document.createElement('button');
    buttonEdit.className = 'edit-button';

    taskButtonsContainer.appendChild(buttonShare);
    taskButtonsContainer.appendChild(buttonInfo);
    taskButtonsContainer.appendChild(buttonEdit);

    return taskButtonsContainer;
}