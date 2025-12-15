/**
 * Custom component: slider
 * Base type: number-input
 */

export default async function decorate(fieldDiv, fieldJson) {
  // fieldDiv: HTML of the base component (number-input)
  // fieldJson: Field properties (enabled, visible, placeholder, etc.)

  // Add custom class for styling
  fieldDiv.classList.add('slider-component');

  // Get the input element (number-input)
  const input = fieldDiv.querySelector('input[type="number"]');
  if (!input) {
    console.error('Slider: No input element found');
    return;
  }

  // Get slider properties with defaults
  const min = fieldJson.minimum || 0;
  const max = fieldJson.maximum || 100;
  const step = fieldJson.step || 1;
  const showValue = fieldJson.showValue !== false; // default true
  const valuePrefix = fieldJson.valuePrefix || '';
  const valueSuffix = fieldJson.valueSuffix || '';
  const defaultValue = fieldJson.default || min;

  // Hide the original number input
  input.style.display = 'none';

  // Create slider container
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';

  // Create range input (slider)
  const rangeInput = document.createElement('input');
  rangeInput.type = 'range';
  rangeInput.min = min;
  rangeInput.max = max;
  rangeInput.step = step;
  rangeInput.value = input.value || defaultValue;
  rangeInput.className = 'slider-input';
  rangeInput.id = `${input.id}-slider`;
  rangeInput.setAttribute('aria-labelledby', input.getAttribute('aria-labelledby'));

  // Create value display if enabled
  let valueDisplay;
  if (showValue) {
    valueDisplay = document.createElement('div');
    valueDisplay.className = 'slider-value-display';
    valueDisplay.textContent = `${valuePrefix}${rangeInput.value}${valueSuffix}`;
    valueDisplay.setAttribute('aria-live', 'polite');
  }

  // Sync slider with hidden input
  const updateValue = (value) => {
    input.value = value;
    rangeInput.value = value;
    if (valueDisplay) {
      valueDisplay.textContent = `${valuePrefix}${value}${valueSuffix}`;
    }

    // Trigger change event on the original input
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);

    // Trigger input event for real-time updates
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  };

  // Listen to slider changes
  rangeInput.addEventListener('input', (e) => {
    updateValue(e.target.value);
  });

  // Build the slider component
  sliderContainer.appendChild(rangeInput);
  if (valueDisplay) {
    sliderContainer.appendChild(valueDisplay);
  }

  // Insert slider after the hidden input
  input.parentNode.insertBefore(sliderContainer, input.nextSibling);

  // Set initial value
  updateValue(rangeInput.value);

  // Handle disabled state
  if (fieldJson.enabled === false) {
    rangeInput.disabled = true;
    sliderContainer.classList.add('disabled');
  }

  // Handle readonly state
  if (fieldJson.readOnly === true) {
    rangeInput.disabled = true;
    sliderContainer.classList.add('readonly');
  }
}
