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

async function loadAccounts() {
  const response = await fetch(`${API_URL}/accounts?user_id=${userData.user_id}`);
  const accounts = await response.json();

  const list = document.getElementById('account-list');
  list.innerHTML = '';

  let total = 0;
  const accountSelect = document.getElementById('tx-account-id');
  accountSelect.innerHTML = '';

  accounts.forEach(acc => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${acc.name} (${acc.account_type})</span><span>${acc.currency} ${acc.balance}</span>`;
    list.appendChild(li);

    total += parseFloat(acc.balance);

    const option = document.createElement('option');
    option.value = acc.account_id;
    option.textContent = acc.name;
    accountSelect.appendChild(option);
  });

  currentBalance = total;
  updateBalanceDisplay();
}

async function loadCategories() {
  const response = await fetch(`${API_URL}/categories?user_id=${userData.user_id}`);
  const categories = await response.json();

  const list = document.getElementById('category-list');
  list.innerHTML = '';

  const categorySelect = document.getElementById('tx-category-id');
  categorySelect.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${cat.name}</span><span>${cat.category_type}</span>`;
    list.appendChild(li);

    const option = document.createElement('option');
    option.value = cat.category_id;
    option.textContent = `${cat.name} (${cat.category_type})`;
    categorySelect.appendChild(option);
  });
}

async function loadTransactions() {
  const response = await fetch(`${API_URL}/transactions?user_id=${userData.user_id}`);
  const transactions = await response.json();

  const list = document.getElementById('transaction-list');
  list.innerHTML = '';

  transactions.slice(0, 10).forEach(tx => {
    const li = document.createElement('li');
    const sign = tx.transaction_type === 'deposit' ? '+' : '-';
    li.innerHTML = `<span>${tx.transaction_date}</span><span class="${tx.transaction_type}">${sign}${tx.amount}</span>`;
    list.appendChild(li);
  });
}

// ----- Add Account -----
document.getElementById('toggle-add-account').addEventListener('click', () => {
  document.getElementById('account-form').classList.toggle('hidden');
});

document.getElementById('account-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('acc-name').value;
  const account_type = document.getElementById('acc-type').value;
  const balance = document.getElementById('acc-balance').value || 0;

  await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userData.user_id,
      name,
      account_type,
      balance: Number(balance)
    })
  });

  document.getElementById('account-form').reset();
  document.getElementById('account-form').classList.add('hidden');
  loadAccounts();
});

// ----- Add Category -----
document.getElementById('toggle-add-category').addEventListener('click', () => {
  document.getElementById('category-form').classList.toggle('hidden');
});

document.getElementById('category-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('cat-name').value;
  const category_type = document.getElementById('cat-type').value;

  await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userData.user_id,
      name,
      category_type
    })
  });

  document.getElementById('category-form').reset();
  document.getElementById('category-form').classList.add('hidden');
  loadCategories();
});

// ----- Add Transaction -----
document.getElementById('toggle-add-tx').addEventListener('click', () => {
  document.getElementById('transaction-form').classList.toggle('hidden');
});

document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const account_id = document.getElementById('tx-account-id').value;
  const category_id = document.getElementById('tx-category-id').value;
  const amount = document.getElementById('tx-amount').value;
  const transaction_type = document.getElementById('tx-type').value;

  await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      account_id: Number(account_id),
      category_id: Number(category_id),
      amount: Number(amount),
      transaction_type
    })
  });

  document.getElementById('transaction-form').reset();
  document.getElementById('transaction-form').classList.add('hidden');
  loadAccounts();
  loadTransactions();
});

loadAccounts();
loadCategories();
loadTransactions();