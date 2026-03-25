document.addEventListener('DOMContentLoaded', () => {
    // Elements Selection
    const balance = document.getElementById('balance');
    const money_plus = document.getElementById('money-plus');
    const money_minus = document.getElementById('money-minus');
    const list = document.getElementById('list');
    const text = document.getElementById('text');
    const amount = document.getElementById('amount');
    const addBtn = document.getElementById('add-btn');
    const clearBtn = document.getElementById('clear-btn');
    const clickSound = document.getElementById('click-sound');
    const deleteSound = document.getElementById('delete-sound');
    // Mobile Sound Unlock Function
function unlockAudio() {
    clickSound.play().then(() => {
        clickSound.pause();
        clickSound.currentTime = 0;
    }).catch(e => console.log("Waiting for user interaction"));
    
    deleteSound.play().then(() => {
        deleteSound.pause();
        deleteSound.currentTime = 0;
    }).catch(e => console.log("Waiting for user interaction"));

    // Oru thadavai unlock aana podhum, so listener-ai remove panniduvom
    document.removeEventListener('click', unlockAudio);
}

// User screen-la enga click pannalum sound unlock aagum
document.addEventListener('click', unlockAudio);

    // 1. Data eduppom
    let transactions = localStorage.getItem('transactions') !== null ? 
        JSON.parse(localStorage.getItem('transactions')) : [];

    // 2. Placeholder update logic
function updatePlaceholder() {
    if (transactions.length === 0) {
        // First Time: Asking for the base amount
        text.placeholder = "What is your starting amount? (e.g. My Savings)";
        amount.placeholder = "Enter amount (e.g. 5000)";
    } else {
        // Next Times: Asking for specific spending or earning
        text.placeholder = "What happened next? (e.g. Tea, Salary, Petrol)";
        amount.placeholder = "Use '-' for spending (e.g. -50)";
    }
}

    // 3. UI logic
    function updateValues() {
        const amounts = transactions.map(t => t.amount);
        const total = amounts.reduce((acc, item) => (acc += item), 0);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
        const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        balance.innerText = formatter.format(total);
        money_plus.innerText = `+${formatter.format(income)}`;
        money_minus.innerText = `-${formatter.format(expense)}`;
        balance.style.color = total < 0 ? "#ef4444" : "#ffffff";
    }

    function addTransactionDOM(transaction) {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        item.innerHTML = `
            ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toLocaleString()}</span>
        `;
        list.appendChild(item);
    }

    // 4. MAIN ACTION: Add Transaction
    function addTransaction() {
        if (text.value.trim() === '' || amount.value.trim() === '') {
            alert('Please fill all fields');
            return;
        }

        const transaction = {
            id: Math.floor(Math.random() * 1000000),
            text: text.value,
            amount: +amount.value 
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log("Sound error"));
        }
        
        updatePlaceholder();
        text.value = '';
        amount.value = '';
        text.focus();
    }

    // 5. Clear All
    clearBtn.addEventListener('click', () => {
        if (confirm('Delete all data?')) {
            transactions = [];
            localStorage.clear();
            list.innerHTML = '';
            updateValues();
            updatePlaceholder();
            if (deleteSound) deleteSound.play();
        }
    });

    // 6. Init
    function init() {
        list.innerHTML = '';
        transactions.forEach(addTransactionDOM);
        updateValues();
        updatePlaceholder();
    }

    // Event Listeners bind pannuvom
    addBtn.addEventListener('click', addTransaction);
    
    init();
});