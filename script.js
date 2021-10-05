
// Items
let updatedOnLoad = false;

let storageColumn1 = [];
let storageColumn2 = [];
let storageColumn3 = [];
let storageColumn4 = [];
let storageList = [];

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



// Get Arrays from localStorage if available, without default value
function getSavedColumns() {
  if (localStorage.getItem('storage1')) {
    storageColumn1 = JSON.parse(localStorage.storage1);
    storageColumn2 = JSON.parse(localStorage.storage2);
    storageColumn3 = JSON.parse(localStorage.storage3);
    storageColumn4 = JSON.parse(localStorage.storage4);
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  storageList = [storageColumn1, storageColumn2, storageColumn3, storageColumn4];
  const storageNames = ['1', '2', '3', '4'];
  storageNames.forEach((storageName, index) => {
    localStorage.setItem(`storage${storageName}`, JSON.stringify(storageList[index]));
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
function createItemEl(columnEl, column, index, item) {
  const listColumns = document.querySelectorAll('.drag-item-list');
  const shadowAfterBoxOpen = document.querySelector('.fullscreen');
  // List Item
  const listEl = document.createElement('li');
  const liText = document.createElement('p');
  const liPrio =document.createElement('p');

  liPrio.dataset.prio = item.priority;
  liPrio.classList.add('icon');
  liText.textContent = item.description;
  liText.classList.add('text');
  liText.setAttribute('ondragstart', 'drag(event)');
  listEl.id = index;
  listEl.dataset.worker = item.label;
  listEl.dataset.prio = item.priority;
  listEl.classList.add('drag-item');
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.addEventListener('click', function() {

      // add event and show shadow on screen
      shadowAfterBoxOpen.removeAttribute("hidden");
      shadowAfterBoxOpen.onclick = function(e) {
        if (e.target) {
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

      storageList[column].forEach((listElement, index) => {

        if (parseInt(actuallyId) === index) {

          tooglePriority.textContent = listElement.priority;
          if (listElement.priority === "") {
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

      // create choice to priority select menu
      tooglePriority.addEventListener('click', function() {

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
      storageList[column].forEach((listElement, index) => {
        if (parseInt(actuallyId) === index) {
          responsibleObjectChoice.textContent = listElement.label;
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
      closeButtonX.appendChild(awesomeIconX);
      openTask.appendChild(closeButtonX);
      openTask.appendChild(openTaskText);
      validateWindow.appendChild(validateSpan);
      openTask.appendChild(validateWindow);
      priorityStatus.append(priorityStatusText, tooglePriority);
      openTask.appendChild(priorityStatus);
      openTask.appendChild(editablePriorityWindow);
      responsibleUserBox.append(responsibleUserValue, responsibleObjectChoice);
      openTask.appendChild(responsibleUserBox);
      boxForButtons.append(deleteTaskButton, saveChangesButton);
      openTask.appendChild(boxForButtons);
      columnEl.appendChild(openTask);
  })
  // Append
  listEl.appendChild(liText);
  listEl.appendChild(liPrio);
  columnEl.appendChild(listEl);
  prioIcon();
}

function createElementOnCurrentColumn(listEl, storageColumn, column) {
  listEl.textContent = '';
  storageColumn.forEach((item, index) => {
    createItemEl(listEl, column, index, item);
  });
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  const backlogListEl = document.getElementById('backlog-list');
  const progressListEl = document.getElementById('progress-list');
  const completeListEl = document.getElementById('complete-list');
  const onHoldListEl = document.getElementById('on-hold-list');

  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  createElementOnCurrentColumn(backlogListEl, storageColumn1, 0);
  storageColumn1 = filterArray(storageColumn1);

  // Progress Column
  createElementOnCurrentColumn(progressListEl, storageColumn2, 1);
  storageColumn2 = filterArray(storageColumn2);

  // Complete Column
  createElementOnCurrentColumn(completeListEl, storageColumn3, 2);
  storageColumn3 = filterArray(storageColumn3);


  // On Hold Column
  createElementOnCurrentColumn(onHoldListEl, storageColumn4, 3);
  storageColumn4 = filterArray(storageColumn4);

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

function UserListToTask(column) {
  const userLabel = document.querySelectorAll('.user-label');
  const priorityChoice = document.querySelectorAll('.priority-choice');

  labels.forEach(function(item) {
      if (userLabel[column].length < 3) {
        const labelOption = document.createElement('option');
        labelOption.text = item.name;
        userLabel[column].add(labelOption);
      }
  })

  priority.forEach(function(item) {
      if (priorityChoice[column].length < 4) {
        const priorityOption = document.createElement('option');
        priorityOption.text = item.name;
        priorityChoice[column].add(priorityOption);
      }
  })
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
        resetChoice();
      }
    }
    UserListToTask(column);
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
      resetChoice();
    }
  })
}

// Hide Item Input Box
function hideInputBox(column) {
  const addItems = document.querySelectorAll('.add-item');
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

        const storage = {
          label: userLabel[column].options[userLabel[column].selectedIndex].text,
          priority: priorityChoice[column].options[priorityChoice[column].selectedIndex].text,
          description: addItems[column].textContent
        };

        columnsModal[column].style.display = 'none';

        userLabel[column].selectedIndex = 0;
        priorityChoice[column].selectedIndex = 0;

        shadowAfterBoxOpen.setAttribute("hidden", true);


        const selectedStorageList = storageList[column];

        selectedStorageList.push(storage);

        addItems[column].textContent = '';

        updateDOM();
      } else {
        validationText[column].style.display = 'block';
        setTimeout(function() {
          validationText[column].style.display = 'none';
        }, 3000);
      }
    }
  })
}

function rebuildStorage(index, storageColumn, listEl) {
  const storage = {
    description: listEl.children[index].firstElementChild.textContent,
    label: listEl.children[index].dataset.worker,
    priority: listEl.children[index].dataset.prio
  }
  storageColumn.push(storage);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  const backlogListEl = document.getElementById('backlog-list');
  const progressListEl = document.getElementById('progress-list');
  const completeListEl = document.getElementById('complete-list');
  const onHoldListEl = document.getElementById('on-hold-list');

  storageColumn1 = [];
  storageColumn2 = [];
  storageColumn3 = [];
  storageColumn4 = [];

  for (let i = 0; i < backlogListEl.children.length; i++) {
     rebuildStorage(i, storageColumn1, backlogListEl);
  }

  for (let i = 0; i < progressListEl.children.length; i++) {
    rebuildStorage(i, storageColumn2, progressListEl);
  }

  for (let i = 0; i < completeListEl.children.length; i++) {
    rebuildStorage(i, storageColumn3,completeListEl);
  }

  for (let i = 0; i < onHoldListEl.children.length; i++) {
    rebuildStorage(i, storageColumn4, onHoldListEl);
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

