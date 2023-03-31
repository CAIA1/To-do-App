//When the window loads, it adds an event listener
window.addEventListener('load', () => {
    //retrieve any existing tasks from the browser's local storage. If there are no tasks, initialize an empty array.
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const addTaskForm = document.querySelector('#add-task-form');

    addTaskForm.addEventListener('submit', e => {
        //When the form is submitted, it prevents the default behavior (submitting the form to a server)
        e.preventDefault();
        // Create a new todo object with the content entered by the user, a status of false (meaning it is not completed), and the current timestamp.
        const todo = {
            content: e.target.elements.content.value,
            done: false,
            createdAt: new Date().getTime()
        };
        //add the todo object to the todos array
        todos.push(todo);
        //save the todos array to the browser's local storage
        localStorage.setItem('todos', JSON.stringify(todos));
        //reset the form to its initial state 
        e.target.reset();
        //update the list of tasks displayed on the page
        DisplayTodos();
    })
    DisplayTodos();
})

function DisplayTodos() {
    //select the element and set its innerHTML to an empty string. This clears the list of any previously displayed tasks.
    const todoList = document.querySelector('#tasks');
    todoList.innerHTML= "";
    //loop through each task
    todos.forEach(todo => {
        //create a new div element with a class of task
        const todoItem = document.createElement('div');
        todoItem.classList.add('task');

        //creates child elements for the task div
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const content = document.createElement('div');
        const actions = document.createElement('div');
        const edit = document.createElement('button');
        const deleteButton = document.createElement('button');

        //set properties and classes on the child elements to style them appropriately
        input.type = 'checkbox';
        input.checked = todo.done;
        span.classList.add('circle');
        content.classList.add('content');
        actions.classList.add('actions');
        edit.classList.add('edit');
        deleteButton.classList.add('delete');

        //set the value of the content div to the task's content property and set the readonly attribute to prevent the user from editing it directly
        content.innerHTML = `<input type = "text" value="${todo.content}" readonly>`;
        edit.innerHTML = 'Edit';
        deleteButton.innerHTML = 'Delete';

        label.appendChild(input);
        label.appendChild(span);
        actions.appendChild(edit);
        actions.appendChild(deleteButton);
        todoItem.appendChild(label);
        todoItem.appendChild(content);
        todoItem.appendChild(actions);

        todoList.appendChild(todoItem);

        //When the checkbox is clicked, it updates the task's done property and saves the todos array to local storage.
        if (todo.done) {
            todoItem.classList.add('done');
        }

        input.addEventListener('click', e => {
            todo.done = e.target.checked;
            localStorage.setItem('todos', JSON.stringify(todos));
            //adds or removes the done class from the task div, depending on whether the task is now completed.
            if (todo.done) {
                todoItem.classList.add('done'); 
            } else {
                todoItem.classList.remove('done');
            }

            DisplayTodos();
        })


        //When the edit button is clicked, it removes the readonly attribute from the content div's input element and sets focus to it, allowing the user to edit the task's content. 
        edit.addEventListener('click', e => {
            const inputText = content.querySelector('input');
            inputText.removeAttribute('readonly');
            inputText.focus();
            //When the input loses focus, it sets the readonly attribute again, saves the new content to the task, and updates the todos array in local storage.
            inputText.addEventListener('blur', e => {
                inputText.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('todos', JSON.stringify(todos));
                DisplayTodos();
            })
        })
        //When the delete button is clicked, it removes the task from the todos array, saves the updated todos array to local storage, and calls DisplayTodos() again to update the list of displayed tasks.
        deleteButton.addEventListener('click', e => {
            todos = todos.filter(t => t!= todo);
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        })

    })
}

