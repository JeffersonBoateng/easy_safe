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

async function loadAccountOptions() {
  const response = await fetch(`${API_URL}/accounts?user_id=${userData.user_id}`);
  const accounts = await response.json();

  const accountSelect = document.getElementById('tx-account-id');
  accountSelect.innerHTML = '';

  accounts.forEach(acc => {
    const option = document.createElement('option');
    option.value = acc.account_id;
    option.textContent = acc.name;
    accountSelect.appendChild(option);
  });
}

async function loadCategoryOptions() {
  const response = await fetch(`${API_URL}/categories?user_id=${userData.user_id}`);
  const categories = await response.json();

  const categorySelect = document.getElementById('tx-category-id');
  categorySelect.innerHTML = '';

  categories.forEach(cat => {
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

  transactions.forEach(tx => {
    const li = document.createElement('li');
    const sign = tx.transaction_type === 'deposit' ? '+' : '-';
    li.innerHTML = `<span>${tx.transaction_date}</span><span class="${tx.transaction_type}">${sign}${tx.amount}</span>`;
    list.appendChild(li);
  });
}

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
  loadTransactions();
});

loadAccountOptions();
loadCategoryOptions();
loadTransactions();