const checkLength = (string, maxLength) => string.length <= maxLength;

const checkPalindrome = (string) => {
  const normalizedString = string.replaceAll(' ', '').toUpperCase();
  let reversedString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }
  return normalizedString === reversedString;
};

const getNumbers = (string) => {
  string = string.toString();
  let result = '';
  let number;
  for (let i = 0; i < string.length; i++) {
    number = parseInt(string[i], 10);
    if (!Number.isNaN(number)) {
      result += number;
    }
  }

  return Number(result) || NaN;
};
