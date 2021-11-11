
// HTML TREE
const allColumnAttribute = (element, drag, column, number) => {
    element.classList.add(drag);
    element.classList.add(column);
    element.setAttribute(`id`, `${number}`);
}

// color and icon for created task after load and save changes
const addIconsStyles = (element, color) => {
    element.classList.add('fab');
    element.classList.add('fa-gripfire');
    element.classList.add('fa-2x');
    element.style.color = color;
}

// helper for updateDOM function
const createElementOnCurrentColumn = (listEl, storageColumn, column) => {
    listEl.textContent = '';
    storageColumn.forEach((item, index) => {
        createItemEl(listEl, column, index, item);
    });
}

// helper for rebuildArray after save changes
const rebuildStorage = (index, storageColumn, listEl) => {
    const taskData = {
        description: listEl.children[index].lastElementChild.textContent,
        label: listEl.children[index].dataset.worker,
        priority: listEl.children[index].dataset.prio,
        tittle: listEl.children[index].firstElementChild.textContent
    }
    storageColumn.push(taskData);
}

// add attribute to newly created task
const addAttributesToTask = (element, taskAttributes) => {
    element.id = taskAttributes.id;
    element.dataset.worker = taskAttributes.label;
    element.dataset.prio = taskAttributes.priority;
    element.classList.add(taskAttributes.newClass);
    element.draggable = taskAttributes.dragging;
    element.dataset.tittle = taskAttributes.tittle;
    element.setAttribute(`ondragstart`, `drag(event)`);
}

//create save and delete button after open curren task
const createTaskButton = (element, firstClass, secondClass, text) => {
    element.classList.add(firstClass);
    element.classList.add(secondClass);
    element.textContent = text;
}

const createXIcon = (document) => {
    const icon = document.createElement(`i`);
    icon.classList.add(`far`);
    icon.classList.add(`fa-times-circle`);
    icon.classList.add(`fa-2x`);
    return icon
}

const containerForTittleElement = (document) => {
    const container = document.createElement(`div`);
    container.classList.add(`tittle-container`);
    return container
}

const addTittleToModal = (document, task) => {
    const tittle = document.createElement('span');
    tittle.classList.add('tittle-window');
    tittle.classList.add('first-style');
    tittle.contentEditable = true;
    tittle.textContent = task;
    return tittle
}

const addSpecificationToModal = (document,content) => {
    const text = document.createElement('span');
    text.classList.add(`first-style`);
    text.textContent = content;
    return text
}



