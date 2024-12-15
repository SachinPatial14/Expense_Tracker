let expenseForm = document.getElementById("expense-form");
let submitBtn = document.querySelector("button");
let filterCategory = document.getElementById("filter-category");

document.addEventListener("DOMContentLoaded",function(){
    displayExpenses();

    filterCategory.addEventListener("change", function () {
        displayExpenses();
    });

    expenseForm.addEventListener("submit",function(e){
        e.preventDefault();

 let expenseName = document.getElementById("expense-name").value;
let expenseAmount = document.getElementById("expense-amount").value;
let expenseCategory = document.getElementById("expense-category").value;
let expenseDate = document.getElementById("expense-date").value;

if (expenseName === "" || expenseAmount === "" || expenseCategory === "" || expenseDate === "") {
    alert("Please fill all the fields.");
    return;
};


        const expense = {
            expenseName,
            expenseAmount,
            expenseCategory,
            expenseDate,
        };
        
        let storeExpenses = localStorage.getItem("storeExpenses");
        let dataArray = storeExpenses?JSON.parse(storeExpenses):[];

       dataArray.push(expense);

       localStorage.setItem("storeExpenses",JSON.stringify(dataArray));              

        expenseForm.reset();

        displayExpenses();
    });
});

function displayExpenses(){

    const expenseList = document.getElementById("expense-list");

        let storeExpenses = localStorage.getItem("storeExpenses");
    let dataArray = storeExpenses?JSON.parse(storeExpenses):[];

    const selectedCategory = filterCategory.value;

    let filteredExpenses = dataArray.filter((expense )=> {
        return selectedCategory === "All" || expense.expenseCategory === selectedCategory;
    });

    expenseList.innerHTML = "";

      filteredExpenses.forEach((expense,index)=>{
        const row = document.createElement("tr");
        row.innerHTML = `<td>${expense.expenseName}</td>
        <td>${expense.expenseAmount}</td>
        <td>${expense.expenseCategory}</td>
        <td>${expense.expenseDate}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>`;

        expenseList.insertBefore(row, expenseList.firstChild);
      });

      updateTotal(filteredExpenses);


      document.querySelector(".expense-table").style.display = filteredExpenses.length? "block":"none";

    document.querySelectorAll(".delete-btn").forEach((button)=>{
        button.addEventListener("click",(e)=>{
     const index = e.target.getAttribute("data-index");
        deleteExpense(index);
        });
    });
};

function deleteExpense(index){
    let storeExpenses = localStorage.getItem("storeExpenses");
    let dataArray = storeExpenses?JSON.parse(storeExpenses):[];

    dataArray.splice(index,1);

    localStorage.setItem("storeExpenses",JSON.stringify(dataArray));              

    displayExpenses();
}

function updateTotal(filteredExpenses) {
    // Calculate the total of the filtered expenses, ensuring expenseAmount is a number
    const total = filteredExpenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.expenseAmount);
        return isNaN(amount) ? sum : sum + amount;  // Avoid NaN by checking if the amount is valid
    }, 0);

    // Update the total on the page
    document.getElementById("expense-total").textContent = total.toFixed(2);
}

