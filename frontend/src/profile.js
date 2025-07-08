const infoContainer = document.querySelector('.flex-container-center');
infoContainer.innerHTML = `
  <h1>Your profile is loading...<h1>
`;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('http://localhost:3000/me', {
      credentials: 'include',
      method: 'GET',
    });

    const data = await response.json();

    const userId = data.body.userId;

    const userResponse = await fetch('http://localhost:3000/user/' + userId, {
      credentials: 'include',
      method: 'GET',
    });

    const userData = (await userResponse.json()).body;

    console.log(userData);

    const {username, email, phone, profile} = userData;

    infoContainer.innerHTML = `
      <form id="register-form" action="">
            <div class="fields-wrapper">
              <input
                class="form-field username-field"
                placeholder="username"
                type="text"
                name="username"
                disabled
              />
              <input
                class="form-field email-field"
                placeholder="email"
                type="email"
                name="email"
                disabled
              />
              <input
                class="form-field phone-field"
                placeholder="phone"
                type="tel"
                name="phone"
                disabled
              />
              <input
                class="form-field birthday-field"
                placeholder="birthday"
                name="birthday"
                type="date"
                disabled
              />
              <button type="submit" class="form-btn form-register-btn">Register</button>
            </div>
          </form>`;

      const usernameField = document.querySelector('.username-field');
      const emailField = document.querySelector('.email-field');
      const phoneField = document.querySelector('.phone-field');
      const birthdayField = document.querySelector('.birthday-field');

      usernameField.value = username;
      emailField.value = email;
      phoneField.value = phone;
      birthdayField.value = profile.birthday;

  } catch (err) {
    console.log(err);
    const infoContainer = document.querySelector('.flex-container-center');
    infoContainer.innerHTML = `
  <h1>Something went wrong<h1>
`;
  }
});
