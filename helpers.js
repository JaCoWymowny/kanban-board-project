
// HTML TREE
function allColumnAttribute(element, drag, column, number) {
    element.classList.add(drag);
    element.classList.add(column);
    element.setAttribute(`id`, `${number}`);
}

// color and icon for created task after load and save changes
function addIconsStyles(element, color) {
    element.classList.add('fab');
    element.classList.add('fa-gripfire');
    element.classList.add('fa-2x');
    element.style.color = color;
}

// helper for updateDOM function
function createElementOnCurrentColumn(listEl, storageColumn, column) {
    listEl.textContent = '';
    storageColumn.forEach((item, index) => {
        createItemEl(listEl, column, index, item);
    });
}

// helper for rebuildArray after save changes
function rebuildStorage(index, storageColumn, listEl) {
    const taskData = {
        description: listEl.children[index].firstElementChild.textContent,
        label: listEl.children[index].dataset.worker,
        priority: listEl.children[index].dataset.prio
    }
    storageColumn.push(taskData);
}

// add attribute to newly created task
function addAttributesToTask(element, taskAttributes) {
    element.id = taskAttributes.id;
    element.dataset.worker = taskAttributes.label;
    element.dataset.prio = taskAttributes.priority;
    element.classList.add(taskAttributes.newClass);
    element.draggable = taskAttributes.dragging;
    element.setAttribute(`ondragstart`, `drag(event)`);
}

//create save and delete button after open curren task
function createTaskButton(element, firstClass, secondClass, text) {
    element.classList.add(firstClass);
    element.classList.add(secondClass);
    element.textContent = text;
}

// create x icon to create item
function createXIcon(document) {
    const icon = document.createElement(`i`);
    icon.classList.add(`far`);
    icon.classList.add(`fa-times-circle`);
    icon.classList.add(`fa-2x`);
    return icon
}

function containerForTittleElement(document) {
    const container = document.createElement(`div`);
    container.classList.add(`tittle-container`);
    return container
}

function addTittleToModal(document) {
    const tittle = document.createElement('span');
    tittle.classList.add('tittle-window');
    tittle.classList.add('first-style');
    tittle.contentEditable = true;
    return tittle
}

function addSpecificationToModal(document,content) {
    const text = document.createElement('span');
    text.classList.add(`first-style`);
    text.textContent = content;
    return text
}



