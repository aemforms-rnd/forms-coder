/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate sum of all transaction amounts
 * @name sumTransactionAmounts Sum Transaction Amounts
 * @param {scope} globals
 * @return {number} Total sum of all transaction amounts
 */
function sumTransactionAmounts(globals) {
  const formData = globals.functions.exportData();

  // Check if transactions exist and is an array
  if (!formData.transactions || !Array.isArray(formData.transactions)) {
    return 0;
  }

  // Sum all transaction amounts
  const total = formData.transactions.reduce((sum, transaction) => {
    const amount = parseFloat(transaction.transaction_amount) || 0;
    return sum + amount;
  }, 0);

  return total;
}

/**
 * Validate PAN card number as per RBI norms
 * PAN format: AAAAA9999A (5 letters + 4 digits + 1 letter)
 * 4th character indicates holder type:
 * - A: Association of Persons (AOP)
 * - B: Body of Individuals (BOI)
 * - C: Company
 * - F: Firm
 * - G: Government
 * - H: Hindu Undivided Family (HUF)
 * - L: Local Authority
 * - J: Artificial Juridical Person
 * - P: Individual/Person
 * - T: Trust
 * - K: Krishi (Agriculture)
 * @name validatePANCard
 * Validate PAN Card Number
 * @param {string} pan PAN card number to validate
 * @param {scope} globals Global scope object
 * @return {boolean} Returns true if PAN is valid
 */
function validatePANCard(pan, globals) {
  if (!pan) {
    return false;
  }

  // Convert to uppercase for validation
  const panUpper = pan.toUpperCase();

  // PAN must be exactly 10 characters
  if (panUpper.length !== 10) {
    return false;
  }

  // RBI PAN format: First 5 chars are letters, next 4 are digits, last is letter
  // 4th character must be one of: A, B, C, F, G, H, L, J, P, T, K
  const panRegex = new RegExp('^[A-Z]{3}[ABCFGHLJPTK][A-Z][0-9]{4}[A-Z]$');

  return panRegex.test(panUpper);
}

/**
 * Validate Indian mobile number
 * Must start with +91 followed by 10 digits starting with 6-9
 * @name validateMobileNumber
 * Validate Mobile Number
 * @param {string} mobile Mobile number to validate
 * @param {scope} globals Global scope object
 * @return {boolean} Returns true if mobile is valid
 */
function validateMobileNumber(mobile, globals) {
  if (!mobile) {
    return false;
  }

  // Indian mobile: +91 followed by 10 digits starting with 6-9
  const mobileRegex = new RegExp('^\\+91[6-9][0-9]{9}$');

  return mobileRegex.test(mobile);
}

/**
 * Check if Get OTP button should be enabled
 * Conditions: Mobile number valid, PAN/DOB valid (based on selection), and privacy consent checked
 * @name shouldEnableGetOTP
 * Should Enable Get OTP Button
 * @param {string} mobileNumber Mobile number value
 * @param {string} validateUsing Validation method (pan or dob)
 * @param {string} panCard PAN card number
 * @param {string} dateOfBirth Date of birth value
 * @param {string} privacyConsent Privacy consent checkbox value
 * @param {scope} globals Global scope object
 * @return {boolean} Returns true if Get OTP should be enabled
 */
function shouldEnableGetOTP(mobileNumber, validateUsing, panCard, dateOfBirth, privacyConsent, globals) {
  // Check mobile number validity
  const mobileValid = validateMobileNumber(mobileNumber, globals);
  if (!mobileValid) {
    return false;
  }

  // Check privacy consent is checked
  if (!privacyConsent || privacyConsent !== 'yes') {
    return false;
  }

  // Check validation method specific field
  if (validateUsing === 'pan') {
    return validatePANCard(panCard, globals);
  } else if (validateUsing === 'dob') {
    // Date of birth must be present
    return !!dateOfBirth;
  }

  return false;
}

/**
 * Update Get OTP button enabled state based on form values
 * @name updateGetOTPState
 * Update Get OTP Button State
 * @param {scope} globals Global scope object
 * @return {void}
 */
function updateGetOTPState(globals) {
  const formData = globals.functions.exportData();

  const mobileNumber = formData.mobile_number || "";
  const validateUsing = formData.validate_using || "pan";
  const panCard = formData.pan_card || "";
  const dateOfBirth = formData.date_of_birth || "";
  const privacyConsent = formData.privacy_consent || "";

  const shouldEnable = shouldEnableGetOTP(
    mobileNumber,
    validateUsing,
    panCard,
    dateOfBirth,
    privacyConsent,
    globals
  );

  globals.functions.dispatchEvent(
    globals.form.welcome_panel.get_otp_button,
    "custom:setProperty",
    { enabled: shouldEnable }
  );
}

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, sumTransactionAmounts, validatePANCard, validateMobileNumber, shouldEnableGetOTP, updateGetOTPState };
