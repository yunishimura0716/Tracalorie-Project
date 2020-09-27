// Storage Controller
const StorageCtrl = (function() {

    // public
    return {
        storeItem: function(item) {
            let items;
            // check if any items in ls
            if (localStorage.getItem('items') === null) {
                items = [];
                // push new item
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                // push new item
                items.push(item);

                // re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
}());

// Item Controller
const ItemCtrl = (function() {
    // Item Contructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / state
    const data = {
        // items: [
        //     // {id: 0, name: "Steak Dinner", calories: 1200},
        //     // {id: 1, name: "Cookie", calories: 400},
        //     // {id: 2, name: "Eggs", calories: 300},
        // ],
        items : StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        logData: function() {
            return data;
        },
        addItem: function(name, calories) {
            // create id
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // create new item
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function() {
            let total = 0

            data.items.forEach(function(item) {
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        },
        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if (item.id == id) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        updateItem: function(name, calories) {
            // calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //get ids
            const ids = data.items.map(function(item) {
                return item.id;
            });
            // get index
            const index = ids.indexOf(id);
            // remove item
            data.items.splice(index, 1);
        },
        clearAllItem: function() {
            data.items = [];
        }
    }
}());

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
    }

    // Public methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // add class and id 
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            // add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');
                if (itemID == `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);

            item.remove();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            });
        }
    }
}());

// App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // get ui selectors
        const UISelectors = UICtrl.getSelectors();
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
        // dlete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        // clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemClick);
    }

    // add item submit
    const itemAddSubmit = function(e) {
        // get form input from ui controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // add new item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // store in localStorage
            StorageCtrl.storeItem(newItem);

            // crear field
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // eidit item click
    const itemEditClick = function(e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item id(item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            // break into an array
            const listIdArr = listId.split('-');
            // get actual id
            const id = parseInt(listIdArr[1]);
            // get entire item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }
    // update item submit
    const itemUpdateSubmit = function(e) {
        // get item input
        const input = UICtrl.getItemInput();
        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // update ui
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    // delete item submit
    const itemDeleteSubmit = function(e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // delete from ui
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // delet from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    // clear items event
    const clearAllItemClick = function() {
        // delete all items from data structure
        ItemCtrl.clearAllItem();

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // remove from ui
        UICtrl.removeItems();

        // clear item from storage
        StorageCtrl.clearItemsFromStorage();

        // hide ul
        UICtrl.hideList();
    }

    //Public methods
    return {
        init: function() {
            // clear edit state/ set initial set
            UICtrl.clearEditState();

            // fetch items from data structure
            const items = ItemCtrl.getItems();

            // check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);


            // load event listeners
            loadEventListeners();

        }
    }
}(ItemCtrl, StorageCtrl, UICtrl));

App.init();