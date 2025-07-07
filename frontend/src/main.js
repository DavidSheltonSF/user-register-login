const usernameField = document.querySelector('.username-field');
const passwordField = document.querySelector('.password-field');
const emailField = document.querySelector('.email-field');
const phoneField = document.querySelector('.phone-field');
const birthdayField = document.querySelector('.birthday-field');
const profilePictureField = document.querySelector('.profile-picture-field');

const registerButton = document.querySelector('.form-register-btn');

registerButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const username = usernameField.value;
  const password = passwordField.value;
  const email = emailField.value;
  const phone = phoneField.value;
  const birthday = birthdayField.value;
  const profilePicture = profilePictureField.value;
  // usernameField.value = '';
  // passwordField.value = '';
  // emailField.value = '';
  // phoneField.value = '';
  // birthdayField.value = '';
  // profilePictureField.value = '';

  const data = {
    username,
    password,
    email,
    phone,
    birthday,
    profile_picture: profilePicture,
  };
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(response)
  } catch (err) {
    console.log('error!!!!')
    console.log(err);
  }
});
