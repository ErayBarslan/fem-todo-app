const form = document.querySelector('.todo-form')
const formBtn = document.querySelector('.apply')
const input = document.querySelector('.todo-input')
const todoContainer = document.querySelector('.todo-container')


const load = () => {
    const todos = JSON.parse(localStorage.getItem("todos"))

    if (!todos) {
        localStorage.setItem("todos", JSON.stringify([]))
    } else {
        todos.forEach(todo => {
            saveTodo(todo)
            localStorage.setItem("todos", JSON.stringify(todos))
        })
    }
}


const addTodo = (e) => {
    e.preventDefault()

    const todoText = input.value;

    const todo = {
        text: todoText,
        isChecked: false,
        offTop : 0,
    }

    const todos = JSON.parse(localStorage.getItem("todos"))
    const todoTextExists = todos.some(td => td.text === todoText)

    if (todoText.trim() != 0 && !todoTextExists){
    todos.push(todo)

    saveTodo(todo)

    const addedTodo = [...document.querySelectorAll('.todo-holder')].slice(-1)[0]
    todo.offTop = addedTodo.offsetTop  + todos.slice(-2)[0].offTop;

    localStorage.setItem("todos", JSON.stringify(todos))

    form.reset()

    drag()
    display()
    items()
    }
}


const deleteTodo = (e) => {
    const todo = e.target.parentElement;
    const text = todo.children[1].textContent;

    todo.remove()

    let todos = JSON.parse(localStorage.getItem("todos"))
    todos = todos.filter(td => td.text != text)
    
    localStorage.setItem('todos', JSON.stringify(todos))

    items()
}


const checkTodo = (e) => {
    const todo = e.target.parentElement;
    const text = todo.children[1].textContent;
 
    let todos = JSON.parse(localStorage.getItem("todos"));
    
    todos.forEach(td => {
       if (td.text === text) td.isChecked = !td.isChecked
    });

    items()
    displayOn()
 
    localStorage.setItem("todos", JSON.stringify(todos));
}


const saveTodo = (todo) => {
    const todoHolder = document.createElement("div")
    todoHolder.setAttribute("draggable", true)
    todoHolder.classList.add("todo-holder")

    const todoCb = document.createElement("input")
    todoCb.type = "checkbox";
    todoCb.classList.add("checkbox")
    todoCb.checked = todo.isChecked;
    todoCb.addEventListener('click', checkTodo)

    const todoValue = document.createElement("p")
    todoValue.classList.add("todo-text")
    todoValue.textContent = todo.text;

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("todo-delete")
    deleteBtn.textContent = "";
    deleteBtn.addEventListener('click', deleteTodo)

    todoHolder.appendChild(todoCb)
    todoHolder.appendChild(todoValue)
    todoHolder.appendChild(deleteBtn)

    todoContainer.appendChild(todoHolder)
}


const btnClear = document.querySelector('.clear-completed')

const clearCompleted = () => {

    const todoCb = document.querySelectorAll('.checkbox')

    todoCb.forEach(td => {
        const todoParent = td.parentElement;
        const text = todoParent.children[1].textContent;

        if (td.checked == true) {
            todoParent.remove()

            let todos = JSON.parse(localStorage.getItem("todos"))
            todos = todos.filter(td => td.text != text)
    
            localStorage.setItem('todos', JSON.stringify(todos))
        }
    })
    items()
}

btnClear.addEventListener('click', clearCompleted)

load()

form.addEventListener('submit', addTodo)
formBtn.addEventListener('click', addTodo)


// THEME

const toggleTheme = document.querySelector('.theme-switch')
const theme = localStorage.getItem('theme')

document.body.classList.toggle(theme == "dark" ? "dark" : "light")

if (theme == "light") {
    toggleTheme.checked = true;
} else {
    toggleTheme.checked = false;
}

toggleTheme.addEventListener("change", (e) => {
    e.preventDefault()

    if (toggleTheme.checked) {
        document.body.classList.add("light")
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light")
    } else {
        document.body.classList.add("dark")
        document.body.classList.remove("light")
        localStorage.setItem("theme", "dark")
    }
}) 


// DRAG

const drag = () => {

const draggables = document.querySelectorAll('.todo-holder')

draggables.forEach(dragga => {
    dragga.addEventListener('dragstart', () => {
      dragga.classList.add('dragging')
    })

    dragga.addEventListener('dragend', () => {
      dragga.classList.remove('dragging')

      const todos = JSON.parse(localStorage.getItem("todos"))
      const testElem = document.querySelectorAll('.todo-text')

      todos.forEach(td => {
          testElem.forEach(te => {
              if (td.text == te.innerText) {
                  td.offTop = te.offsetTop;
              }
          })
      })
      todos.sort((a,b) => (a.offTop > b.offTop) ? 1 : -1)

      localStorage.setItem("todos", JSON.stringify(todos))  
    })
})

    todoContainer.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(todoContainer, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
            todoContainer.appendChild(draggable)
        } else {
            todoContainer.insertBefore(draggable, afterElement)
        }
    })

const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.todo-holder:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height /2
        
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}
}
drag()


// BOTTOM

const items = () => {
    const itemCount = document.querySelector('.items')
    const todosCb = document.querySelectorAll('.checkbox')
    let itemNum = 0;

    itemCount.innerHTML = `No item left`

    todosCb.forEach(td => {
        if (td.checked == false) {
            itemNum++;
            return (itemNum == 1) ? itemCount.innerHTML =`${itemNum} item left` : itemCount.innerHTML = `${itemNum} items left`;
        } 
    })
}
items()


const displayState = bool => {
    const todoHolder = document.querySelectorAll('.todo-holder')
    const todosCb = document.querySelectorAll('.checkbox')

    todoHolder.forEach(td => {
        td.setAttribute("draggable", false)
        td.style.cursor = "initial";
        td.style.display = "flex";

        todosCb.forEach(cb => {
            if (cb.checked == bool) {
                const parent = cb.parentElement;
                parent.style.display = "none";
            }
        })
    })
}

const display = () => {
    const all = document.querySelector('.all')
    const active = document.querySelector('.active')
    const completed = document.querySelector('.completed')
    const todoHolder = document.querySelectorAll('.todo-holder')

    all.addEventListener('click', () => {
        all.style.color = "hsl(220, 98%, 61%)";
        active.style.color = "hsl(236, 9%, 61%)";
        completed.style.color = "hsl(236, 9%, 61%)";

        todoHolder.forEach(td => {
            td.setAttribute("draggable", true)
            td.style.cursor = "pointer";
            td.style.display = "flex";
        })
    })

    active.addEventListener('click', () => {
        active.style.color = "hsl(220, 98%, 61%)";
        all.style.color = "hsl(236, 9%, 61%)";
        completed.style.color = "hsl(236, 9%, 61%)";
        displayState(true)
     })

    completed.addEventListener('click', () => {
        completed.style.color = "hsl(220, 98%, 61%)";
        all.style.color = "hsl(236, 9%, 61%)";
        active.style.color = "hsl(236, 9%, 61%)";
        displayState(false)
    })
}
display()

const displayOn = () => {
    const active = document.querySelector('.active')
    const completed = document.querySelector('.completed')

    if (active.style.color == "hsl(220, 98%, 61%)") {
        displayState(true)
    } else if (completed.style.color == "hsl(220, 98%, 61%)") {
        displayState(false)
    }
}

formBtn.addEventListener('click', displayOn)

const toggleTodo = document.querySelectorAll('.checkbox')

toggleTodo.forEach(cb => {
    cb.addEventListener('change', displayOn)
})