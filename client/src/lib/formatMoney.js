export default function formatMoney(amount = 0) {
  const options = {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
  };

  // check if its a clean amount
  if (amount % 2 === 0) {
    options.minimumFractionDigits = 0;
  }

  const formatter = Intl.NumberFormat('en-UK', options);

  return formatter.format(amount / 100);
}
