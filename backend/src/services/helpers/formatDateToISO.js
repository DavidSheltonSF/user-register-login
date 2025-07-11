function formatDateToIso(date) {
  const formatedDate = date.toISOString().split('T')[0];
  return formatedDate;
}

module.exports = formatDateToIso;
