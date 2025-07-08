const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;

  const userData = {
    email: form.email.value,
    password: form.password.value,
  };

  console.log(userData);

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    console.log(response);

    if (response.status < 500) {
      const data = await response.json();
      console.log(data);
    }

    if (response.status < 400) {
      alert('User logged succesfuly!');
      console.log('User logged succesfuly!');
    } else if (response.status < 500) {
      alert(data.message);
      console.log(data.message);
    } else {
      alert('Server Error');
    }
  } catch (err) {
    console.log('error!!!!');
    console.log(err);
    alert('Server Error');
  }
});
