/**
 * Custom component: ssn
 * Base type: text-input
 *
 * This component provides:
 * - Automatic formatting (XXX-XX-XXXX)
 * - Masking on blur (***-**-1234)
 * - Full SSN visible on focus
 * - Validation
 */

export default async function decorate(fieldDiv, fieldJson) {
  const inputField = fieldDiv.querySelector('input[type="text"]');

  if (!inputField) {
    console.error('SSN component: Input field not found');
    return;
  }

  // Store the actual SSN value
  let actualValue = '';

  // Format SSN with dashes (XXX-XX-XXXX)
  function formatSSN(value) {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length <= 3) {
      return digitsOnly;
    } else if (digitsOnly.length <= 5) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    } else {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5, 9)}`;
    }
  }

  // Mask the SSN showing only last 4 digits (***-**-1234)
  function maskSSN(value) {
    const digitsOnly = value.replace(/\D/g, '');

    if (digitsOnly.length < 4) {
      return '*'.repeat(digitsOnly.length);
    } else if (digitsOnly.length === 9) {
      const lastFour = digitsOnly.slice(-4);
      return `***-**-${lastFour}`;
    } else {
      // Partial entry - mask what we have
      return formatSSN(value).replace(/\d/g, '*');
    }
  }

  // Validate SSN format
  function isValidSSN(value) {
    const digitsOnly = value.replace(/\D/g, '');

    // Must be exactly 9 digits
    if (digitsOnly.length !== 9) {
      return false;
    }

    // Cannot be all zeros or sequential numbers
    if (digitsOnly === '000000000' || digitsOnly === '123456789') {
      return false;
    }

    // First three digits cannot be 000, 666, or 900-999
    const firstThree = parseInt(digitsOnly.slice(0, 3), 10);
    if (firstThree === 0 || firstThree === 666 || firstThree >= 900) {
      return false;
    }

    // Middle two digits cannot be 00
    const middleTwo = parseInt(digitsOnly.slice(3, 5), 10);
    if (middleTwo === 0) {
      return false;
    }

    // Last four digits cannot be 0000
    const lastFour = parseInt(digitsOnly.slice(5, 9), 10);
    if (lastFour === 0) {
      return false;
    }

    return true;
  }

  // Handle input event
  inputField.addEventListener('input', (e) => {
    const cursorPosition = e.target.selectionStart;
    const previousLength = e.target.value.length;

    // Get only digits from input
    const digitsOnly = e.target.value.replace(/\D/g, '');

    // Limit to 9 digits
    actualValue = digitsOnly.slice(0, 9);

    // Update the displayed value with formatting
    const formattedDisplay = formatSSN(actualValue);
    e.target.value = formattedDisplay;

    // Calculate new cursor position accounting for added dashes
    let newCursorPosition = cursorPosition;
    const lengthDiff = e.target.value.length - previousLength;

    if (lengthDiff > 0) {
      // Character was added
      newCursorPosition = cursorPosition + lengthDiff;
    }

    // Adjust cursor to skip over dashes
    if (e.target.value[newCursorPosition - 1] === '-') {
      newCursorPosition++;
    }

    e.target.setSelectionRange(newCursorPosition, newCursorPosition);

    // Update the actual form value
    e.target.dataset.actualValue = actualValue;

    // Custom validation
    if (actualValue.length === 9) {
      if (isValidSSN(actualValue)) {
        e.target.setCustomValidity('');
      } else {
        e.target.setCustomValidity('Please enter a valid Social Security Number');
      }
    } else if (actualValue.length > 0) {
      e.target.setCustomValidity('SSN must be 9 digits');
    } else {
      e.target.setCustomValidity('');
    }
  });

  // Handle focus to show full SSN for editing
  inputField.addEventListener('focus', () => {
    if (actualValue) {
      inputField.value = formatSSN(actualValue);
      inputField.classList.add('ssn-visible');
      inputField.classList.remove('ssn-masked');
    }
  });

  // Handle blur to mask the SSN
  inputField.addEventListener('blur', () => {
    if (actualValue) {
      inputField.value = maskSSN(actualValue);
      inputField.classList.add('ssn-masked');
      inputField.classList.remove('ssn-visible');
    }

    // Trigger validation on blur
    if (actualValue.length === 9) {
      if (isValidSSN(actualValue)) {
        inputField.setCustomValidity('');
      } else {
        inputField.setCustomValidity('Please enter a valid Social Security Number');
      }
    }
  });

  // Override form submission to use actual value
  const form = inputField.closest('form');
  if (form) {
    form.addEventListener('submit', () => {
      // Submit the formatted SSN
      inputField.value = formatSSN(actualValue);
    });
  }

  // Add visual indicator classes
  inputField.classList.add('ssn-input');
  fieldDiv.classList.add('ssn-field');

  // Set input attributes for security
  inputField.setAttribute('autocomplete', 'off');
  inputField.setAttribute('inputmode', 'numeric');
  inputField.setAttribute('maxlength', '11'); // 9 digits + 2 dashes

  // If there's an initial value, process it
  if (inputField.value) {
    actualValue = inputField.value.replace(/\D/g, '').slice(0, 9);
    inputField.value = maskSSN(actualValue);
    inputField.dataset.actualValue = actualValue;
    inputField.classList.add('ssn-masked');
  }

  console.log('SSN component decorated successfully');
}
