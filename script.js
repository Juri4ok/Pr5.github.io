document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const sort = document.getElementById('sort');

    // Load tasks from localStorage
    loadTasks();

    taskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value);
            taskInput.value = '';
        }
    });

    function addTask(text, date) {
        const taskItem = document.createElement('li');
        taskItem.className = 'taskItem';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const taskText = document.createElement('span');
        taskText.className = 'taskText';
        taskText.textContent = text;
        const taskDate = document.createElement('span');
        taskDate.className = 'taskDate';
        if (date == null) {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}, ${currentDate.getHours()}:${currentDate.getMinutes()}`;
            taskDate.textContent = formattedDate;
        }else{
            taskDate.textContent = date;
        }
        const deleteButton = document.createElement('span');
        deleteButton.className = 'deleteButton';
        deleteButton.textContent = '❌';

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(taskDate);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);

        // Save tasks to localStorage

        checkbox.addEventListener('change', function () {
            taskItem.classList.toggle('completed', checkbox.checked);
            taskText.classList.toggle('completed', checkbox.checked);
            checkbox.style.display = checkbox.checked ? 'none' : 'inline';
            saveTasks();
        });

        deleteButton.addEventListener('click', function () {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskText.addEventListener('dblclick', function () {
            if (checkbox.checked == false) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.value = taskText.textContent;
            taskItem.replaceChild(editInput, taskText);
            editInput.focus();

            editInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    if (taskItem.contains(editInput)) {
                        taskText.textContent = editInput.value;
                        taskItem.replaceChild(taskText, editInput);
                        saveTasks();
                    }
                }
            });
        }
        });
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        const taskItems = document.querySelectorAll('.taskItem');

        taskItems.forEach(function (taskItem) {
            const task = {
                text: taskItem.querySelector('span.taskText').textContent,
                date: taskItem.querySelector('span.taskDate').textContent,
                completed: taskItem.classList.contains('completed')
            };
            tasks.push(task);
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(function (task) {
            addTask(task.text, task.date);
            const taskItem = taskList.lastElementChild;
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const taskText = taskItem.querySelector('span.taskText');
            if (task.completed) {
                checkbox.checked = true;
                taskItem.classList.add('completed');
                taskText.classList.add('completed');
                checkbox.style.display = 'none';
                saveTasks();
            }
        });
    }
    sort.addEventListener('click', () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
        const completedTasks = tasks.filter(task => task.completed);
        const uncompletedTasks = tasks.filter(task => !task.completed);

        // Clear the task list
        taskList.innerHTML = '';
        // Then add uncompleted tasks
        uncompletedTasks.forEach(function (task) {
            addTask(task.text, task.date); // Pass false to indicate that it's an uncompleted task
            const taskItem = taskList.lastElementChild;
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const taskText = taskItem.querySelector('span.taskText');
        });
        // Add completed tasks first
        completedTasks.forEach(function (task) {
            addTask(task.text, task.date); // Pass true to indicate that it's a completed task
            const taskItem = taskList.lastElementChild;
            const checkbox = taskItem.querySelector('input[type="checkbox"]');
            const taskText = taskItem.querySelector('span.taskText');
            if (task.completed) {
                checkbox.checked = true;
                taskItem.classList.add('completed');
                taskText.classList.add('completed');
                checkbox.style.display = 'none';
                saveTasks();
            }
        });
    })
});
