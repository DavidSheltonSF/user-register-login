const usernameField = document.querySelector('.username-field');
const passwordField = document.querySelector('.password-field');
const emailField = document.querySelector('.email-field');
const phoneField = document.querySelector('.phone-field');
const birthdayField = document.querySelector('.birthday-field');
const profilePictureField = document.querySelector('.profile-picture-field');

const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      body: formData,
    });
    console.log(response);

    if(response.status < 500){
      const data = await response.json();
      console.log(data);
    }
    
    if(response.status < 400){
      alert('User registred succesfuly!');
      console.log('User registred succesfuly!');
      usernameField.value = '';
      passwordField.value = '';
      emailField.value = '';
      phoneField.value = '';
      birthdayField.value = '';
      profilePictureField.value = '';
    }

    else if (response.status < 500) {
      alert(data.message);
      console.log(data.message);
    } 
    else {
      alert('Server Error')
    }

  } catch (err) {
    console.log('error!!!!');
    console.log(err);
  }
});
