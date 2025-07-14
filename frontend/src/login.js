const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const userData = {
    email: form.email.value,
    password: form.password.value,
  };

  try {
    const response = await fetch(`${config.API_URL}:3000/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.status >= 400) {
      alert(data.error);
      return;
    }

    window.location.href = './profile.html';
  } catch (err) {
    console.log(err);
    alert('Server Error');
  }
});
