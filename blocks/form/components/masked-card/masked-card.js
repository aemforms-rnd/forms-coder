export default function maskedCardLayout(fieldDiv) {
  const inputField = fieldDiv.querySelector('input[type="text"]');

  // Store the actual card number value
  let actualValue = '';

  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  function formatCardNumber(value) {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  // Mask the card number showing only last 4 digits
  function maskCardNumber(value) {
    const digitsOnly = value.replace(/\s/g, '');
    if (digitsOnly.length <= 4) {
      return formatCardNumber(digitsOnly);
    }
    const lastFour = digitsOnly.slice(-4);
    const maskedPart = '•'.repeat(Math.min(digitsOnly.length - 4, 12));
    const masked = maskedPart + lastFour;
    return formatCardNumber(masked);
  }

  // Handle input event
  inputField.addEventListener('input', (e) => {
    const cursorPosition = e.target.selectionStart;
    const previousLength = e.target.value.length;

    // Get only digits from input
    const digitsOnly = e.target.value.replace(/[^\d]/g, '');

    // Limit to 16 digits
    actualValue = digitsOnly.slice(0, 16);

    // Update the displayed value with masking
    const maskedDisplay = maskCardNumber(actualValue);
    e.target.value = maskedDisplay;

    // Restore cursor position accounting for added spaces
    const newLength = e.target.value.length;
    const diff = newLength - previousLength;
    e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);

    // Update the actual form value (hidden)
    e.target.dataset.actualValue = actualValue;
  });

  // Handle focus to show full card number for editing
  inputField.addEventListener('focus', () => {
    if (actualValue) {
      inputField.value = formatCardNumber(actualValue);
    }
  });

  // Handle blur to mask the card number
  inputField.addEventListener('blur', () => {
    if (actualValue) {
      inputField.value = maskCardNumber(actualValue);
    }
  });

  // Override form submission to use actual value
  const form = inputField.closest('form');
  if (form) {
    form.addEventListener('submit', () => {
      inputField.value = actualValue;
    });
  }

  // Add visual indicator
  inputField.classList.add('masked-card-input');

  // If there's an initial value, process it
  if (inputField.value) {
    actualValue = inputField.value.replace(/[^\d]/g, '').slice(0, 16);
    inputField.value = maskCardNumber(actualValue);
    inputField.dataset.actualValue = actualValue;
  }

  return fieldDiv;
}
