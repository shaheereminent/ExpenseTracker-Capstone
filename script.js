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

let nextID = 1;



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

    expenses.push(expense)
    
    for (let i=0; i<expenses.length; i++)
    {
        console.log(expenses[i])
    };
    
});

