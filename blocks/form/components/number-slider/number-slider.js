/**
 * Custom component: number-slider
 * Base type: number-input
 */

export default async function decorate(fieldDiv, fieldJson) {
  // fieldDiv: HTML of the base component (number-input)
  // fieldJson: Field properties (enabled, visible, placeholder, etc.)

  // Add custom class for styling
  fieldDiv.classList.add('number-slider');

  // Find the number input element
  const numberInput = fieldDiv.querySelector('input[type="number"]');
  if (!numberInput) {
    console.error('Number input not found in number-slider component');
    return;
  }

  // Get slider properties from fieldJson
  const min = fieldJson.minimum ?? fieldJson.min ?? 0;
  const max = fieldJson.maximum ?? fieldJson.max ?? 100;
  const step = fieldJson.step ?? 1;
  const defaultValue = fieldJson.default ?? fieldJson.defaultValue ?? min;

  // Hide the original number input
  numberInput.style.display = 'none';

  // Create slider container
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'slider-container';

  // Create range input (slider)
  const rangeInput = document.createElement('input');
  rangeInput.type = 'range';
  rangeInput.min = min;
  rangeInput.max = max;
  rangeInput.step = step;
  rangeInput.value = numberInput.value || defaultValue;
  rangeInput.className = 'slider-input';
  rangeInput.id = `${numberInput.id}-slider`;

  // Create value display
  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'slider-value-display';
  valueDisplay.textContent = rangeInput.value;

  // Create min/max labels
  const labelsContainer = document.createElement('div');
  labelsContainer.className = 'slider-labels';

  const minLabel = document.createElement('span');
  minLabel.className = 'slider-label-min';
  minLabel.textContent = min;

  const maxLabel = document.createElement('span');
  maxLabel.className = 'slider-label-max';
  maxLabel.textContent = max;

  labelsContainer.appendChild(minLabel);
  labelsContainer.appendChild(maxLabel);

  // Sync slider with number input
  rangeInput.addEventListener('input', (e) => {
    const value = e.target.value;
    numberInput.value = value;
    valueDisplay.textContent = value;

    // Trigger change event on the number input for form validation
    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
  });

  rangeInput.addEventListener('change', (e) => {
    numberInput.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Sync number input with slider (if someone programmatically changes the input)
  numberInput.addEventListener('change', (e) => {
    const value = e.target.value;
    rangeInput.value = value;
    valueDisplay.textContent = value;
  });

  // Handle enabled/disabled state
  if (fieldJson.enabled === false || fieldJson.readOnly === true) {
    rangeInput.disabled = true;
    fieldDiv.classList.add('disabled');
  }

  // Assemble the slider UI
  sliderContainer.appendChild(valueDisplay);
  sliderContainer.appendChild(rangeInput);
  sliderContainer.appendChild(labelsContainer);

  // Insert slider after the label
  const label = fieldDiv.querySelector('.field-label');
  if (label) {
    label.after(sliderContainer);
  } else {
    numberInput.before(sliderContainer);
  }

  // Set initial value
  if (!numberInput.value && defaultValue) {
    numberInput.value = defaultValue;
    rangeInput.value = defaultValue;
    valueDisplay.textContent = defaultValue;
  }
}
