const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alertBox');
const btnLogin = document.getElementById('btnLogin');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    showAlert('Por favor completa todos los campos.', 'danger');
    return;
  }

  btnLogin.disabled = true;
  btnLogin.textContent = 'Ingresando...';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert(data.error || 'Credenciales incorrectas', 'danger');
      return;
    }

    window.location.href = data.redirect;
  } catch (err) {
    showAlert('Error de conexion con el servidor', 'danger');
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = 'Ingresar';
  }
});

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
}
