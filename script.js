"use strict";



// ==================== DOM CACHING ==================== //



const DOM =
{
    description           : document.getElementById  ('description'),
    amount                : document.getElementById  ('amount'),
    category              : document.getElementById  ('category'),
    expenseForm           : document.getElementById  ('expense-form'),
    emptyState            : document.querySelector   ('.empty-state'),
    expenseList           : document.querySelector   ('.expense-list'),
    totalExpense          : document.getElementById  ('total-expenses'),
    foodTotal             : document.getElementById  ('food-total'),
    transportTotal        : document.getElementById  ('transport-total'),
    shoppingTotal         : document.getElementById  ('shopping-total'),
    entertainmentTotal    : document.getElementById  ('entertainment-total'),
    otherTotal            : document.getElementById  ('other-total'),
    alertPopup            : document.getElementById  ('alert-popup'),
    expenseCount          : document.getElementById  ('expense-count'),

    // Add form custom dropdown
    categoryToggle        : document.getElementById  ('category-toggle'),
    categoryDropdown      : document.getElementById  ('category-dropdown'),

    // Filter custom dropdown
    filterToggle          : document.getElementById  ('filter-toggle'),
    filterDropdown        : document.getElementById  ('filter-dropdown'),

    // Edit modal
    editModal             : document.getElementById  ('edit-modal'),
    editForm              : document.getElementById  ('edit-form'),
    editDescription       : document.getElementById  ('edit-description'),
    editAmount            : document.getElementById  ('edit-amount'),
    editCategory          : document.getElementById  ('edit-category'),
    editExpenseId         : document.getElementById  ('edit-expense-id'),
    editModalClose        : document.getElementById  ('edit-modal-close'),
    editCancelBtn         : document.getElementById  ('edit-cancel-btn'),
    editCategoryToggle    : document.getElementById  ('edit-category-toggle'),
    editCategoryDropdown  : document.getElementById  ('edit-category-dropdown'),

    // Delete modal
    deleteModal           : document.getElementById  ('delete-modal'),
    deleteExpenseId       : document.getElementById  ('delete-expense-id'),
    deleteExpenseName     : document.getElementById  ('delete-expense-name'),
    deleteModalClose      : document.getElementById  ('delete-modal-close'),
    deleteCancelBtn       : document.getElementById  ('delete-cancel-btn'),
    deleteConfirmBtn      : document.getElementById  ('delete-confirm-btn'),
};



// ==================== DATA ==================== //



let nextID = 1;

const expenseItems = [];

let currentFilter = "all";

const totalExpenses =
{
    Total              : 0,
    FoodTotal          : 0,
    TransportTotal     : 0,
    EntertainmentTotal : 0,
    ShoppingTotal      : 0,
    OtherTotal         : 0,

    calculateTotal     : function()
    {
        return this.Total = this.FoodTotal + this.TransportTotal + this.EntertainmentTotal + this.ShoppingTotal + this.OtherTotal;
    }
};



// ==================== SVG ICONS MAP (used everywhere) ==================== //



const CATEGORY_SVGS =
{
    Food: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>`,

    Transport: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/>
        <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/>
        <path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 21v-2"/>
    </svg>`,

    Entertainment: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M10 11h.01"/><path d="M14 6h.01"/><path d="M18 6h.01"/><path d="M6.5 13.1h.01"/>
        <path d="M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3"/>
        <path d="M17.4 9.9c-.8.8-2 .8-2.8 0"/>
        <path d="M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7"/>
        <path d="M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4"/>
    </svg>`,

    Shopping: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/>
        <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
    </svg>`,

    Other: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="lucide"><circle cx="19" cy="19" r="2"/>
        <circle cx="5" cy="5" r="2"/><path d="M6.48 3.66a10 10 0 0 1 13.86 13.86"/>
        <path d="m6.41 6.41 11.18 11.18"/><path d="M3.66 6.48a10 10 0 0 0 13.86 13.86"/>
    </svg>`
};


// Smaller version for dropdown button display
const CATEGORY_SVGS_SM =
{
    Food: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>`,

    Transport: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/>
        <rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/>
        <path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 21v-2"/>
    </svg>`,

    Entertainment: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M10 11h.01"/><path d="M14 6h.01"/><path d="M18 6h.01"/><path d="M6.5 13.1h.01"/>
        <path d="M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3"/>
        <path d="M17.4 9.9c-.8.8-2 .8-2.8 0"/>
        <path d="M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7"/>
        <path d="M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4"/>
    </svg>`,

    Shopping: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round" class="lucide">
        <path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/>
        <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
    </svg>`,

    Other: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="lucide"><circle cx="19" cy="19" r="2"/>
        <circle cx="5" cy="5" r="2"/><path d="M6.48 3.66a10 10 0 0 1 13.86 13.86"/>
        <path d="m6.41 6.41 11.18 11.18"/><path d="M3.66 6.48a10 10 0 0 0 13.86 13.86"/>
    </svg>`
};



// ==================== CUSTOM DROPDOWN HELPER ==================== //



function setupCustomDropdown(toggleBtn, dropdownList, hiddenInput, onSelect)
{
    // Toggle open/close
    toggleBtn.addEventListener('click', function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyOpen = !dropdownList.classList.contains('hidden');

        // Close all dropdowns first
        closeAllDropdowns();

        // If it was open, it's now closed (toggle behavior). If it was closed, open it.
        if (!isCurrentlyOpen)
        {
            dropdownList.classList.remove('hidden');
            toggleBtn.classList.add('open');
        }
    });

    // Item selection
    dropdownList.addEventListener('click', function(e)
    {
        const item = e.target.closest('.custom-dropdown-item');
        if (!item) return;

        const value = item.dataset.value;

        // Update active state
        dropdownList.querySelectorAll('.custom-dropdown-item').forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // Update hidden input
        if (hiddenInput) hiddenInput.value = value;

        // Update button display
        const displayEl = toggleBtn.querySelector('.custom-select-display');
        if (displayEl)
        {
            displayEl.innerHTML = `${CATEGORY_SVGS_SM[value]}<span>${value}</span>`;
        }

        // Close dropdown
        dropdownList.classList.add('hidden');
        toggleBtn.classList.remove('open');

        // Callback
        if (onSelect) onSelect(value);
    });
}



function setupFilterDropdown(toggleBtn, dropdownList, onSelect)
{
    toggleBtn.addEventListener('click', function(e)
    {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyOpen = !dropdownList.classList.contains('hidden');

        // Close all dropdowns first
        closeAllDropdowns();

        // Toggle: if was open, stay closed. If was closed, open.
        if (!isCurrentlyOpen)
        {
            dropdownList.classList.remove('hidden');
            toggleBtn.classList.add('open');
        }
    });

    dropdownList.addEventListener('click', function(e)
    {
        const item = e.target.closest('.filter-dropdown-item');
        if (!item) return;

        const value = item.dataset.value;

        // Update active state
        dropdownList.querySelectorAll('.filter-dropdown-item').forEach(li => li.classList.remove('active'));
        item.classList.add('active');

        // Update button text
        toggleBtn.querySelector('span').textContent = item.textContent.trim();

        // Close
        dropdownList.classList.add('hidden');
        toggleBtn.classList.remove('open');

        if (onSelect) onSelect(value);
    });
}



function closeAllDropdowns()
{
    document.querySelectorAll('.custom-dropdown, .filter-dropdown').forEach(dd =>
    {
        dd.classList.add('hidden');
    });

    document.querySelectorAll('.custom-select-btn, .filter-select-btn').forEach(btn =>
    {
        btn.classList.remove('open');
    });
}



// Close dropdowns when clicking outside
document.addEventListener('click', function(e)
{
    if (!e.target.closest('.form-group') && !e.target.closest('.filter-dropdown-wrapper'))
    {
        closeAllDropdowns();
    }
});



// ==================== INITIALIZE DROPDOWNS ==================== //



// Add expense form category dropdown
setupCustomDropdown(
    DOM.categoryToggle,
    DOM.categoryDropdown,
    DOM.category,
    null
);



// Edit modal category dropdown
setupCustomDropdown(
    DOM.editCategoryToggle,
    DOM.editCategoryDropdown,
    DOM.editCategory,
    null
);



// Filter dropdown
setupFilterDropdown(
    DOM.filterToggle,
    DOM.filterDropdown,
    function(value)
    {
        currentFilter = value;
        renderExpense();
    }
);



// ==================== RENDERING ==================== //



const expenseToHTML = function(expense)
{
    const formattedAmount = expense.amount.toLocaleString();
    const categoryLower   = expense.category.toLowerCase();
    const iconSVG         = CATEGORY_SVGS[expense.category];

    return `
        <article class="expense-item" data-id="${expense.id}">
            <div class="expense-icon ${categoryLower}">${iconSVG}</div>

            <div class="expense-info">
                <h3>${expense.description}</h3>
                <span class="expense-category">${expense.category}</span>
            </div>

            <div class="expense-amount">$${formattedAmount}</div>

            <div class="expense-actions">
                <button class="edit-btn" data-id="${expense.id}" aria-label="Edit expense">✎</button>
                <button class="delete-btn" data-id="${expense.id}" aria-label="Delete expense">×</button>
            </div>

        </article>
    `;
};



const renderSpentValues = function()
{
    const formattedValue = function(value)
    {
        return `$${value.toLocaleString()}`;
    }

    DOM.totalExpense.textContent       = formattedValue(totalExpenses.Total);
    DOM.foodTotal.textContent          = formattedValue(totalExpenses.FoodTotal);
    DOM.transportTotal.textContent     = formattedValue(totalExpenses.TransportTotal);
    DOM.entertainmentTotal.textContent = formattedValue(totalExpenses.EntertainmentTotal);
    DOM.shoppingTotal.textContent      = formattedValue(totalExpenses.ShoppingTotal);
    DOM.otherTotal.textContent         = formattedValue(totalExpenses.OtherTotal);
};



const showAlert = function(message)
{
    DOM.alertPopup.innerHTML = `<strong>${message}</strong>`;
    DOM.alertPopup.classList.remove('hidden');

    setTimeout(() =>
    {
        DOM.alertPopup.classList.add('hidden');
    }, 4000);
};



const renderExpense = function()
{
    // Filter items based on current filter
    let filteredItems = expenseItems;

    if (currentFilter !== "all")
    {
        filteredItems = expenseItems.filter(item => item.category === currentFilter);
    }

    // Update expense count
    DOM.expenseCount.textContent = expenseItems.length;

    // Check if filtered list is empty
    if (filteredItems.length === 0)
    {
        DOM.emptyState.classList.remove('hidden');
        DOM.expenseList.innerHTML = "";
        DOM.expenseList.appendChild(DOM.emptyState);
        return;
    }

    // Remove empty state
    DOM.emptyState.classList.add('hidden');

    let expenseHTML = "";

    for (let i = filteredItems.length - 1; i >= 0; i--)
    {
        expenseHTML += expenseToHTML(filteredItems[i]);
    }

    DOM.expenseList.innerHTML = expenseHTML;
};



// ==================== HELPER: SET DROPDOWN VALUE ==================== //



function setDropdownValue(toggleBtn, dropdownList, hiddenInput, value)
{
    // Update hidden input
    hiddenInput.value = value;

    // Update button display
    const displayEl = toggleBtn.querySelector('.custom-select-display');
    if (displayEl)
    {
        displayEl.innerHTML = `${CATEGORY_SVGS_SM[value]}<span>${value}</span>`;
    }

    // Update active state in dropdown
    dropdownList.querySelectorAll('.custom-dropdown-item').forEach(item =>
    {
        if (item.dataset.value === value)
        {
            item.classList.add('active');
        }
        else
        {
            item.classList.remove('active');
        }
    });
}



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
    totalExpenses.calculateTotal();

    // resetting values upon submit
    DOM.description.value = "";
    DOM.amount.value      = "";

    // Reset category dropdown to Food
    setDropdownValue(DOM.categoryToggle, DOM.categoryDropdown, DOM.category, "Food");

    // render
    renderSpentValues();
    renderExpense();

    showAlert("Expense Item Added ✅");
});



// ==================== EDIT & DELETE BUTTON EVENT LISTENER ==================== //



DOM.expenseList.addEventListener('click', function(e)
{

    // ========== EDIT BUTTON ========== //

    if (e.target.classList.contains('edit-btn'))
    {
        const id = Number(e.target.dataset.id);
        const expense = expenseItems.find(item => item.id === id);

        if (!expense) return;

        // Populate edit modal
        DOM.editExpenseId.value     = id;
        DOM.editDescription.value  = expense.description;
        DOM.editAmount.value       = expense.amount;

        // Set the category dropdown in edit modal
        setDropdownValue(DOM.editCategoryToggle, DOM.editCategoryDropdown, DOM.editCategory, expense.category);

        // Show modal
        DOM.editModal.classList.remove('hidden');

        // Focus description
        setTimeout(() => DOM.editDescription.focus(), 100);

        return;
    }


    // ========== DELETE BUTTON ========== //

    if (e.target.classList.contains('delete-btn'))
    {
        const id = Number(e.target.dataset.id);
        const expense = expenseItems.find(item => item.id === id);

        if (!expense) return;

        // Populate delete modal
        DOM.deleteExpenseId.value         = id;
        DOM.deleteExpenseName.textContent = expense.description;

        // Show modal
        DOM.deleteModal.classList.remove('hidden');

        return;
    }
});



// ==================== EDIT MODAL HANDLERS ==================== //



function closeEditModal()
{
    DOM.editModal.classList.add('hidden');

    // Close any open dropdowns inside the modal
    DOM.editCategoryDropdown.classList.add('hidden');
    DOM.editCategoryToggle.classList.remove('open');
}

DOM.editModalClose.addEventListener('click', closeEditModal);
DOM.editCancelBtn.addEventListener('click', closeEditModal);

// Close on overlay click
DOM.editModal.addEventListener('click', function(e)
{
    if (e.target === DOM.editModal) closeEditModal();
});



// Save edit
DOM.editForm.addEventListener('submit', function(e)
{
    e.preventDefault();

    const id              = Number(DOM.editExpenseId.value);
    const newDescription  = DOM.editDescription.value.trim();
    const newAmount       = Number(DOM.editAmount.value);
    const newCategory     = DOM.editCategory.value;

    if (!newDescription || !newAmount) return;

    const expense = expenseItems.find(item => item.id === id);
    if (!expense) return;

    // Remove old amount from old category
    if (totalExpenses[`${expense.category}Total`] - expense.amount < 0)
    {
        totalExpenses[`${expense.category}Total`] = 0;
    }
    else
    {
        totalExpenses[`${expense.category}Total`] -= expense.amount;
    }

    // Update expense
    expense.description = newDescription;
    expense.category    = newCategory;
    expense.amount      = newAmount;

    // Add new amount to new category
    totalExpenses[`${expense.category}Total`] += newAmount;
    totalExpenses.calculateTotal();

    // Re-render
    renderSpentValues();
    renderExpense();

    // Close modal
    closeEditModal();

    showAlert("Expense Item Updated 📄");
});



// ==================== DELETE MODAL HANDLERS ==================== //



function closeDeleteModal()
{
    DOM.deleteModal.classList.add('hidden');
}

DOM.deleteModalClose.addEventListener('click', closeDeleteModal);
DOM.deleteCancelBtn.addEventListener('click', closeDeleteModal);

// Close on overlay click
DOM.deleteModal.addEventListener('click', function(e)
{
    if (e.target === DOM.deleteModal) closeDeleteModal();
});



// Confirm delete
DOM.deleteConfirmBtn.addEventListener('click', function()
{
    const id = Number(DOM.deleteExpenseId.value);

    const index   = expenseItems.findIndex(item => item.id === id);
    const expense = expenseItems.find(item => item.id === id);

    if (!expense || index === -1) return;

    // Deduct amount
    totalExpenses[`${expense.category}Total`] -= expense.amount;
    totalExpenses.calculateTotal();

    // Remove
    expenseItems.splice(index, 1);

    // Re-render
    renderSpentValues();
    renderExpense();

    // Close modal
    closeDeleteModal();

    showAlert("Expense Item Deleted ❌");
});



// ==================== KEYBOARD: ESC TO CLOSE ==================== //



document.addEventListener('keydown', function(e)
{
    if (e.key === 'Escape')
    {
        closeAllDropdowns();

        if (!DOM.editModal.classList.contains('hidden'))
        {
            closeEditModal();
        }

        if (!DOM.deleteModal.classList.contains('hidden'))
        {
            closeDeleteModal();
        }
    }
});
