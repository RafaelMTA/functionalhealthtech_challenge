export function generateAccountNumber(): string {
  const randomNumber = Math.floor(10000 + Math.random() * 90000);
  return `${randomNumber}`;
}