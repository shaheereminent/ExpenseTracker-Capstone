"use strict";



// ==================== DOM CACHING ==================== //



const DOM = 
{
    description       : document.getElementById('description'),
    amount            : document.getElementById('amount'),
    category          : document.getElementById('category'),
    expenseForm       : document.getElementById('expense-form'),
    emptyState        : document.querySelector ('.empty-state'),
    expenseList       : document.querySelector ('.expense-list'),
    totalExpense      : document.getElementById('total-expenses'),
    foodTotal         : document.getElementById('food-total'),
    transportTotal    : document.getElementById('transport-total'),
    shoppingTotal     : document.getElementById('shopping-total'),
    entertainmentTotal: document.getElementById('entertainment-total'),
    otherTotal        : document.getElementById('other-total'),
};



// ==================== DATA ==================== //



// id for each object of expense and it will icrement by 1 on each submit because id must be unique
let nextID = 1;



// declaring expenses array because on each submit this expense array will be populated
const expenseItems = [];



// declaring & storing total score of each category
const totalExpenses =
{
    total              : 0,
    FoodTotal          : 0,
    TransportTotal     : 0,
    EntertainmentTotal : 0,
    ShoppingTotal      : 0,
    OtherTotal         : 0
};




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
        <article class="expense-item" data-id="${expense.id}">
            <div class="expense-icon">${categoryIcon(expense.category)}</div>

            <div class="expense-info">
                <h3>${expense.description}</h3>
                <span class="expense-category">${expense.category}</span>
            </div>

            <div class="expense-amount">$${expense.amount}</div>

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
    if (expenseItems.length === 0)
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
    for (let i=expenseItems.length-1; i>=0; i--)
    {
        expenseHTML += expenseToHTML(expenseItems[i]);
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

    
    // adds current expense to expenseItems array
    expenseItems.push(expense);

    // calculateTotalExpense(expense.amount);

    totalExpenses.total += expense.amount;

    // add total based on category
    totalExpenses[`${expense.category}Total`] += expense.amount;
    
    // resetting values upon submit because user can directly start adding another expense rather than removing each input value themselves
    DOM.description.value = "";
    DOM.amount.value      = "";
    DOM.category.value    = "Food";

    // render total spent values for each category and for overall total
    DOM.totalExpense.textContent       = `$${totalExpenses.total}`; 
    DOM.foodTotal.textContent          = `$${totalExpenses.FoodTotal}`;
    DOM.transportTotal.textContent     = `$${totalExpenses.TransportTotal}`;
    DOM.entertainmentTotal.textContent = `$${totalExpenses.EntertainmentTotal}`;
    DOM.shoppingTotal.textContent      = `$${totalExpenses.ShoppingTotal}`;
    DOM.otherTotal.textContent         = `$${totalExpenses.OtherTotal}`;

    renderExpense();
     
});



// ==================== EDIT BUTTON EVENT LISTENER ==================== //



DOM.expenseList.addEventListener('click', function(e)
{

    if (e.target.classList.contains('edit-btn'))
    {          

        const id = Number(e.target.dataset.id);

        let expense = expenseItems.find(item => item.id === id);

        console.log("Object before edit", {...expense});
        
        let updateDescription = prompt("Please enter new description: ");

        expense.description = updateDescription 

        console.log(`Edit clicked for the item id ${id}`);
        console.log("Object after edit", {...expense});
        
        return;
    };

    if (e.target.classList.contains('delete-btn'))
    {
        const id = e.target.dataset.id;
        console.log(`Delete clicked for the item id: ${id}`);
    
        return;
    };
});
