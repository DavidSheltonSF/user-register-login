const formatDateToIso = require('./formatDateToISO');

function serializeProfile(data) {
  const serializedData = {
    id: data.id,
    user_id: data.user_id,
    birthday: formatDateToIso(data.birthday),
    profile_picture: data.profile_picture,
  };
  return serializedData;
}

module.exports = serializeProfile;
