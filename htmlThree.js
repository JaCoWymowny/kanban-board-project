const dragList = document.querySelector('.drag-list');

// lists + all columns for items
function htmlTree() {

  const mainTitle = document.querySelector('.main-title');
  const site = document.querySelector('body');

  // add site shadow and hide it, for show modal event
  const fullscreenShadow = document.createElement('div');
  fullscreenShadow.classList.add('fullscreen');
  fullscreenShadow.setAttribute("hidden", true);

  site.insertBefore(fullscreenShadow, mainTitle);

  // add four column to drag-container div
  const firstColumn = document.createElement('li');
  allColumnAttribute(firstColumn, `drag-column`, `backlog-column`, 0);

  const secondColumn = document.createElement('li');
  allColumnAttribute(secondColumn, `drag-column`, `progress-column`, 1);

  const thirdColumn = document.createElement('li');
  allColumnAttribute(thirdColumn, `drag-column`, `complete-column`, 2);

  const fourthColumn = document.createElement('li');
  allColumnAttribute(fourthColumn, `drag-column`, `on-hold-column`, 3);


  dragList.insertBefore(fourthColumn, dragList.firstChild);
  dragList.insertBefore(thirdColumn, dragList.firstChild);
  dragList.insertBefore(secondColumn, dragList.firstChild);
  dragList.insertBefore(firstColumn, dragList.firstChild);

  htmlTreeBranches();
}

function htmlTreeBranches() {

  const columnAttributeNames = ['backlog', 'progress', 'complete', 'on-hold'];
  const columnNames = ['Backlog', 'In Progress', 'Complete', 'on Hold'];
  const allColumnLi = document.querySelectorAll('.drag-column');

  allColumnLi.forEach((el, index) => {
    const spanHeader = document.createElement('span');
    spanHeader.classList.add('header');
    const header = document.createElement('h1');
    header.textContent = columnNames[index];

    const columnContent = document.createElement('div');
    columnContent.id = columnAttributeNames[index] + '-content';
    columnContent.classList.add('custom-scroll');
    const columnContentList = document.createElement('ul');
    columnContentList.classList.add('drag-item-list')
    columnContentList.id = columnAttributeNames[index] + '-list';
    columnContentList.setAttribute('ondrop', `drop(event)`);
    columnContentList.setAttribute('ondragover', `allowDrop(event)`);
    columnContentList.setAttribute('ondragenter', `dragEnter(${index})`);

    const addToColumnButton = document.createElement('div');
    addToColumnButton.classList.add('add-btn-group');
    const addButtonBox = document.createElement('div');
    addButtonBox.classList.add('add-btn');
    addButtonBox.setAttribute('onclick', `showInputBox(${index})`);
    const plusSpan = document.createElement('span');
    plusSpan.classList.add('plus-sign');
    plusSpan.textContent = '+';
    const plusText = document.createElement('span');
    plusText.textContent = 'Add Item';

    const addModal = document.createElement('div');
    addModal.classList.add('modal');
    addModal.classList.add('columns-modal');

    const closeButtonX = document.createElement('button');
    closeButtonX.classList.add('close-x');
    closeButtonX.setAttribute('onclick', `closeInputBox(${index})`);
    const awesomeIconX = document.createElement('i');
    awesomeIconX.classList.add('far');
    awesomeIconX.classList.add('fa-times-circle');
    awesomeIconX.classList.add('fa-2x');

    const tittleContainer = containerForTittleElement(document);
    const firstModalSpecification = addSpecificationToModal(document, `Tittle`);
    const tittleWindow = addTittleToModal(document);

    const taskTextContainer = document.createElement(`div`);
    taskTextContainer.classList.add(`text-container`);
    const secondModalSpecification = addSpecificationToModal(document, `Task Specification:`);
    const addItemModal = document.createElement('span');
    addItemModal.classList.add('add-item');
    addItemModal.classList.add('validate');
    addItemModal.contentEditable = true;

    const validateWindow = document.createElement('div');
    validateWindow.classList.add('valid-window');

    const validateSpan = document.createElement('span');
    validateSpan.classList.add('valid-text');
    validateSpan.textContent = "Text Field Is Empty!";

    const modalSelectBoxPriority = document.createElement('div');
    modalSelectBoxPriority.classList.add('select-box');
    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = 'Priority: ';
    const selectPrio = document.createElement('select');
    selectPrio.classList.add('priority-choice');
    selectPrio.classList.add('select-menu');

    const modalSelectBoxUser = document.createElement('div');
    modalSelectBoxUser.classList.add('select-box');
    const userSpan = document.createElement('span');
    userSpan.textContent = 'User: ';
    const selectUser = document.createElement('select');
    selectUser.classList.add('user-label');
    selectUser.classList.add('select-menu');

    const siteButton = document.createElement('span');
    siteButton.classList.add('columns-submit');
    siteButton.classList.add('submit-button');
    siteButton.setAttribute('onclick', `hideInputBox(${index})`);
    siteButton.textContent = 'Save task !';

    spanHeader.append(header);
    el.append(spanHeader);
    columnContent.append(columnContentList);
    el.append(columnContent);
    addButtonBox.append(plusSpan, plusText);
    addToColumnButton.append(addButtonBox);
    el.append(addToColumnButton);

    closeButtonX.append(awesomeIconX);
    addModal.append(closeButtonX);
    tittleContainer.append(firstModalSpecification, tittleWindow);
    addModal.appendChild(tittleContainer);
    taskTextContainer.append(secondModalSpecification, addItemModal);
    addModal.append(taskTextContainer);
    validateWindow.append(validateSpan);
    addModal.append(validateWindow);
    modalSelectBoxPriority.append(prioritySpan, selectPrio);
    addModal.append(modalSelectBoxPriority);
    modalSelectBoxUser.append(userSpan, selectUser);
    addModal.append(modalSelectBoxUser);
    addModal.append(modalSelectBoxPriority);
    addModal.append(siteButton);
    el.append(addModal);
  })
}