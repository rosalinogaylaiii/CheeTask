// Retrieve the deleted tasks from localStorage
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

// Get the container for displaying the deleted tasks
const historyContainer = document.getElementById('historyContainer');

// Function to update the localStorage after deletion
function updateLocalStorage() {
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

// Function to render the history tasks and categories
function renderDeletedTasks() {
    // Clear the container before re-rendering
    historyContainer.innerHTML = '';

    if (deletedTasks.length === 0) {
        historyContainer.innerHTML = '<p>No deleted tasks found.</p>';
        return;
    }

    // Create a map to store tasks by category
    const taskCategories = {};

    // Group tasks by category
    deletedTasks.forEach(task => {
        if (!taskCategories[task.category]) {
            taskCategories[task.category] = [];
        }
        taskCategories[task.category].push(task);
    });

    // Create HTML for each category and its tasks
    for (const category in taskCategories) {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.setAttribute('data-category', category);

        // Add category title
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        // Add a delete button for the category
        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = 'Delete Category';
        deleteCategoryButton.classList.add('delete-category-btn');
        categoryDiv.appendChild(deleteCategoryButton);

        // Add each task under the category
        taskCategories[category].forEach((task) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task-item');
            
            // Add the task details to the taskDiv
            taskDiv.innerHTML = `
                <p><strong>Task:</strong> ${task.task}</p>
                <p><strong>Category:</strong> ${task.category}</p>
                <p><strong>Deadline:</strong> ${task.deadline || 'No deadline'}</p>
            `;

            // Add a delete button for the task
            const deleteTaskButton = document.createElement('button');
            deleteTaskButton.textContent = 'Delete Task';
            deleteTaskButton.classList.add('delete-task-btn');
            taskDiv.appendChild(deleteTaskButton);

            // Add event listener for deleting individual tasks
            deleteTaskButton.addEventListener('click', function() {
                // Find the task and remove it from the deletedTasks array
                const taskIndex = deletedTasks.findIndex(t => t.task === task.task && t.category === task.category);
                if (taskIndex !== -1) {
                    deletedTasks.splice(taskIndex, 1);
                    updateLocalStorage(); // Update localStorage
                    renderDeletedTasks(); // Re-render the tasks
                }
            });

            // Append each task to the categoryDiv
            categoryDiv.appendChild(taskDiv);
        });

        // Event listener to delete the entire category and its tasks
        deleteCategoryButton.addEventListener('click', function() {
            // Filter out all tasks belonging to this category
            deletedTasks = deletedTasks.filter(task => task.category !== category);
            updateLocalStorage(); // Update localStorage
            renderDeletedTasks(); // Re-render the tasks
        });

        // Append category div to the history container
        historyContainer.appendChild(categoryDiv);
    }
}

// Initial rendering of deleted tasks
renderDeletedTasks();
