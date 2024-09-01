const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemFilter = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const formBtn = itemForm.querySelector('button');
let onEditMode = false;

function display() {
  const itemsFromStorage = getItemToStorage();
  itemsFromStorage.forEach((items) => addItemtoDOM(items));
  checkUI();
}

function onaddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('Please Add an Item');
    return;
  }

  if (onEditMode) {
    const itemToEdit = document.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();
  } else {
    if (checkifItemExist(newItem)) {
      alert('Item Already Exist');
      return;
    }
  }

  addItemtoDOM(newItem);
  addItemtoStorage(newItem);
  checkUI();

  itemInput.value = '';
}

//Add Item to DOM

const addItemtoDOM = (item) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');

  li.appendChild(button);

  itemList.appendChild(li);
};

// Add Item to Storage

function addItemtoStorage(item) {
  const itemsFromStorage = getItemToStorage();
  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemToStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const i = createIcon('fa-solid fa-xmark');
  button.appendChild(i);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

//Remove Item

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  }
  if (e.target.tagName === 'LI') {
    setItemToEditMode(e.target);
  }
}

function checkifItemExist(item) {
  const itemsFromStorage = getItemToStorage();

  return itemsFromStorage.includes(item);
}

function setItemToEditMode(item) {
  onEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.style.backgroundColor = 'green';
  formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i> Update Item';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure you want to delete this item?')) {
    item.remove();

    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemToStorage();

  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

//Clear Item

function clearItem() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem('items');
  checkUI();
}

//Filter Item

const filterItem = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.includes(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const checkUI = () => {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  onEditMode = false;
};

itemForm.addEventListener('submit', onaddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItem);
itemFilter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded', display);

checkUI();
