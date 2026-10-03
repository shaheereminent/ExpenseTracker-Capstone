"use strict";



// ==================== DOM CACHING ==================== //

const DOM = 
{
    description : document.getElementById('description'),
    amount      : document.getElementById('amount'),
    category    : document.getElementById('category'),
    expenseForm : document.getElementById('expense-form'),
    emptyState  : document.querySelector ('.empty-state'),
};



// ==================== DATA ==================== //



// id for each object of expense and it will icrement by 1 on each submit because id must be unique
let nextID = 1;



// declaring expenses array because on each submit this expense array will be populated
const expenses = [];


const expenseToHTML()
{
    return `
        <article class="expense-item">
            <div class="expense-icon">${expense.category}</div>
            <div class="expense-info">
                <h3>${expense.description}</h3>
                <span class="expense-category">${expense.category}</span>
            </div>
            <div class="expense-amount">Rs. ${expense.amount}</div>
            <div class="expense-actions">
                <button class="edit-btn" data-id="${expense.id}">✎</button>
                <button class="delete-btn" data-id="${expense.id}">×</button>
            </div>
        </article>
  `;       
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
    
    // checking expense list has any items inside it because if it doesn't then display shows empty state
    if (expenses.length > 0)
    {
        DOM.emptyState.classList.add('hidden');
    }
    else
    {
        DOM.emptyState.classList.remove('hidden');
    };

    // resetting values upon submit because user can directly start adding another expense rather than removing each input value themselves
    DOM.description.value = "";
    DOM.amount.value      = "";
    DOM.category.value    = "Food";

    console.log(expenses);
     
});

