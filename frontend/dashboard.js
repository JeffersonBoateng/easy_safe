const API_URL = 'https://easysafe-backend.onrender.com';

const userData = JSON.parse(localStorage.getItem('user'));

if (!userData) {
  window.location.href = 'auth.html';
}

document.getElementById('welcome-msg').textContent = `Hi, ${userData.name}`;

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'auth.html';
});

let currentBalance = 0;
let balanceVisible = true;

function updateBalanceDisplay() {
  const el = document.getElementById('total-balance');
  el.textContent = balanceVisible ? `GHS ${currentBalance.toFixed(2)}` : 'GHS ••••••';
}

document.getElementById('toggle-balance').addEventListener('click', () => {
  balanceVisible = !balanceVisible;
  updateBalanceDisplay();
});

async function loadBalance() {
  const response = await fetch(`${API_URL}/accounts?user_id=${userData.user_id}`);
  const accounts = await response.json();

  let total = 0;
  accounts.forEach(acc => {
    total += parseFloat(acc.balance);
  });

  currentBalance = total;
  updateBalanceDisplay();
}

async function loadTransactions() {
  const response = await fetch(`${API_URL}/transactions?user_id=${userData.user_id}`);
  const transactions = await response.json();

  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  transactions.slice(0, 5).forEach(tx => {
    const li = document.createElement('li');
    const sign = tx.transaction_type === 'deposit' ? '+' : '-';
    li.innerHTML = `<span>${tx.transaction_date}</span><span class="${tx.transaction_type}">${sign}${tx.amount}</span>`;
    list.appendChild(li);
  });
}

loadBalance();
loadTransactions();