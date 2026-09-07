const API_URL = 'http://127.0.0.1:5000';

async function loadUsers() {
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();

  const list = document.getElementById('user-list');
  list.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} (${user.email})`;
    list.appendChild(li);
  });
}

document.getElementById('user-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  document.getElementById('user-form').reset();
  loadUsers();
});

loadUsers();

async function loadAccounts() {
  const response = await fetch(`${API_URL}/accounts`);
  const accounts = await response.json();

  const list = document.getElementById('account-list');
  list.innerHTML = '';
  accounts.forEach(acc => {
    const li = document.createElement('li');
    li.textContent = `${acc.name} (${acc.account_type}) - ${acc.balance} ${acc.currency}`;
    list.appendChild(li);
  });
}

document.getElementById('account-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user_id = document.getElementById('acc-user-id').value;
  const name = document.getElementById('acc-name').value;
  const account_type = document.getElementById('acc-type').value;
  const balance = document.getElementById('acc-balance').value || 0;

  await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: Number(user_id), name, account_type, balance: Number(balance) })
  });

  document.getElementById('account-form').reset();
  loadAccounts();
});

loadAccounts();

async function loadCategories() {
  const response = await fetch(`${API_URL}/categories`);
  const categories = await response.json();

  const list = document.getElementById('category-list');
  list.innerHTML = '';
  categories.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = `${cat.name} (${cat.category_type})`;
    list.appendChild(li);
  });
}

document.getElementById('category-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user_id = document.getElementById('cat-user-id').value;
  const name = document.getElementById('cat-name').value;
  const category_type = document.getElementById('cat-type').value;

  await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: Number(user_id), name, category_type })
  });

  document.getElementById('category-form').reset();
  loadCategories();
});

loadCategories();

async function loadTransactions() {
  const response = await fetch(`${API_URL}/transactions`);
  const transactions = await response.json();

  const list = document.getElementById('transaction-list');
  list.innerHTML = '';
  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.textContent = `${tx.transaction_type}: ${tx.amount} on ${tx.transaction_date}`;
    list.appendChild(li);
  });
}

document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const account_id = document.getElementById('tx-account-id').value;
  const category_id = document.getElementById('tx-category-id').value;
  const amount = document.getElementById('tx-amount').value;
  const transaction_type = document.getElementById('tx-type').value;

  await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_id: Number(account_id), category_id: Number(category_id), amount: Number(amount), transaction_type })
  });

  document.getElementById('transaction-form').reset();
  loadTransactions();
});

loadTransactions();