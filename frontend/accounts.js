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

async function loadAccounts() {
  const response = await fetch(`${API_URL}/accounts?user_id=${userData.user_id}`);
  const accounts = await response.json();

  const list = document.getElementById('account-list');
  list.innerHTML = '';

  accounts.forEach(acc => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${acc.name} (${acc.account_type})</span><span>${acc.currency} ${acc.balance}</span>`;
    list.appendChild(li);
  });
}

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

loadAccounts();