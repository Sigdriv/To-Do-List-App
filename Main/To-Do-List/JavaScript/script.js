// Get references to the input box and list container elements
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Event listener for the input box
inputBox.addEventListener('keyup', function (event) {
    // Check if the enter key was pressed
    if (event.keyCode === 13) {
        // If enter key was pressed add a new task
        addTask();
    }
});

// Function to add a new task
function addTask() {
    // Check if the input box is empty
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        // Create a new list item
        let li = document.createElement("li");
        // Set the content of the list item to the input value
        li.innerHTML = inputBox.value;
        // Append the list item to the list container
        listContainer.appendChild(li);
        // Create a span element to represent a delete button
        let span = document.createElement("span");
        span.innerHTML = "\u00D7"; // The 'x' character for the delete button
        // Append the delete button to the list item
        li.appendChild(span);
    }
    // Clear the input box
    inputBox.value = "";
    // Save the updated list to local storage
    saveData();
}

// Event listener for clicks on list items and delete buttons
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        // Toggle the 'checked' class on list items when clicked
        e.target.classList.toggle("checked");
        // Save the updated list to local storage
        saveData();
    } else if (e.target.tagName === "SPAN") {
        // Remove the parent list item when the delete button is clicked
        e.target.parentElement.remove();
        // Save the updated list to local storage
        saveData();
    }
}, false);

// Function to save the list data to local storage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

// Function to load and display the saved tasks from local storage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

// Load and display the saved tasks when the page loads
showTask();

const menuToggel = document.querySelector('.toggle')

menuToggel.addEventListener('click', () => {
    // Your event handling code here
    menuToggel.classList.toggle('active')
  });
  