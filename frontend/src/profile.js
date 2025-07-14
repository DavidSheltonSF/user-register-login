const infoContainer = document.querySelector('.flex-container-center');
infoContainer.innerHTML = `
  <h1>Your profile is loading...<h1>
`;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const meResponse = await fetch(`${config.API_URL}:3000/me`, {
      credentials: 'include',
      method: 'GET',
    });

    const meData = (await meResponse.json()).data;

    const userId = meData.userId;

    const response = await fetch(`${config.API_URL}:3000/user/` + userId, {
      credentials: 'include',
      method: 'GET',
    });

    const userData = (await response.json()).data;

    console.log(userData);

    const { username, email, phone, profile } = userData;

    console.log(userData);

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
            </div>
          </form>`;

    const mainTitle = document.querySelector('.main-title');
    const profilePicture = document.querySelector('.profile-picture');
    const usernameField = document.querySelector('.username-field');
    const emailField = document.querySelector('.email-field');
    const phoneField = document.querySelector('.phone-field');
    const birthdayField = document.querySelector('.birthday-field');

    mainTitle.innerText = `Hi, ${username}!`;
    usernameField.value = username;
    emailField.value = email;
    phoneField.value = phone;
    birthdayField.value = profile.birthday;

    if (profile.profile_picture) {
      profilePicture.src = profile.profile_picture;
    }

  } catch (err) {
    console.log(err);
    const infoContainer = document.querySelector('.flex-container-center');
    infoContainer.innerHTML = `
  <h1>Something went wrong<h1>
`;
  }
});
