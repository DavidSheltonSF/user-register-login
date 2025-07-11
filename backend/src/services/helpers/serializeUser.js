const formatDateToIso = require('./formatDateToISO');

function serializeUser(data) {
  const serializedData = {
    id: data.id,
    username: data.username,
    email: data.email,
    phone: data.phone,
  };
  return serializedData;
}

module.exports = serializeUser;
