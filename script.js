
// Items
let updatedOnLoad = false;

let backlogColumn = [];
let inProgressColumn = [];
let completeColumn = [];
let onHoldColumn = [];
let columnList = [];

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
  if (localStorage.getItem('backlogColumn')) {
    backlogColumn = JSON.parse(localStorage.backlogColumn);
    inProgressColumn = JSON.parse(localStorage.inProgressColumn);
    completeColumn = JSON.parse(localStorage.completeColumn);
    onHoldColumn = JSON.parse(localStorage.onHoldColumn);
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  columnList = [backlogColumn, inProgressColumn, completeColumn, onHoldColumn];
  const storageNames = ['backlog', 'inProgress', 'complete', 'onHold'];
  storageNames.forEach((storageName, index) => {
    localStorage.setItem(`${storageName}Column`, JSON.stringify(columnList[index]));
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

function iconForCurrentTaskPriority() {
  const awesomePriorityIcon = document.querySelectorAll('.icon');

  awesomePriorityIcon.forEach((priorityElement) => {
    if (priorityElement.dataset.prio === "Low") {
      priorityElement.classList.add('fab');
      priorityElement.classList.add('fa-gripfire');
      priorityElement.classList.add('fa-2x');
      priorityElement.style.color = 'white';
    }
    if (priorityElement.dataset.prio === "Mid") {
      priorityElement.classList.add('fab');
      priorityElement.classList.add('fa-gripfire');
      priorityElement.classList.add('fa-2x');
      priorityElement.style.color = 'yellow';
    }
    if (priorityElement.dataset.prio === "ASAP") {
      priorityElement.classList.add('fab');
      priorityElement.classList.add('fa-gripfire');
      priorityElement.classList.add('fa-2x');
      priorityElement.style.color = 'red';
    }
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, index, item) {
  const listColumns = document.querySelectorAll('.drag-item-list');
  const shadowAfterBoxOpen = document.querySelector('.fullscreen');
  // List Item
  const newTaskElement = document.createElement('li');
  const liTextToCurrentTask = document.createElement('p');
  const liPriorityOnCurrentTask =document.createElement('p');

  liPriorityOnCurrentTask.dataset.prio = item.priority;
  liPriorityOnCurrentTask.classList.add('icon');
  liTextToCurrentTask.textContent = item.description;
  liTextToCurrentTask.classList.add('text');
  liTextToCurrentTask.setAttribute('ondragstart', 'drag(event)');
  newTaskElement.id = index;
  newTaskElement.dataset.worker = item.label;
  newTaskElement.dataset.prio = item.priority;
  newTaskElement.classList.add('drag-item');
  newTaskElement.draggable = true;
  newTaskElement.setAttribute('ondragstart', 'drag(event)');
  newTaskElement.addEventListener('click', function() {

      // add event and show shadow on screen
      shadowAfterBoxOpen.removeAttribute("hidden");
      shadowAfterBoxOpen.onclick = function(e) {
        if (e.target) {
          currentTaskWindow.remove();
          shadowAfterBoxOpen.setAttribute("hidden", true);
          rebuildArrays();
        }
      }

      // list item window
      const currentTaskWindow = document.createElement('div');
      currentTaskWindow.classList.add('modal');
      currentTaskWindow.classList.add('toggle-modal');

      const buttonForCloseTaskWindow = document.createElement('button');
      buttonForCloseTaskWindow.classList.add('close-x');
      buttonForCloseTaskWindow.classList.add('toggle-x');
      buttonForCloseTaskWindow.addEventListener('click', function() {
        currentTaskWindow.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      })

      const awesomeIconX = document.createElement('i');
      awesomeIconX.classList.add('far');
      awesomeIconX.classList.add('fa-times-circle');
      awesomeIconX.classList.add('fa-2x');

      const taskTextSpace = document.createElement('span');
      taskTextSpace.classList.add('add-item');
      taskTextSpace.classList.add('first-style');
      taskTextSpace.textContent = liTextToCurrentTask.textContent;
      taskTextSpace.contentEditable = true;

      //prevent empty text
      const validateWindow = document.createElement('div');
      validateWindow.classList.add('valid-window');

      const validateSpan = document.createElement('span');
      validateSpan.classList.add('valid-text');
      validateSpan.textContent = "Text Field Is Empty!";
      validateSpan.style.display = 'none';

      const actuallyClickedListElement = listColumns[column].children;
      const actuallyCreatedElementId = actuallyClickedListElement[index].id;

      const editablePriorityWindow = document.createElement('div');
      editablePriorityWindow.classList.add('editable-priority-box')

      const actuallyPriority = document.createElement('div');
      actuallyPriority.classList.add('column-select')
      const priorityStatusText = document.createElement('span');
      priorityStatusText.textContent = 'Priority: ';
      priorityStatusText.classList.add('temporary-color'); // color for this text
      const clickablePrioritySpan = document.createElement('span');
      clickablePrioritySpan.classList.add('choice-priority');

      columnList[column].forEach((listElement, index) => {

        if (parseInt(actuallyCreatedElementId) === index) {

          clickablePrioritySpan.textContent = listElement.priority;
          if (listElement.priority === "") {
            clickablePrioritySpan.textContent = "Open priority window";
          }
          if (clickablePrioritySpan.textContent === "Low") {
            clickablePrioritySpan.style.color = 'white';
          }
          if (clickablePrioritySpan.textContent === "Mid") {
            clickablePrioritySpan.style.color = 'yellow';
          }
          if (clickablePrioritySpan.textContent === "ASAP") {
            clickablePrioritySpan.style.color = 'red';
          }
        }
      })

      // create choice to priority select menu
      clickablePrioritySpan.addEventListener('click', function() {

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
              clickablePrioritySpan.textContent = "Priority is not set";
              clickablePrioritySpan.style.color = 'white';
            }
              else if (editChoice === "Low") {
              clickablePrioritySpan.textContent = "Low";
              clickablePrioritySpan.style.color = 'white';
            } else if (editChoice === "Mid") {
              clickablePrioritySpan.textContent = "Mid";
              clickablePrioritySpan.style.color = 'yellow';
            } else if (editChoice === "ASAP") {
              clickablePrioritySpan.textContent = "ASAP";
              clickablePrioritySpan.style.color = 'red';
            }
          })
        })
      })

      const labelContainer = document.createElement('div');
      labelContainer.classList.add('column-select')
      const labelInformationSpan = document.createElement('span');
      labelInformationSpan.classList.add('temporary-color'); // color for this text
      labelInformationSpan.textContent = 'Label: ';
      const responsibleObjectChoice = document.createElement('span');
      responsibleObjectChoice.classList.add('choice-user');
      responsibleObjectChoice.classList.add('temporary-color'); // color for this text
      columnList[column].forEach((listElement, index) => {
        if (parseInt(actuallyCreatedElementId) === index) {
          responsibleObjectChoice.textContent = listElement.label;
        }
      })
      console.log(labelContainer);
      const boxForButtons = document.createElement('div');
      boxForButtons.className += 'button-container';

// delete task from our list
      const deleteTaskButton = document.createElement('span');
      const saveChangesButton = document.createElement('span');
      deleteTaskButton.classList.add("interract-button");
      deleteTaskButton.classList.add('columns-submit');
      deleteTaskButton.textContent = 'Delete Task';
      deleteTaskButton.addEventListener('click', function() {
        newTaskElement.remove();
        currentTaskWindow.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      });

      // save our task after create or edited
      saveChangesButton.classList.add('interract-button');
      saveChangesButton.classList.add('columns-submit');
      saveChangesButton.textContent = 'Save Changes';
      saveChangesButton.addEventListener('click', function(e) {
        if (taskTextSpace.textContent === "") {
          validateSpan.style.display = 'block';
          setTimeout(function() {
            validateSpan.style.display = 'none';
          }, 3000);
          return
        }

        liTextToCurrentTask.textContent = taskTextSpace.textContent;
        newTaskElement.dataset.prio = clickablePrioritySpan.textContent;
        if (newTaskElement.dataset.prio === "Priority is not set") {
          newTaskElement.dataset.prio = "";
        }
        currentTaskWindow.remove();
        shadowAfterBoxOpen.setAttribute("hidden", true);
        rebuildArrays();
      })

      // append new task window to website
      buttonForCloseTaskWindow.appendChild(awesomeIconX);
      currentTaskWindow.appendChild(buttonForCloseTaskWindow);
      currentTaskWindow.appendChild(taskTextSpace);
      validateWindow.appendChild(validateSpan);
      currentTaskWindow.appendChild(validateWindow);
      actuallyPriority.append(priorityStatusText, clickablePrioritySpan);
      currentTaskWindow.appendChild(actuallyPriority);
      currentTaskWindow.appendChild(editablePriorityWindow);
      labelContainer.append(labelInformationSpan, responsibleObjectChoice);
      currentTaskWindow.appendChild(labelContainer);
      boxForButtons.append(deleteTaskButton, saveChangesButton);
      currentTaskWindow.appendChild(boxForButtons);
      columnEl.appendChild(currentTaskWindow);
  })
  // Append
  newTaskElement.appendChild(liTextToCurrentTask);
  newTaskElement.appendChild(liPriorityOnCurrentTask);
  columnEl.appendChild(newTaskElement);
  iconForCurrentTaskPriority();
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
  createElementOnCurrentColumn(backlogListEl, backlogColumn, 0);
  backlogColumn = filterArray(backlogColumn);

  // Progress Column
  createElementOnCurrentColumn(progressListEl, inProgressColumn, 1);
  inProgressColumn = filterArray(inProgressColumn);

  // Complete Column
  createElementOnCurrentColumn(completeListEl, completeColumn, 2);
  completeColumn = filterArray(completeColumn);


  // On Hold Column
  createElementOnCurrentColumn(onHoldListEl, onHoldColumn, 3);
  onHoldColumn = filterArray(onHoldColumn);

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

        const taskData = {
          label: userLabel[column].options[userLabel[column].selectedIndex].text,
          priority: priorityChoice[column].options[priorityChoice[column].selectedIndex].text,
          description: addItems[column].textContent
        };

        columnsModal[column].style.display = 'none';

        userLabel[column].selectedIndex = 0;
        priorityChoice[column].selectedIndex = 0;

        shadowAfterBoxOpen.setAttribute("hidden", true);


        const selectedStorageList = columnList[column];

        selectedStorageList.push(taskData);

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
  const taskData = {
    description: listEl.children[index].firstElementChild.textContent,
    label: listEl.children[index].dataset.worker,
    priority: listEl.children[index].dataset.prio
  }
  storageColumn.push(taskData);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  const backlogListEl = document.getElementById('backlog-list');
  const progressListEl = document.getElementById('progress-list');
  const completeListEl = document.getElementById('complete-list');
  const onHoldListEl = document.getElementById('on-hold-list');

  backlogColumn = [];
  inProgressColumn = [];
  completeColumn = [];
  onHoldColumn = [];

  for (let i = 0; i < backlogListEl.children.length; i++) {
     rebuildStorage(i, backlogColumn, backlogListEl);
  }

  for (let i = 0; i < progressListEl.children.length; i++) {
    rebuildStorage(i, inProgressColumn, progressListEl);
  }

  for (let i = 0; i < completeListEl.children.length; i++) {
    rebuildStorage(i, completeColumn,completeListEl);
  }

  for (let i = 0; i < onHoldListEl.children.length; i++) {
    rebuildStorage(i, onHoldColumn, onHoldListEl);
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

