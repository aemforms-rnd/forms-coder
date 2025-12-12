// Create a countdown timer component
// The function will take a fieldDiv that contains an input element
// The function will convert the input element to a countdown timer component
// The countdown timer will display hours, minutes, and seconds
// The timer can be configured with a target time (ISO 8601 string) or duration (in seconds)
// The function will update the display every second
// The value of the input element will be set to the remaining seconds
// The function will also handle the timer expiration

export default function decorate(fieldDiv, fieldJson) {
  // Get the input element from the fieldDiv
  const input = fieldDiv.querySelector('input[type="text"]');
  const enabled = fieldJson?.enabled;
  const readOnly = fieldJson?.readOnly;

  // Get timer configuration from data attributes or fieldJson
  // Priority: data attributes > fieldJson > defaults
  let targetTime = input.getAttribute('data-target-time') || fieldJson?.targetTime;
  let duration = input.getAttribute('data-duration') || fieldJson?.duration || 300; // Default 5 minutes

  // Convert duration to number if it's a string
  if (typeof duration === 'string') {
    duration = parseInt(duration, 10);
  }

  // Create a div element to contain the countdown timer
  const timerDiv = document.createElement('div');
  timerDiv.classList.add('countdown-timer');

  // Add disabled class if the component is not enabled or is readonly
  if (enabled === false || readOnly === true) {
    timerDiv.classList.add('disabled');
  }

  // Create display elements for hours, minutes, and seconds
  const displayDiv = document.createElement('div');
  displayDiv.classList.add('timer-display');

  const hoursSpan = document.createElement('span');
  hoursSpan.classList.add('timer-unit', 'hours');

  const hoursLabel = document.createElement('span');
  hoursLabel.classList.add('timer-label');
  hoursLabel.textContent = 'Hours';

  const hoursValue = document.createElement('span');
  hoursValue.classList.add('timer-value');
  hoursValue.textContent = '00';

  hoursSpan.appendChild(hoursValue);
  hoursSpan.appendChild(hoursLabel);

  const minutesSpan = document.createElement('span');
  minutesSpan.classList.add('timer-unit', 'minutes');

  const minutesLabel = document.createElement('span');
  minutesLabel.classList.add('timer-label');
  minutesLabel.textContent = 'Minutes';

  const minutesValue = document.createElement('span');
  minutesValue.classList.add('timer-value');
  minutesValue.textContent = '00';

  minutesSpan.appendChild(minutesValue);
  minutesSpan.appendChild(minutesLabel);

  const secondsSpan = document.createElement('span');
  secondsSpan.classList.add('timer-unit', 'seconds');

  const secondsLabel = document.createElement('span');
  secondsLabel.classList.add('timer-label');
  secondsLabel.textContent = 'Seconds';

  const secondsValue = document.createElement('span');
  secondsValue.classList.add('timer-value');
  secondsValue.textContent = '00';

  secondsSpan.appendChild(secondsValue);
  secondsSpan.appendChild(secondsLabel);

  // Create separator elements
  const separator1 = document.createElement('span');
  separator1.classList.add('timer-separator');
  separator1.textContent = ':';

  const separator2 = document.createElement('span');
  separator2.classList.add('timer-separator');
  separator2.textContent = ':';

  displayDiv.appendChild(hoursSpan);
  displayDiv.appendChild(separator1);
  displayDiv.appendChild(minutesSpan);
  displayDiv.appendChild(separator2);
  displayDiv.appendChild(secondsSpan);

  timerDiv.appendChild(displayDiv);

  // Create status message element
  const statusDiv = document.createElement('div');
  statusDiv.classList.add('timer-status');
  timerDiv.appendChild(statusDiv);

  // Calculate end time
  let endTime;
  if (targetTime) {
    // If target time is provided, use it
    endTime = new Date(targetTime);
  } else {
    // Otherwise, calculate from duration
    endTime = new Date(Date.now() + duration * 1000);
  }

  // Store end time in a data attribute for persistence
  timerDiv.setAttribute('data-end-time', endTime.toISOString());

  // Function to format number with leading zero
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  // Function to update the timer display
  function updateTimer() {
    const now = new Date();
    const remainingMs = endTime - now;

    if (remainingMs <= 0) {
      // Timer expired
      hoursValue.textContent = '00';
      minutesValue.textContent = '00';
      secondsValue.textContent = '00';
      input.value = '0';
      statusDiv.textContent = 'Time\'s up!';
      timerDiv.classList.add('expired');

      // Dispatch change event
      input.dispatchEvent(new Event('change', { bubbles: true }));

      // Clear the interval
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      return;
    }

    // Calculate remaining time
    const remainingSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    // Update display
    hoursValue.textContent = padZero(hours);
    minutesValue.textContent = padZero(minutes);
    secondsValue.textContent = padZero(seconds);

    // Update input value with remaining seconds
    input.value = remainingSeconds.toString();

    // Add warning class when less than 1 minute remaining
    if (remainingSeconds <= 60 && remainingSeconds > 0) {
      timerDiv.classList.add('warning');
    } else {
      timerDiv.classList.remove('warning');
    }

    // Dispatch change event
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Start the timer
  let timerInterval;
  if (!timerDiv.classList.contains('disabled')) {
    updateTimer(); // Initial update
    timerInterval = setInterval(updateTimer, 1000);

    // Store interval ID for cleanup
    timerDiv.setAttribute('data-interval-id', timerInterval);
  }

  // Add the timer div to the fieldDiv
  fieldDiv.appendChild(timerDiv);

  // Hide the input element
  input.style.display = 'none';

  // Move help text to the end if it exists
  const helpText = fieldDiv.querySelector('.field-description');
  if (helpText) {
    fieldDiv.append(helpText);
  }

  // Cleanup function (if needed by the framework)
  if (fieldDiv.cleanup) {
    const originalCleanup = fieldDiv.cleanup;
    fieldDiv.cleanup = function() {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      originalCleanup.call(fieldDiv);
    };
  } else {
    fieldDiv.cleanup = function() {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }

  return fieldDiv;
}
