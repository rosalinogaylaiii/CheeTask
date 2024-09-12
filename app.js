// Get the necessary elements
const addTaskButton = document.getElementById('addTaskButton');
const taskModal = document.getElementById('taskModal');
const closeModal = document.querySelector('.close');
const submitTaskButton = document.getElementById('submitTaskButton');
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const deadlineInput = document.getElementById('deadlineInput');
const taskContainer = document.getElementById('taskContainer');

// Show the modal when "Add Task" button is clicked
addTaskButton.addEventListener('click', function() {
    taskModal.style.display = 'flex'; // Show the modal
});

// Close the modal when the 'x' is clicked
closeModal.addEventListener('click', function() {
    taskModal.style.display = 'none'; // Hide the modal
});

// Function to store active tasks in localStorage
function storeTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const deadline = task.querySelector('.deadline-text').textContent.replace(' (Deadline: ', '').replace(')', '');
        const category = task.closest('.category-container').querySelector('.category-title').textContent;
        const isCompleted = task.querySelector('.task-checkbox').checked;

        tasks.push({
            task: taskText,
            deadline: deadline,
            category: category,
            completed: isCompleted
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(taskData => {
        // Create the task element
        const newTask = document.createElement('div');
        newTask.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = taskData.completed;

        const taskText = document.createElement('span');
        taskText.textContent = taskData.task;

        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'deadline-text';
        deadlineSpan.textContent = taskData.deadline ? ` (Deadline: ${taskData.deadline})` : '';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';

        // Event listener to mark task as completed
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                taskText.classList.add('completed');
            } else {
                taskText.classList.remove('completed');
            }
            storeTasks(); // Update localStorage
        });

        // Event listener to delete task
        deleteButton.addEventListener('click', function() {
            storeDeletedTask(taskData.task, taskData.deadline, taskData.category); // Store task in deleted
            newTask.remove();
            
            // Check if the category is empty and remove it if necessary
            const categorySection = newTask.closest('.category-container');
            if (categorySection && categorySection.querySelectorAll('.task-item').length === 0) {
                categorySection.remove();
            }

            storeTasks(); // Update localStorage after deletion
            location.reload(); // Reload the page to refresh UI and state
        });

        newTask.appendChild(checkbox);
        newTask.appendChild(taskText);
        newTask.appendChild(deadlineSpan);
        newTask.appendChild(deleteButton);

        // Find or create the category section
        let categorySection = document.getElementById(`category-${taskData.category}`);
        if (!categorySection) {
            categorySection = document.createElement('div');
            categorySection.id = `category-${taskData.category}`;
            categorySection.className = 'category-container';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = taskData.category;

            categorySection.appendChild(categoryTitle);
            taskContainer.appendChild(categorySection);
        }

        categorySection.appendChild(newTask);
    });
}

// Handle adding tasks with custom category and deadline
submitTaskButton.addEventListener('click', function() {
    const taskValue = taskInput.value.trim(); // Trim whitespace
    const categoryValue = categoryInput.value.trim(); // Trim whitespace
    const deadlineValue = deadlineInput.value;

    if (taskValue !== '' && categoryValue !== '') {
        // Create the task element
        const newTask = document.createElement('div');
        newTask.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        const taskText = document.createElement('span');
        taskText.textContent = taskValue;

        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'deadline-text';
        deadlineSpan.textContent = deadlineValue ? ` (Deadline: ${deadlineValue})` : '';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';

        // Add event listener to checkbox to mark the task as done
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                taskText.classList.add('completed');
            } else {
                taskText.classList.remove('completed');
            }
            storeTasks(); // Update tasks in localStorage when checkbox is changed
        });

        // Add event listener to delete button to remove the task
        deleteButton.addEventListener('click', function() {
            storeDeletedTask(taskValue, deadlineValue, categoryValue); // Store task in deleted
            newTask.remove();

            // Check if the category is empty and remove it if necessary
            const categorySection = newTask.closest('.category-container');
            if (categorySection && categorySection.querySelectorAll('.task-item').length === 0) {
                categorySection.remove();
            }

            storeTasks(); // Update localStorage after deletion
            location.reload(); // Reload the page to refresh UI and state
        });

        newTask.appendChild(checkbox);
        newTask.appendChild(taskText);
        newTask.appendChild(deadlineSpan);
        newTask.appendChild(deleteButton);

        // Find or create the category section
        let categorySection = document.getElementById(`category-${categoryValue}`);
        if (!categorySection) {
            categorySection = document.createElement('div');
            categorySection.id = `category-${categoryValue}`;
            categorySection.className = 'category-container';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = categoryValue;

            categorySection.appendChild(categoryTitle);
            taskContainer.appendChild(categorySection); // Add the category section to the container
        }

        // Add the task to the corresponding category section
        categorySection.appendChild(newTask);

        // Clear the input fields and close the modal
        taskInput.value = '';
        categoryInput.value = '';
        deadlineInput.value = '';
        taskModal.style.display = 'none';

        // Store the new task in localStorage
        storeTasks();
    } else {
        alert('Please enter a task and a category.');
    }
});

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    if (event.target == taskModal) {
        taskModal.style.display = 'none';
    }
};

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Function to store deleted tasks in localStorage
function storeDeletedTask(taskText, deadlineValue, categoryValue) {
    const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    
    // Create an object for the deleted task
    const deletedTask = {
        task: taskText,
        deadline: deadlineValue,
        category: categoryValue
    };
    
    // Add the deleted task to the array
    deletedTasks.push(deletedTask);
    
    // Save the updated array back to localStorage
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Function to display deleted tasks (assuming it's in a different section)
function displayDeletedTasks() {
    const deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    const historyContainer = document.getElementById('historyContainer'); // Make sure you have an element with this ID

    if (deletedTasks.length === 0) {
        historyContainer.innerHTML = '<p>No deleted tasks found.</p>';
    } else {
        deletedTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'history-task';
            taskItem.innerHTML = `
                <p>Task: ${task.task}</p>
                <p>Category: ${task.category}</p>
                <p>Deadline: ${task.deadline ? task.deadline : 'No deadline'}</p>
                <hr>
            `;
            historyContainer.appendChild(taskItem);
        });
    }
}

// Call the function to display deleted tasks when the page loads
document.addEventListener('DOMContentLoaded', displayDeletedTasks);
