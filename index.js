document.addEventListener('DOMContentLoaded', () => {
  render();
  setEventListeners();
});

function render() {
  const body = document.querySelector("body");
  const wrapper = createElementWithClasses("div", ["cardListWrapper"]);
  const createTodoInput = renderCreateTodoInput();
  const todoList = renderTodoList();
  appendChildren(wrapper, [createTodoInput, todoList]);
  // final action
  appendChildren(body, [wrapper]);
}

function reRender(){
  removeEventListeners();
  const todoListWrapper = document.querySelector(".todoListWrapper");
  todoListWrapper.innerHTML = renderTodoList().innerHTML;
  setEventListeners();
}

function renderCreateTodoInput() {
  const createTodoWrapper = createElementWithClasses("div", ["createTodoWrapper"]);
  const createTodoInput = createElementWithClasses("input", ["createTodoInput"]);
  const createTodoButton = createElementWithClasses("button", ["createTodoButton"]);
  const createTodoImg = document.createElement("img");

  setAttributes(
    createTodoImg,
    [{
      key: "src",
      value: "add.svg"
    }, {
      key: "alt",
      value: "create todo image"
    }]
  );

  appendChildren(createTodoButton, [createTodoImg]);
  appendChildren(createTodoWrapper, [createTodoInput, createTodoButton]);

  return createTodoWrapper;
}

// рисуем лист тудушек
function renderTodoList() {
  const todoListWrapper = createElementWithClasses("div", ["todoListWrapper"]);
  const todoRepository = new TodoRepository();
  const todos = todoRepository.getTasks();
  todos.forEach((todoItem)=>{
    const todoItemWrapper = renderTodoItem(todoItem);
    appendChildren(todoListWrapper, [todoItemWrapper]);
  })
  return todoListWrapper;
}

function renderTodoItem(todoItem){
  const todoItemWrapper = createElementWithClasses("div", ["todoItemWrapper"]);
  const todoButtonWrapper = createElementWithClasses("div", ["todoButtonWrapper"]);
  const todoItemInput = createElementWithClasses("input", ["todoItemInput"]);
  const saveButton = createElementWithClasses("button", ["imgButton", "saveButton"]);
  const saveImg = document.createElement("img");
  const editButton = createElementWithClasses("button", ["imgButton", "editButton"]);
  const editImg = document.createElement("img");
  const removeButton = createElementWithClasses("button", ["imgButton", "removeButton"]);
  const removeImg = document.createElement("img");
  const paragraph = createElementWithClasses("p", ["text"]);
  paragraph.innerText = todoItem.name;

  setAttributes( // добавили id врапперу, чтобы по нему мб remove
    todoItemWrapper,
    [{
      key: "id",
      value: todoItem.id
    }]
  );  
  setAttributes(
    saveImg,
    [{
      key: "src",
      value: "save.svg"
    }, {
      key: "alt",
      value: "save image"
    }]
  );
  setAttributes(
    editImg,
    [{
      key: "src",
      value: "edit.svg"
    }, {
      key: "alt",
      value: "edit image"
    }]
  );
  setAttributes(
    removeImg,
    [{
      key: "src",
      value: "remove.svg"
    }, {
      key: "alt",
      value: "remove image"
    }]
  );
  appendChildren(saveButton, [saveImg]);
  appendChildren(editButton, [editImg]);
  appendChildren(removeButton, [removeImg]);
  appendChildren(todoButtonWrapper, [saveButton,editButton,removeButton]);
  appendChildren(todoItemWrapper, [paragraph, todoItemInput, todoButtonWrapper]); 
  return todoItemWrapper; 
}

function setEventListeners() {

  const addButton = document.querySelector(".createTodoButton");
  addButton.addEventListener("click", addTodo);
  
  const removeButtons = Array.from(document.querySelectorAll(".removeButton"));
  removeButtons.forEach((button) =>{
    button.addEventListener("click", removeTodo);
  })

  const editButtons = Array.from(document.querySelectorAll(".editButton"));
  editButtons.forEach((button)=>{
    button.addEventListener("click", editTodo);
  })

  const saveButtons = Array.from(document.querySelectorAll(".saveButton"));
  saveButtons.forEach((button)=>{
    button.addEventListener("click", saveTodo);
  })
}

function removeEventListeners(){
  const addButton = document.querySelector(".createTodoButton");
  addButton.removeEventListener("click", addTodo);
  
  const removeButtons = Array.from(document.querySelectorAll(".removeButton"));
  removeButtons.forEach((button) =>{
    button.removeEventListener("click", removeTodo);
  })

  const editButtons = Array.from(document.querySelectorAll(".editButton"));
  editButtons.forEach((button)=>{
    button.removeEventListener("click", editTodo);
  })

  const saveButtons = Array.from(document.querySelectorAll(".saveButton"));
  saveButtons.forEach((button)=>{
    button.removeEventListener("click", saveTodo);
  })
}

function addTodo() {
  const todoRepository = new TodoRepository();
  const inputValue = document.querySelector(".createTodoInput").value;
  if(inputValue){
    const todo = new ToDo({name: inputValue});
    todoRepository.create(todo);
    reRender();
  }
}

function removeTodo(event){
  const todoRepository = new TodoRepository();
  const todoId = getTodoId(event.target);
  todoRepository.remove(todoId);
  reRender();
}

function getTodoId(element){
  if (element) {
    const addClick = element.closest(".todoItemWrapper");
    return addClick.id;  
  } 
}

function editTodo(event){
  const todoRepository = new TodoRepository();
  const todoId = getTodoId(event.target);
  const todo = todoRepository.getTaskById(todoId); // in local storage
  const todoItemWrapper = event.target.closest(".todoItemWrapper"); // ближайший эл-т с классом 
  todoItemWrapper.classList.add("editTask");
  todoItemWrapper.querySelector("input").value = todo.name;
}

function saveTodo(event){
  const todoRepository = new TodoRepository();
  const todoId = getTodoId(event.target);
  const todo = todoRepository.getTaskById(todoId); 
  const todoItemWrapper = event.target.closest(".todoItemWrapper");
  todoItemWrapper.classList.remove("editTask");
  todo.name = todoItemWrapper.querySelector("input").value;
  todoRepository.update(todo);
  reRender();
}

function appendChildren(targetElement, elements) {
  elements.forEach(element => {
    targetElement.appendChild(element);
  });
}

function setAttributes(targetElement, atributes) {
  atributes.forEach(atribute => {
    targetElement.setAttribute(atribute.key, atribute.value);
  });
}

function createElementWithClasses(tagName, classList) {
  const tag = document.createElement(tagName);
  classList.forEach(classItem => {
    tag.classList.add(classItem);
  });
  return tag;
}

function generateUniqueId() {
  function s4() {
     return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
 }
 return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}