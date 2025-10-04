const SecurityUtils = {
  sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    let cleaned = str.normalize('NFKC');
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    cleaned = cleaned.replace(/[＜＞＂＇＼／]/g, '');
    const temp = document.createElement('div');
    temp.textContent = cleaned;
    return temp.innerHTML;
  },

  validateInput(input) {
    if (!input || typeof input !== 'string') {
      return { valid: false, error: 'Invalid input type' };
    }

    let trimmed = input.trim();

    if (trimmed.length === 0) {
      return { valid: false, error: 'Todo cannot be empty' };
    }
    if (trimmed.length > 500) {
      return { valid: false, error: 'Todo too long (max 500 characters)' };
    }

    trimmed = trimmed.normalize('NFKC');

    const suspiciousChars = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/g;
    if (suspiciousChars.test(trimmed)) {
      return { valid: false, error: 'Invalid control characters detected' };
    }

    const homoglyphs = /[＜＞＂＇／＼％]/g;
    if (homoglyphs.test(trimmed)) {
      return { valid: false, error: 'Suspicious unicode characters detected' };
    }

    const xssPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /<iframe[\s\S]*?>/gi,
      /<object[\s\S]*?>/gi,
      /<embed[\s\S]*?>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[\s\S]*?onerror/gi,
      /<svg[\s\S]*?onload/gi,
      /<svg[\s\S]*?xlink:href/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /<link[\s\S]*?>/gi,
      /<style[\s\S]*?>/gi,
      /vbscript:/gi,
      /data:/gi,
      /&#/gi,
      /\\u/gi,
      /\\x/gi,
      /<meta[\s\S]*?>/gi,
      /<base[\s\S]*?>/gi,
      /<form[\s\S]*?>/gi,
      /srcdoc/gi,
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(trimmed)) {
        return { valid: false, error: 'Suspicious content detected' };
      }
    }

    const multiNormalized = trimmed.normalize('NFKD').normalize('NFKC');
    if (multiNormalized !== trimmed) {
      return { valid: false, error: 'Encoding anomaly detected' };
    }

    return { valid: true, sanitized: trimmed };
  },

  sanitizeAttribute(attr) {
    if (typeof attr !== 'string') return '';
    const normalized = String(attr).normalize('NFKC');
    return normalized.replace(/[^a-zA-Z0-9_-]/g, '');
  },

  validateJSON(str) {
    try {
      const parsed = JSON.parse(str);
      if (!Array.isArray(parsed)) return null;
      return parsed;
    } catch (e) {
      console.error('JSON parse error:', e);
      return null;
    }
  },

  validateTodoObject(obj) {
    if (!obj || typeof obj !== 'object') return null;

    return {
      text: typeof obj.text === 'string' ? this.sanitizeHTML(obj.text.slice(0, 500)) : '',
      completed: Boolean(obj.completed),
      id: obj.id || Date.now() + Math.random(),
      createdAt: obj.createdAt || new Date().toISOString()
    };
  },

  isValidURL(str) {
    if (!str || typeof str !== 'string') return false;
    const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
    return !dangerousProtocols.test(str);
  }
};

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
  const rawInput = todoInput.value;

  const validation = SecurityUtils.validateInput(rawInput);
  if (!validation.valid) {
    showError(validation.error);
    return;
  }

  const todoText = validation.sanitized;
  const todoObject = {
    text: SecurityUtils.sanitizeHTML(todoText),
    completed: false,
    id: Date.now() + Math.random(),
    createdAt: new Date().toISOString()
  };

  allTodos.push(todoObject);

  updateTodoList();
  saveTodos();
  todoInput.value = "";
  clearError();
}

function updateTodoList() {
  try {
    while (todoListUL.firstChild) {
      todoListUL.removeChild(todoListUL.firstChild);
    }

    const validTodos = allTodos.filter(todo => {
      return todo && typeof todo === 'object' && typeof todo.text === 'string';
    });

    validTodos.forEach((todo, todoIndex) => {
      const todoItem = createTodoItem(todo, todoIndex);
      if (todoItem) {
        todoListUL.append(todoItem);
      }
    });
  } catch (e) {
    console.error('Update list error:', e);
    showError('Failed to update todo list');
  }
}

function createTodoItem(todo, todoIndex) {
  try {
    const validTodo = SecurityUtils.validateTodoObject(todo);
    if (!validTodo || !validTodo.text) return null;

    const todoLI = document.createElement("li");
    todoLI.className = "todo";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const sanitizedIndex = SecurityUtils.sanitizeAttribute(String(todoIndex));
    checkbox.id = `todo-${sanitizedIndex}`;
    checkbox.checked = Boolean(validTodo.completed);

    const customCheckbox = document.createElement("label");
    customCheckbox.htmlFor = checkbox.id;
    customCheckbox.className = "custom-checkbox";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "24px");
    svg.setAttribute("viewBox", "0 -960 960 960");
    svg.setAttribute("width", "24px");
    svg.setAttribute("fill", "#e3e3e3");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z");

    svg.appendChild(path);
    customCheckbox.appendChild(svg);

    const textLabel = document.createElement("label");
    textLabel.htmlFor = checkbox.id;
    textLabel.className = "todo-text";
    const safeTodoText = SecurityUtils.sanitizeHTML(validTodo.text);
    textLabel.textContent = safeTodoText;
    textLabel.setAttribute("data-original-text", safeTodoText);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("aria-label", `Delete todo: ${safeTodoText.slice(0, 30)}`);

    const deleteSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    deleteSvg.setAttribute("height", "24px");
    deleteSvg.setAttribute("viewBox", "0 -960 960 960");
    deleteSvg.setAttribute("width", "24px");
    deleteSvg.setAttribute("fill", "#e3e3e3");
    deleteSvg.setAttribute("role", "img");
    deleteSvg.setAttribute("aria-hidden", "true");

    const deletePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    deletePath.setAttribute("d", "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z");

    deleteSvg.appendChild(deletePath);
    deleteButton.appendChild(deleteSvg);

    deleteButton.addEventListener("click", (function(index) {
      return function() {
        deleteTodoItem(index);
      };
    })(todoIndex));

    checkbox.addEventListener("change", (function(index) {
      return function(e) {
        const isChecked = Boolean(e.target.checked);
        if (allTodos[index]) {
          allTodos[index].completed = isChecked;
          saveTodos();
        }
      };
    })(todoIndex));

    todoLI.appendChild(checkbox);
    todoLI.appendChild(customCheckbox);
    todoLI.appendChild(textLabel);
    todoLI.appendChild(deleteButton);

    return todoLI;
  } catch (e) {
    console.error('Create todo item error:', e);
    return null;
  }
}

function deleteTodoItem(todoIndex) {
  try {
    if (typeof todoIndex !== 'number' || todoIndex < 0 || todoIndex >= allTodos.length) {
      showError('Invalid todo index');
      return;
    }

    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoList();
  } catch (e) {
    console.error('Delete error:', e);
    showError('Failed to delete todo');
  }
}

function saveTodos() {
  try {
    const validTodos = allTodos.map(todo => 
      SecurityUtils.validateTodoObject(todo)
    ).filter(Boolean);

    const todosJson = JSON.stringify(validTodos);

    if (todosJson.length > 5000000) {
      showError('Storage limit exceeded');
      return;
    }

    localStorage.setItem("todos", todosJson);
  } catch (e) {
    console.error('Storage error:', e);
    showError('Failed to save todos. Storage may be full.');
  }
}

function getTodos() {
  try {
    const todosString = localStorage.getItem("todos");
    
    if (!todosString) return [];

    const parsed = SecurityUtils.validateJSON(todosString);
    if (!parsed) {
      console.warn('Invalid JSON in storage, resetting...');
      localStorage.removeItem("todos");
      return [];
    }

    const validTodos = parsed
      .map(todo => SecurityUtils.validateTodoObject(todo))
      .filter(Boolean);

    return validTodos;
  } catch (e) {
    console.error('Get todos error:', e);
    localStorage.removeItem("todos");
    return [];
  }
}

function showError(message) {
  clearError();
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff4757;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 1000;
    max-width: 300px;
    word-wrap: break-word;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(clearError, 5000);
}

function clearError() {
  const existing = document.getElementById('error-message');
  if (existing) {
    existing.remove();
  }
}
