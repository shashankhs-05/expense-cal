const API_URL = "http://localhost:8080/expenses"; // Your Spring Boot backend URL

document.addEventListener("DOMContentLoaded", fetchExpenses);
document.getElementById("expense-form").addEventListener("submit", addExpense);

// Fetch and Display Expenses
function fetchExpenses() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const expenseList = document.getElementById("expense-list");
            expenseList.innerHTML = "";
            data.forEach(expense => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${expense.name}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td>
                        <button class="edit" onclick="editExpense(${expense.id})">Edit</button>
                        <button class="delete" onclick="deleteExpense(${expense.id})">Delete</button>
                    </td>
                `;
                expenseList.appendChild(row);
            });
        });
}

// Add Expense
function addExpense(event) {
    event.preventDefault();
    const expense = {
        name: document.getElementById("name").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expense)
    })
    .then(() => {
        document.getElementById("expense-form").reset();
        fetchExpenses();
    });
}

// Delete Expense
function deleteExpense(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => fetchExpenses());
}

// Edit Expense
function editExpense(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(expense => {
            document.getElementById("name").value = expense.name;
            document.getElementById("amount").value = expense.amount;
            document.getElementById("category").value = expense.category;
            document.getElementById("date").value = expense.date;

            document.getElementById("expense-form").onsubmit = function (event) {
                event.preventDefault();
                updateExpense(id);
            };
        });
}

// Update Expense
function updateExpense(id) {
    const updatedExpense = {
        name: document.getElementById("name").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense)
    })
    .then(() => {
        document.getElementById("expense-form").reset();
        document.getElementById("expense-form").onsubmit = addExpense;
        fetchExpenses();
    });
}
