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

async function loadCategories() {
  const response = await fetch(`${API_URL}/categories?user_id=${userData.user_id}`);
  const categories = await response.json();

  const list = document.getElementById('category-list');
  list.innerHTML = '';

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${cat.name}</span><span>${cat.category_type}</span>`;
    list.appendChild(li);
  });
}

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

loadCategories();