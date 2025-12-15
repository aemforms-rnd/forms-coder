/**
 * Custom component: slider
 * Base type: number-input
 */

function updateSlider(input, element) {
  const step = input.step || 1;
  const max = input.max || 100;
  const min = input.min || 0;
  const value = input.value || min;
  const current = Math.ceil((value - min) / step);
  const total = Math.ceil((max - min) / step);
  const valueDisplay = element.querySelector('.slider-value');
  const track = element.querySelector('.slider-track-filled');
  
  // Update value display
  if (valueDisplay) {
    valueDisplay.innerText = `${value}`;
  }
  
  // Update filled track
  const percentage = ((value - min) / (max - min)) * 100;
  if (track) {
    track.style.width = `${percentage}%`;
  }
  
  // Set CSS variables for styling
  const steps = {
    '--total-steps': total,
    '--current-steps': current,
    '--slider-percentage': percentage,
  };
  const style = Object.entries(steps).map(([varName, varValue]) => `${varName}:${varValue}`).join(';');
  element.setAttribute('style', style);
}

export default async function decorate(fieldDiv, fieldJson) {
  const input = fieldDiv.querySelector('input');
  
  // Convert to range input
  input.type = 'range';
  input.min = fieldJson?.minimum || 0;
  input.max = fieldJson?.maximum || 100;
  input.step = fieldJson?.properties?.step || 1;
  
  // Create slider wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'slider-wrapper decorated';
  input.after(wrapper);
  
  // Create value display
  const valueDisplay = document.createElement('div');
  valueDisplay.className = 'slider-value';
  valueDisplay.innerText = input.value || input.min;
  
  // Create track container
  const trackContainer = document.createElement('div');
  trackContainer.className = 'slider-track-container';
  
  // Create filled track
  const trackFilled = document.createElement('div');
  trackFilled.className = 'slider-track-filled';
  
  // Create min/max labels
  const minLabel = document.createElement('span');
  minLabel.className = 'slider-min-label';
  minLabel.innerText = `${input.min}`;
  
  const maxLabel = document.createElement('span');
  maxLabel.className = 'slider-max-label';
  maxLabel.innerText = `${input.max}`;
  
  // Assemble the structure
  wrapper.appendChild(valueDisplay);
  trackContainer.appendChild(trackFilled);
  trackContainer.appendChild(input);
  wrapper.appendChild(trackContainer);
  wrapper.appendChild(minLabel);
  wrapper.appendChild(maxLabel);
  
  // Add event listener
  input.addEventListener('input', (e) => {
    updateSlider(e.target, wrapper);
  });
  
  // Initial update
  updateSlider(input, wrapper);
  
  return fieldDiv;
}
