function generateUniqueNumber(uniqueId: number, numberLength: number = 13): string {
  const currentDate: Date = new Date();
  const year: string = (currentDate.getFullYear() % 100).toString().padStart(2, '0');
  const month: string = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day: string = currentDate.getDate().toString().padStart(2, '0');
  const randomNumber: number = Math.floor(Math.random() * 900) + 100;
  const number: string = (uniqueId + 1).toString().padStart(numberLength - 9, '0'); // numberLength - 9 , 9 is length day + month + year + randomNumber
  return `${day}${month}${year}${randomNumber}${number}`;
}

export default generateUniqueNumber;
