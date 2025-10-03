const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = getTodos();
updateTodoList();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todoObject = {
      text: todoText,
      completed: false,
    };
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

function updateTodoList() {
  todoListUL.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoLI = document.createElement("li");
  todoLI.className = "todo";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `todo-${String(todoIndex).replace(/[^0-9]/g, "")}`;
  checkbox.checked = todo.completed;

  const customCheckbox = document.createElement("label");
  customCheckbox.htmlFor = checkbox.id;
  customCheckbox.className = "custom-checkbox";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("height", "24px");
  svg.setAttribute("viewBox", "0 -960 960 960");
  svg.setAttribute("width", "24px");
  svg.setAttribute("fill", "#e3e3e3");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
  );

  svg.appendChild(path);
  customCheckbox.appendChild(svg);

  const textLabel = document.createElement("label");
  textLabel.htmlFor = checkbox.id;
  textLabel.className = "todo-text";
  textLabel.textContent = todo.text;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";

  const deleteSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  deleteSvg.setAttribute("height", "24px");
  deleteSvg.setAttribute("viewBox", "0 -960 960 960");
  deleteSvg.setAttribute("width", "24px");
  deleteSvg.setAttribute("fill", "#e3e3e3");

  const deletePath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  deletePath.setAttribute(
    "d",
    "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
  );

  deleteSvg.appendChild(deletePath);
  deleteButton.appendChild(deleteSvg);

  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });

  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });

  todoLI.appendChild(checkbox);
  todoLI.appendChild(customCheckbox);
  todoLI.appendChild(textLabel);
  todoLI.appendChild(deleteButton);

  return todoLI;
}

function deleteTodoItem(todoIndex) {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
}

function saveTodos() {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
}

function getTodos() {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
}
