const dragList = document.querySelector('.drag-list');

// Items
let updatedOnLoad = false;
let choosenWorker = "";
let choosenPriority = "";
let showInputBoxCounter = 0;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let backlogLabels = [];
let progressLabels = [];
let completeLabels = [];
let onHoldLabels = [];
let listLabels = [];

let backlogPrio = [];
let progressPrio = [];
let completePrio = [];
let onHoldPrio = [];
let listPrio = [];

let testColumn1 = [];
let testColumn2 = [];
let testColumn3 = [];
let testColumn4 = [];
let testList = [];

let labels = [
  {name: ""},
  {name: 'Front-end'},
  {name: 'Back-end'}
];

let priority = [
  {name: ""},
  {name: 'Low'},
  {name: 'Mid'},
  {name: 'ASAP'}
];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// lists + all columns for items
function htmlTree() {

  const columnAttributeNames = ['backlog', 'progress', 'complete', 'on-hold'];
  const columnNames = ['Backlog', 'In Progress', 'Complete', 'on Hold'];
  const mainTitle = document.querySelector('.main-title');
  const site = document.querySelector('body');
  const scripts = document.querySelectorAll('script');

  // add site shadow and hide it, for show modal event
  const fullscreenShadow = document.createElement('div');
  fullscreenShadow.classList.add('fullscreen');
  fullscreenShadow.setAttribute("hidden", true);

  site.insertBefore(fullscreenShadow, mainTitle);

  // add four column to drag-container div
  const firstColumn = document.createElement('li');
  firstColumn.classList.add('drag-column');
  firstColumn.classList.add('backlog-column');
  const secondColumn = document.createElement('li');
  secondColumn.classList.add('drag-column');
  secondColumn.classList.add('progress-column');
  const thirdColumn = document.createElement('li');
  thirdColumn.classList.add('drag-column');
  thirdColumn.classList.add('complete-column');
  const fourthColumn = document.createElement('li');
  fourthColumn.classList.add('drag-column');
  fourthColumn.classList.add('on-hold-column');

  dragList.insertBefore(fourthColumn, dragList.firstChild);
  dragList.insertBefore(thirdColumn, dragList.firstChild);
  dragList.insertBefore(secondColumn, dragList.firstChild);
  dragList.insertBefore(firstColumn, dragList.firstChild);

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

    const columnAddButton = document.createElement('div');
    columnAddButton.classList.add('add-btn-group');
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
    columnAddButton.append(addButtonBox);
    el.append(columnAddButton);

    closeButtonX.append(awesomeIconX);
    addModal.append(closeButtonX);
    addModal.append(addItemModal);
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

// Get Arrays from localStorage if available, without default value
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } if (localStorage.getItem('firstLabels')) {
    backlogLabels = JSON.parse(localStorage.firstLabels);
    progressLabels = JSON.parse(localStorage.secondLabels);
    completeLabels = JSON.parse(localStorage.thirdLabels);
    onHoldLabels = JSON.parse(localStorage.lastLabels);
  } if (localStorage.getItem('firstPrio')) {
    backlogPrio = JSON.parse(localStorage.firstPrio);
    progressPrio = JSON.parse(localStorage.secondPrio);
    completePrio = JSON.parse(localStorage.thirdPrio);
    onHoldPrio = JSON.parse(localStorage.lastPrio);
  } if (localStorage.getItem('test1')) {
    testColumn1 = JSON.parse(localStorage.test1);
    testColumn2 = JSON.parse(localStorage.test2);
    testColumn3 = JSON.parse(localStorage.test3);
    testColumn4 = JSON.parse(localStorage.test4);
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
  listLabels = [backlogLabels, progressLabels, completeLabels, onHoldLabels];
  const labelNames = ['first', 'second', 'third', 'last'];
  labelNames.forEach((labelName, index) => {
    localStorage.setItem(`${labelName}Labels`, JSON.stringify(listLabels[index]));
  });
  listPrio = [backlogPrio, progressPrio, completePrio, onHoldPrio];
  const prioNames = ['first', 'second', 'third', 'last'];
  prioNames.forEach((prioName, index) => {
    localStorage.setItem(`${prioName}Prio`, JSON.stringify(listPrio[index]));
  });
  testList = [testColumn1, testColumn2, testColumn3, testColumn4];
  const testNames = ['1', '2', '3', '4'];
  testNames.forEach((testName, index) => {
    localStorage.setItem(`test${testName}`, JSON.stringify(testList[index]));
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

function prioIcon() {
  const awesomePrioIcon = document.querySelectorAll('.icon');

  awesomePrioIcon.forEach((liPrio) => {
    if (liPrio.dataset.prio === "Low") {
      liPrio.classList.add('fab');
      liPrio.classList.add('fa-gripfire');
      liPrio.classList.add('fa-2x');
      liPrio.style.color = 'white';
    }
    if (liPrio.dataset.prio === "Mid") {
      liPrio.classList.add('fab');
      liPrio.classList.add('fa-gripfire');
      liPrio.classList.add('fa-2x');
      liPrio.style.color = 'yellow';
    }
    if (liPrio.dataset.prio === "ASAP") {
      liPrio.classList.add('fab');
      liPrio.classList.add('fa-gripfire');
      liPrio.classList.add('fa-2x');
      liPrio.style.color = 'red';
    }
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index, label, priorities) {
  let toggleButtonCounter = 0;
  const listColumns = document.querySelectorAll('.drag-item-list');
  const shadowAfterBoxOpen = document.querySelector('.fullscreen');
  // List Item
  const listEl = document.createElement('li');
  const liText = document.createElement('p');
  const liPrio =document.createElement('p');

  liPrio.dataset.prio = priorities;
  liPrio.classList.add('icon');
  liText.textContent = item;
  liText.classList.add('text');
  liText.setAttribute('ondragstart', 'drag(event)');
  listEl.id = index;
  listEl.dataset.worker = label;
  listEl.dataset.prio = priorities;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');

  listEl.addEventListener('click', function() {
    if (showInputBoxCounter === 0) {
      showInputBoxCounter++;

      // add event and show shadow on screen
      shadowAfterBoxOpen.removeAttribute("hidden");
      shadowAfterBoxOpen.onclick = function(e) {
        if (e.target) {
          toggleButtonCounter = 0;
          openTask.remove();
          shadowAfterBoxOpen.setAttribute("hidden", true);
          rebuildArrays();
        }
      }

      // list item window
      const openTask = document.createElement('div');
      openTask.classList.add('modal');
      openTask.classList.add('toggle-modal');

      const closeButtonX = document.createElement('button');
      closeButtonX.classList.add('close-x');
      closeButtonX.classList.add('toggle-x');
      closeButtonX.addEventListener('click', function() {
        toggleButtonCounter = 0;
        openTask.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      })

      const awesomeIconX = document.createElement('i');
      awesomeIconX.classList.add('far');
      awesomeIconX.classList.add('fa-times-circle');
      awesomeIconX.classList.add('fa-2x');

      const openTaskText = document.createElement('span');
      openTaskText.classList.add('add-item');
      openTaskText.classList.add('first-style');
      openTaskText.textContent = liText.textContent;
      openTaskText.contentEditable = true;

      //prevent empty text
      const validateWindow = document.createElement('div');
      validateWindow.classList.add('valid-window');

      const validateSpan = document.createElement('span');
      validateSpan.classList.add('valid-text');
      validateSpan.textContent = "Text Field Is Empty!";
      validateSpan.style.display = 'none';

      const actuallyClickedListElement = listColumns[column].children;
      const actuallyId = actuallyClickedListElement[index].id;

      const editablePriorityWindow = document.createElement('div');
      editablePriorityWindow.classList.add('editable-priority-box')

      const priorityStatus = document.createElement('div');
      priorityStatus.classList.add('column-select')
      const priorityStatusText = document.createElement('span');
      priorityStatusText.textContent = 'Priority: ';
      priorityStatusText.classList.add('temporary-color');
      const tooglePriority = document.createElement('span');
      tooglePriority.classList.add('choice-priority');
      listPrio.forEach((el, index) => {
        if (index === column) {
          el.forEach((listElement, index) => {
            if (parseInt(actuallyId) === index) {
              tooglePriority.textContent = listElement;
              if (listElement === "") {
                tooglePriority.textContent = "Open priority window";
              }
              if (tooglePriority.textContent === "Low") {
                tooglePriority.style.color = 'white';
              }
              if (tooglePriority.textContent === "Mid") {
                tooglePriority.style.color = 'yellow';
              }
              if (tooglePriority.textContent === "ASAP") {
                tooglePriority.style.color = 'red';
              }
            }
          })
        }
      })

      // create choice to priority select menu
      tooglePriority.addEventListener('click', function(e) {
        if (toggleButtonCounter !== 0) {
          return;
        }
        toggleButtonCounter++;

        const select = document.createElement('select');
        select.classList.add('priority-choice', 'select-menu');
        editablePriorityWindow.appendChild(select);

        const columnPriorityChoice = document.querySelectorAll('.priority-choice');
        const unselectable = document.createElement('option');
        unselectable.text = "Change Priority";
        unselectable.disabled = true;
        columnPriorityChoice[column].add(unselectable);
        priority.forEach(function(items) {
          if (columnPriorityChoice[column].length < 5) {
            const priorityOption = document.createElement('option');

            priorityOption.text = items.name;

            columnPriorityChoice[column].add(priorityOption);
          }
          columnPriorityChoice[column].selectedIndex = 0;
          columnPriorityChoice[column].addEventListener('change', function() {

            let editChoice = columnPriorityChoice[column].value;

            if (editChoice === "") {
              tooglePriority.textContent = "Priority is not set";
              tooglePriority.style.color = 'white';
            }
              else if (editChoice === "Low") {
              tooglePriority.textContent = "Low";
              tooglePriority.style.color = 'white';
            } else if (editChoice === "Mid") {
              tooglePriority.textContent = "Mid";
              tooglePriority.style.color = 'yellow';
            } else if (editChoice === "ASAP") {
              tooglePriority.textContent = "ASAP";
              tooglePriority.style.color = 'red';
            }
          })
        })
      })

      const responsibleUserBox = document.createElement('div');
      responsibleUserBox.classList.add('column-select')
      const responsibleUserValue = document.createElement('span');
      responsibleUserValue.classList.add('temporary-color');
      responsibleUserValue.textContent = 'Label: ';
      const responsibleObjectChoice = document.createElement('span');
      responsibleObjectChoice.classList.add('choice-user');
      responsibleObjectChoice.classList.add('temporary-color');
      listLabels.forEach((el, index) => {
        if (index === column) {
          el.forEach((listElement, index) => {
            if (parseInt(actuallyId) === index) {
              responsibleObjectChoice.textContent = listElement;
            }
          })
        }
      })

      const boxForButtons = document.createElement('div');
      boxForButtons.className += 'button-container';

// delete task from our list
      const deleteTaskButton = document.createElement('span');
      const saveChangesButton = document.createElement('span');
      deleteTaskButton.classList.add("interract-button");
      deleteTaskButton.classList.add('columns-submit');
      deleteTaskButton.textContent = 'Delete Task';
      deleteTaskButton.addEventListener('click', function() {
        listEl.remove();
        openTask.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      });

      // save our task after create or edited
      saveChangesButton.classList.add('interract-button');
      saveChangesButton.classList.add('columns-submit');
      saveChangesButton.textContent = 'Save Changes';
      saveChangesButton.addEventListener('click', function(e) {
        if (openTaskText.textContent === "") {
          validateSpan.style.display = 'block';
          setTimeout(function() {
            validateSpan.style.display = 'none';
          }, 3000);
          return
        }

        toggleButtonCounter = 0;
        liText.textContent = openTaskText.textContent;
        listEl.dataset.prio = tooglePriority.textContent;
        if (listEl.dataset.prio === "Priority is not set") {
          listEl.dataset.prio = "";
        }
        openTask.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      })

      // append new task window to website
      closeButtonX.append(awesomeIconX);
      openTask.append(closeButtonX);
      openTask.append(openTaskText);
      validateWindow.append(validateSpan);
      openTask.append(validateWindow);
      priorityStatus.append(priorityStatusText, tooglePriority);
      openTask.append(priorityStatus);
      openTask.append(editablePriorityWindow);
      responsibleUserBox.append(responsibleUserValue, responsibleObjectChoice);
      openTask.append(responsibleUserBox);
      boxForButtons.append(deleteTaskButton, saveChangesButton);
      openTask.append(boxForButtons);
      columnEl.appendChild(openTask);
    } else {
      false;
    }
  })
  // Append
  listEl.append(liText);
  listEl.append(liPrio);
  columnEl.appendChild(listEl);
  prioIcon();
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  showInputBoxCounter = 0;
  const backlogListEl = document.getElementById('backlog-list');
  const progressListEl = document.getElementById('progress-list');
  const completeListEl = document.getElementById('complete-list');
  const onHoldListEl = document.getElementById('on-hold-list');

  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogListEl.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
      createItemEl(backlogListEl, 0, backlogItem, index, backlogLabels[index], backlogPrio[index]);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index, progressLabels[index], progressPrio[index]);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeListEl.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index, completeLabels[index], completePrio[index]);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldListEl.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index, onHoldLabels[index], onHoldPrio[index]);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const listColumns = document.querySelectorAll('.drag-item-list');
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

function UserListToTask() {
  const userLabel = document.querySelectorAll('.user-label');
  const priorityChoice = document.querySelectorAll('.priority-choice');

  labels.forEach(function(item) {
    userLabel.forEach((el) => {
      const labelOption = document.createElement('option');
      if (el.length < 3) {
        labelOption.text = item.name;
        el.add(labelOption);
      }
    })
  })

  priority.forEach(function(item) {
    priorityChoice.forEach((el) => {
      const priorityOption = document.createElement('option');
      if (el.length < 4) {
        priorityOption.text = item.name;
        el.add(priorityOption);
      }
    })
  })
}

let test = {
  description: "0",
  priority: "1",
  label: "2"
};

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const addItems = document.querySelectorAll('.add-item');

  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];

  const labelText = choosenWorker;
  const selectedLabels = listLabels[column];

  const prioText = choosenPriority;
  const selectedPriority = listPrio[column];

  test.description = addItems[column].textContent;
  const selectedTestList = testList[column];

  selectedArray.push(itemText);
  selectedLabels.push(labelText);
  selectedPriority.push(prioText);
  selectedTestList.push(test);

  addItems[column].textContent = '';
  updateDOM(column);
  test ={};
}

function resetChoice() {
  const userLabel = document.querySelectorAll('.user-label');
  const priorityChoice = document.querySelectorAll('.priority-choice');

  userLabel.forEach((el) => {
    el.selectedIndex = 0;
  })
  priorityChoice.forEach((el) => {
    el.selectedIndex = 0;
  })
}

// Show Add Item Input Box
function showInputBox(column) {
  if (showInputBoxCounter === 0) {
    const columnsModal = document.querySelectorAll('.columns-modal');
    const validationText = document.querySelectorAll('.valid-text');
    const addItemTextField = document.querySelectorAll('.validate');
    const shadowAfterBoxOpen = document.querySelector('.fullscreen');

    validationText[column].style.display = 'none';
    columnsModal[column].style.display = 'flex';
    shadowAfterBoxOpen.removeAttribute("hidden");
    shadowAfterBoxOpen.onclick = function(e) {
      if (e.target) {
        shadowAfterBoxOpen.setAttribute("hidden", true);
        addItemTextField[column].textContent = "";
        columnsModal[column].style.display = 'none';
        showInputBoxCounter = 0;
        resetChoice();
      }
    }

    showInputBoxCounter++;
    UserListToTask();
  } else {
    false;
  }
}

function closeInputBox(column) {
  const columnsModal = document.querySelectorAll('.columns-modal');
  const addItemTextField = document.querySelectorAll('.validate');
  const awesomeIconX = document.querySelectorAll('.close-x');
  const shadowAfterBoxOpen = document.querySelector('.fullscreen');

  awesomeIconX.forEach((x, index) => {
    if (index === column) {
      addItemTextField[column].textContent = "";
      columnsModal[column].style.display = 'none';
      shadowAfterBoxOpen.setAttribute("hidden", true);
      showInputBoxCounter = 0;
      resetChoice();
    }
  })
}

// Hide Item Input Box
function hideInputBox(column) {
  const columnsModal = document.querySelectorAll('.columns-modal');
  const userLabel = document.querySelectorAll('.user-label');
  const priorityChoice = document.querySelectorAll('.priority-choice');
  const saveButton = document.querySelectorAll('.submit-button');
  const addItemTextField = document.querySelectorAll('.validate');
  const validationText = document.querySelectorAll('.valid-text');
  const shadowAfterBoxOpen = document.querySelector('.fullscreen');

  saveButton.forEach((el, indexing) => {
    if (indexing === column) {
      if (addItemTextField[column].textContent !== "") {
        columnsModal[column].style.display = 'none';
        userLabel.forEach((el, index) => {
          if (index === column) {
            choosenWorker = el.options[el.selectedIndex].text;
            test.label = el.options[el.selectedIndex].text;
          }
          el.selectedIndex = 0;
        })

        priorityChoice.forEach((el, index) => {
          if (index === column) {
            choosenPriority = el.options[el.selectedIndex].text;
            test.priority = el.options[el.selectedIndex].text;
          }
          el.selectedIndex = 0;
        })
        shadowAfterBoxOpen.setAttribute("hidden", true);
        addToColumn(column);
      } else {
        validationText[column].style.display = 'block';
        setTimeout(function() {
          validationText[column].style.display = 'none';
        }, 3000);
      }
    }
  })
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  const backlogListEl = document.getElementById('backlog-list');
  const progressListEl = document.getElementById('progress-list');
  const completeListEl = document.getElementById('complete-list');
  const onHoldListEl = document.getElementById('on-hold-list');

  backlogListArray = [];
  for (let i = 0; i < backlogListEl.children.length; i++) {
    backlogListArray.push(backlogListEl.children[i].firstElementChild.textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressListEl.children.length; i++) {
    progressListArray.push(progressListEl.children[i].firstElementChild.textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeListEl.children.length; i++) {
    completeListArray.push(completeListEl.children[i].firstElementChild.textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldListEl.children.length; i++) {
    onHoldListArray.push(onHoldListEl.children[i].firstElementChild.textContent);
  }

  backlogLabels = [];
  for (let i = 0; i < backlogListEl.children.length; i++) {
    backlogLabels.push(backlogListEl.children[i].dataset.worker);
  }
  progressLabels = [];
  for (let i = 0; i < progressListEl.children.length; i++) {
    progressLabels.push(progressListEl.children[i].dataset.worker);
  }
  completeLabels = [];
  for (let i = 0; i < completeListEl.children.length; i++) {
    completeLabels.push(completeListEl.children[i].dataset.worker);
  }
  onHoldLabels = [];
  for (let i = 0; i < onHoldListEl.children.length; i++) {
    onHoldLabels.push(onHoldListEl.children[i].dataset.worker);
  }

  backlogPrio = [];
  for (let i = 0; i < backlogListEl.children.length; i++) {
    backlogPrio.push(backlogListEl.children[i].dataset.prio);
  }
  progressPrio = [];
  for (let i = 0; i < progressListEl.children.length; i++) {
    progressPrio.push(progressListEl.children[i].dataset.prio);
  }
  completePrio = [];
  for (let i = 0; i < completeListEl.children.length; i++) {
    completePrio.push(completeListEl.children[i].dataset.prio);
  }
  onHoldPrio = [];
  for (let i = 0; i < onHoldListEl.children.length; i++) {
    onHoldPrio.push(onHoldListEl.children[i].dataset.prio);
  }
  updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
  const listColumns = document.querySelectorAll('.drag-item-list');
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const listColumns = document.querySelectorAll('.drag-item-list');

  const parent = listColumns[currentColumn];
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
htmlTree();
updateDOM();

