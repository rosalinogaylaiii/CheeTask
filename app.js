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

// Handle adding tasks with custom category and deadline
submitTaskButton.addEventListener('click', function() {
    const taskValue = taskInput.value.trim(); // Trim whitespace
    const categoryValue = categoryInput.value.trim(); // Trim whitespace
    const deadlineValue = deadlineInput.value;

    if (taskValue !== '' && categoryValue !== '') {
        // Create the task element
        const newTask = document.createElement('div');
        newTask.className = 'task-item';

        // Create a checkbox for marking the task as done
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        // Create a span to hold the task text
        const taskText = document.createElement('span');
        taskText.textContent = taskValue;

        // Create a span for the deadline
        const deadlineSpan = document.createElement('span');
        deadlineSpan.className = 'deadline-text';
        deadlineSpan.textContent = deadlineValue ? ` (Deadline: ${deadlineValue})` : '';

        // Create a delete button for removing the task
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';

        // Add event listener to checkbox to mark the task as done
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                taskText.classList.add('completed'); // Add 'completed' class
            } else {
                taskText.classList.remove('completed'); // Remove 'completed' class
            }
        });

        // Add event listener to delete button to remove the task
        deleteButton.addEventListener('click', function() {
            newTask.remove(); // Remove the task item from the container
            
            // Check if the category has no more tasks and remove it
            const categoryTasks = categorySection.getElementsByClassName('task-item');
            if (categoryTasks.length === 0) {
                categorySection.remove(); // Remove the category if empty
            }
        });

        // Append checkbox, task text, deadline, and delete button to the task div
        newTask.appendChild(checkbox);
        newTask.appendChild(taskText);
        newTask.appendChild(deadlineSpan);
        newTask.appendChild(deleteButton);

        // Find or create the category section in the task container
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
    } else {
        alert('Please enter a task and a category.');
    }
});
