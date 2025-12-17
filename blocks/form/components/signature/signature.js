/**
 * Custom component: signature
 * Base type: text-input
 */

export default async function decorate(fieldDiv, fieldJson) {
  // Get custom properties or use defaults
  const canvasWidth = fieldJson.properties?.canvasWidth || 600;
  const canvasHeight = fieldJson.properties?.canvasHeight || 200;
  const penColor = fieldJson.properties?.penColor || '#000000';
  const penWidth = fieldJson.properties?.penWidth || 2;
  const clearButtonText = fieldJson.properties?.clearButtonText || 'Clear';

  // Add custom class
  fieldDiv.classList.add('signature-component');

  // Find the input element
  const input = fieldDiv.querySelector('input');
  if (!input) return;

  // Hide the original input but keep it for form submission
  input.style.display = 'none';
  input.setAttribute('type', 'hidden');

  // Create canvas container
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'signature-canvas-container';

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.className = 'signature-canvas';
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Create clear button
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'signature-clear-button';
  clearButton.textContent = clearButtonText;

  // Add canvas and button to container
  canvasContainer.appendChild(canvas);
  canvasContainer.appendChild(clearButton);

  // Insert after the label
  const label = fieldDiv.querySelector('label');
  if (label) {
    label.insertAdjacentElement('afterend', canvasContainer);
  } else {
    input.insertAdjacentElement('beforebegin', canvasContainer);
  }

  // Get canvas context
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = penColor;
  ctx.lineWidth = penWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Drawing state
  let isDrawing = false;
  let hasSignature = false;

  // Drawing functions
  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    hasSignature = true;

    // Update hidden input with base64 image data
    input.value = canvas.toDataURL('image/png');

    // Trigger change event for form validation
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  }

  // Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // Touch events for mobile
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startDrawing(e);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopDrawing();
  });

  // Clear button functionality
  clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    input.value = '';
    hasSignature = false;

    // Trigger change event for form validation
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Set initial canvas background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // If there's an existing value, restore it
  if (input.value) {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      hasSignature = true;
    };
    img.src = input.value;
  }
}
