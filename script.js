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
    Total              : 0,
    FoodTotal          : 0,
    TransportTotal     : 0,
    EntertainmentTotal : 0,
    ShoppingTotal      : 0,
    OtherTotal         : 0,

    calculateTotal     :function(n1, n2, n3, n4, n5)
    {
        return this.Total = n1 + n2 + n3 + n4 + n5;
    }
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



// show alert function
const showAlert = function()
{
	console.log("It' working");
}



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



const renderSpentValues = function()
{
	DOM.totalExpense.textContent       = `$${totalExpenses.Total}`; 
	DOM.foodTotal.textContent          = `$${totalExpenses.FoodTotal}`;
	DOM.transportTotal.textContent     = `$${totalExpenses.TransportTotal}`;
	DOM.entertainmentTotal.textContent = `$${totalExpenses.EntertainmentTotal}`;
	DOM.shoppingTotal.textContent      = `$${totalExpenses.ShoppingTotal}`;
	DOM.otherTotal.textContent         = `$${totalExpenses.OtherTotal}`;
}



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

    // add total based on category
    totalExpenses[`${expense.category}Total`] += expense.amount;

    // calculate total amount
    totalExpenses.calculateTotal
    (
        totalExpenses.FoodTotal,
        totalExpenses.TransportTotal,
        totalExpenses.EntertainmentTotal,
        totalExpenses.ShoppingTotal,
        totalExpenses.OtherTotal
    );

    // resetting values upon submit because user can directly start adding another expense rather than removing each input value themselves
    DOM.description.value = "";
    DOM.amount.value      = "";
    DOM.category.value    = "Food";

    // render total spent values for each category and for overall total

	renderSpentValues();
    renderExpense();

    console.log("Before Delete", {...expenseItems});

    console.log("Total Expense before edit:", {...totalExpenses})

});



// ====================  EDIT & DELETE BUTTON EVENT LISTENER ==================== //



DOM.expenseList.addEventListener('click', function(e)
{

    // edit button
    if (e.target.classList.contains('edit-btn'))
    {          

        const id = Number(e.target.dataset.id);

        let expense = expenseItems.find(item => item.id === id);

        console.log("Object before edit", {...expense});
        
        // update description
        let updateDescription = prompt("Please enter new description: ");

        while (!updateDescription)
        {
            updateDescription = prompt("Description cannot be empty, please write it: ");
        }

        
        expense.description = updateDescription

        
        // update category
        let updateCategory = prompt("Please select the category (Food, Transport, Entertainment, Shopping, Other): ");

        while
        (!(
            updateCategory === "Food" ||
            updateCategory === "Transport" ||
            updateCategory === "Entertainment" ||
            updateCategory === "Shopping" ||
            updateCategory === "Other"
        ))
        {
            updateCategory = prompt("Please only write either Food, Transport, Entertainment, Shopping or Other");
        }


		// removing the amount from current expense category
		if (totalExpenses[`${expense.category}Total`] - expense.amount < 0)
		{
			totalExpenses[`${expense.category}Total`] = 0;
		}
		else
		{
			totalExpenses[`${expense.category}Total`] -= expense.amount;
		}

		// updating the category to newly updated category
        expense.category = updateCategory

        
        // update amount
        let updateAmount = Number(prompt("Please write the amount in digit: "));


        while (!updateAmount)
        {
            updateAmount = Number(prompt("Amount cannot be empty or 0, Please enter correct Amount: "));
        };

		totalExpenses[`${expense.category}Total`] += updateAmount;
		totalExpenses.calculateTotal
		(
			totalExpenses.FoodTotal,
			totalExpenses.TransportTotal,
			totalExpenses.EntertainmentTotal,
			totalExpenses.ShoppingTotal,
			totalExpenses.OtherTotal
		);

		expense.amount = updateAmount;


		renderSpentValues();
        renderExpense();

        console.log({...expenseItems})
        console.log({...totalExpenses})


        return;
    };


    // delete button 
    if (e.target.classList.contains('delete-btn'))
    {
        // get current id because with this i can get the clicked item
        const id = Number(e.target.dataset.id);


        // finding the index because we need to get the object for the current index
        let index = expenseItems.findIndex(item => item.id === id);


        // find the actual object because we need to manipulate totalExpenses based on deleted item
        let expense = expenseItems.find(item => item.id === id);


        // deducting amount because amount needs to updated when an item is deleted
        totalExpenses[`${expense.category}Total`] -= expense.amount;
        totalExpenses.calculateTotal
        (
            totalExpenses.FoodTotal,
            totalExpenses.TransportTotal,
            totalExpenses.EntertainmentTotal,
            totalExpenses.ShoppingTotal,
            totalExpenses.OtherTotal
        );


        // removing the selected item
        expenseItems.splice(expense, 1);

		renderSpentValues();
        renderExpense();
        return;
    };
});
