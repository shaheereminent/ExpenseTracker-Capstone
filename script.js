"use strict";



// ==================== DOM CACHING ==================== //

const DOM = 
{
    description : document.getElementById('description'),
    amount      : document.getElementById('amount'),
    category    : document.getElementById('category'),
    expenseBtn  : document.getElementById('add-expense-btn'),
    expenseForm : document.getElementById('expense-form')
};



// ==================== DATA ==================== //



// id for each object of expense and it will icrement by 1 on each submit because id must be unique
let nextID = 1;



// declaring expenses array because on each submit this expense array will be populated
const expenses = [];



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

    DOM.description.value = "";
    DOM.amount.value      = "";
    DOM.category.value    = "Food";

    expenses.push(expense);

    console.log(expenses);
     
});

