// Osarugue Uwagboe - CSE 310 Module 1
// My Daily Task Manager in JavaScript
// I built this to practice JavaScript and to help me stay organized with Kaizen - small steps daily

// This array holds all my tasks. I start with a few examples so the app isn't empty
let tasks = [
    { id: 1, text: "Practice JavaScript for 30 minutes", priority: "High", done: false },
    { id: 2, text: "Read scriptures", priority: "Medium", done: false },
    { id: 3, text: "Review CSE 310 notes", priority: "Medium", done: true }
];

let currentFilter = "all";

// Get elements from the HTML page so I can use them in JS
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const errorMsg = document.getElementById("error-message");

// Show today's date using Day.js library - I didn't write this library, I just used it
function showTodayDate() {
    // dayjs() gives me today's date and format() makes it readable
    const today = dayjs().format("dddd, MMMM D, YYYY");
    document.getElementById("today-date").textContent = today;
}

// This function adds a new task when I click the button
function addTask() {
    try {
        const text = taskInput.value.trim();
        const priority = document.getElementById("priority-select").value;

        // I throw an error here on purpose if the input is empty
        // I learned that throwing errors helps me catch problems early
        if (text === "") {
            throw new Error("Please type a task before adding it.");
        }
        if (text.length > 100) {
            throw new Error("Task is too long. Keep it under 100 characters.");
        }

        const newTask = {
            id: Date.now(), // Use the time as a unique ID, simple idea I found
            text: text,
            priority: priority,
            done: false
        };

        tasks.push(newTask);
        taskInput.value = "";
        errorMsg.textContent = "";
        renderTasks();

    } catch (error) {
        // If something goes wrong above, show the message instead of crashing
        errorMsg.textContent = error.message;
        console.log("Error adding task: " + error.message);
    }
}

// This function shows all tasks on the screen
function renderTasks() {
    taskList.innerHTML = "";

    // Use filter - one of the ES6 array functions I had to learn
    // It makes a new list based on what filter button I clicked
    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true;
    });

    // Use map - another ES6 function - to create HTML for each task
    // I like map because it doesn't change my original array
    const taskItems = filteredTasks.map(task => {
        return `<li class="${task.done ? 'done' : ''}">
            <span>${task.text} - [${task.priority}]</span>
            <span>
                <button onclick="toggleTask(${task.id})">${task.done ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </span>
        </li>`;
    });

    taskList.innerHTML = taskItems.join("");

    // Use reduce - third ES6 function - to count how many tasks are done
    const doneCount = tasks.reduce((count, task) => {
        return task.done ? count + 1 : count;
    }, 0);

    taskCount.textContent = `You have completed ${doneCount} out of ${tasks.length} tasks. Keep going!`;
}

// Change a task from done to not done
function toggleTask(id) {
    // Use find to locate the task by its id
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
    }
    renderTasks();
}

// Delete one task
function deleteTask(id) {
    // filter returns a new array without the deleted task
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

// This is for the filter buttons at the top
function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}

// Remove all tasks that are already done
function clearCompleted() {
    tasks = tasks.filter(task => !task.done);
    renderTasks();
}

// RECURSION - This was the hardest part for me to understand
// This function counts down how many tasks are left by calling itself
// It takes the list and an index, and adds 1 if that task is not done
function countRemainingTasks(taskArray, index = 0) {
    // Base case: if we are past the end, stop and return 0
    if (index >= taskArray.length) {
        return 0;
    }
    // Recursive case: check this one, then call itself for the next one
    const thisOneLeft = taskArray[index].done ? 0 : 1;
    return thisOneLeft + countRemainingTasks(taskArray, index + 1);
}

// Run this when the page first loads
document.getElementById("add-btn").addEventListener("click", addTask);
showTodayDate();
renderTasks();
console.log("Remaining tasks: " + countRemainingTasks(tasks));