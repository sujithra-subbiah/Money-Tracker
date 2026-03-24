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

// 1. Get data from Local Storage
let transactions = localStorage.getItem('transactions') !== null ? 
    JSON.parse(localStorage.getItem('transactions')) : [];

// 2. Sound Helper
function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log("Sound interaction required"));
    }
}

// 3. Add Transaction Function
function addTransaction() {
    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter description and amount!');
        return;
    }

    playSound(clickSound);

    const transaction = {
        id: Math.floor(Math.random() * 1000000),
        text: text.value,
        amount: +amount.value 
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    text.focus(); 
}

// 4. UI Rendering
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toLocaleString()}</span>
    `;
    list.appendChild(item);
}

// 5. Calculations & Formatting
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

    // CHANGE COLOR IF BALANCE IS NEGATIVE
    if (total < 0) {
        balance.style.color = "#ef4444"; // Red color
    } else {
        balance.style.color = "#ffffff"; // White color
    }
}
// 6. Storage & Clear
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all transactions?')) {
        playSound(deleteSound);
        transactions = [];
        localStorage.clear();
        list.innerHTML = '';
        updateValues();
    }
});

// 7. Initializing
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

addBtn.addEventListener('click', addTransaction);
init();
