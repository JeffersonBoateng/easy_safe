const API_URL = 'https://easysafe-backend.onrender.com';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');

showLoginBtn.addEventListener('click', () => {
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  showLoginBtn.classList.add('active');
  showSignupBtn.classList.remove('active');
});

showSignupBtn.addEventListener('click', () => {
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  showSignupBtn.classList.add('active');
  showLoginBtn.classList.remove('active');
});

document.getElementById('link-to-signup').addEventListener('click', (e) => {
  e.preventDefault();
  showSignupBtn.click();
});

document.getElementById('link-to-login').addEventListener('click', (e) => {
  e.preventDefault();
  showLoginBtn.click();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    errorEl.textContent = data.message || 'Login failed';
    return;
  }

  localStorage.setItem('user', JSON.stringify(data));
  window.location.href = 'index.html';
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const errorEl = document.getElementById('signup-error');
  errorEl.textContent = '';

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    errorEl.textContent = data.message || 'Sign up failed';
    return;
  }

  localStorage.setItem('user', JSON.stringify(data));
  window.location.href = 'index.html';
});