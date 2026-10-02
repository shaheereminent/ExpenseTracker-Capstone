"use strict";

// ==================== DOM CACHING ==================== //

const DOM = 
{
    description: document.getElementById('description'),
    amount     : document.getElementById('amount')
};

console.log(DOM.description, DOM.amount)

// ==================== DATA ==================== //

const expenses = [];

console.log(expenses);

expenses.push
(
    {
        id         : Date.now(),
        amount     : 520,
        description: "What goes here comes here",
        category   : "Food"
    },

    {
        id         : Date.now(),
        amount     : 631,
        description: "a mistake was made",
        category   : "Travel"
    }
);

for (let i=0; i<expenses.length; i++)
{
    console.log(i)
    console.log(expenses[i])
};

