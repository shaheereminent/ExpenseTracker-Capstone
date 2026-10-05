"use strict";



// ==================== DOM CACHING ==================== //



const DOM = 
{
    description : document.getElementById('description'),
    amount      : document.getElementById('amount'),
    category    : document.getElementById('category'),
    expenseForm : document.getElementById('expense-form'),
    emptyState  : document.querySelector ('.empty-state'),
    expenseList : document.querySelector ('.expense-list'),
    editBtn     : document.querySelector ('.edit-btn'),
    totalExpense: document.getElementById('total-expenses')
};



// ==================== DATA ==================== //



// id for each object of expense and it will icrement by 1 on each submit because id must be unique
let nextID = 1;



// declaring expenses array because on each submit this expense array will be populated
const expenses = [];



// declaring totalExpenses array because gotta calculate sum of all expense
// const totalExpenses = [];
const totalExpenses =
{
    total              : [],
    FoodTotal          : [],
    TransportTotal     : [],
    EntertainmentTotal : [],
    ShoppingTotal      : [],
    OtherTotal         : []
};



// ==================== ADD TOTALS ==================== //


/*
const  calculateTotalExpense = function(amount)
{

    let sum = 0;

    totalExpenses.total.push(amount);

    for (let i=0; i<totalExpenses.length; i++)
    {
        sum += totalExpenses[i]
    };

    DOM.totalExpense.textContent = `Rs. ${sum}`
    
};
*/




const ICONS = 
{
    Food         : "🍜",
    Transport    : "🚌",
    Entertainment: "🎮",
    Shopping     : "🛍️",
    Other        : "🌱"
};


const categoryIcon = (category) => ICONS[category]



const expenseToHTML = function(expense)
{
    return `
        <article class="expense-item" data-id"${expense.id}">
            <div class="expense-icon">${categoryIcon(expense.category)}</div>

            <div class="expense-info">
                <h3>${expense.description}</h3>
                <span class="expense-category">${expense.category}</span>
            </div>

            <div class="expense-amount">${expense.amount}</div>

            <div class="expense-actions">
                <button class="edit-btn" data-id="${expense.id}" aria-label="Edit expense">✎</button>
                <button class="delete-btn" data-id="${expense.id}" aria-label="Delete expense">×</button>
            </div>

        </article>
    `;
};



const renderExpense = function()
{
    // checking if expenses array is empty show empty state
    if (expenses.length === 0)
    {
        DOM.emptyState.classList.remove('hidden');
        DOM.expenseList.innerHTML = "";
        return;
    };

    // removing empty state if expenses list is not empty
    DOM.emptyState.classList.add('hidden');


    // declaring expenseHTML row variable because will add dynamic html based on items in the expesnes array
    let expenseHTML = "";

    // adding html based on each items in the array
    for (let i=expenses.length-1; i>=0; i--)
    {
        expenseHTML += expenseToHTML(expenses[i]);
    };

    DOM.expenseList.innerHTML = expenseHTML;
    
};



// ==================== FORM SUBMISSION ==================== //



DOM.expenseForm.addEventListener('submit', function(e)
{
    e.preventDefault();
    
    const expense =
    {
        id          : nextID++,
        description : DOM.description.value,
        amount      : Number(DOM.amount.value),
        category    : DOM.category.value
    };

    expenses.push(expense);

    // calculateTotalExpense(expense.amount);

    totalExpenses.total.push(expense.amount);

    // add total based on category
    totalExpenses[`${expense.category}Total`].push(expense.amount);
    
    // resetting values upon submit because user can directly start adding another expense rather than removing each input value themselves
    DOM.description.value = "";
    DOM.amount.value      = "";
    DOM.category.value    = "Food";

    console.log(expenses);

    renderExpense();

    console.log(totalExpenses);
     
});



// ==================== EDIT BUTTON EVENT LISTENER ==================== //


/*
DOM.editBtn.addEventListener('click', function()
{

    console.log("working?");

});
*/
