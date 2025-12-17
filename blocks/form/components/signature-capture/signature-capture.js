/**
 * Custom component: signature-capture
 * Base type: text-input
 * Provides a canvas-based signature capture with clear button
 */

export default async function decorate(fieldDiv, fieldJson) {
  // Add custom class
  fieldDiv.classList.add('signature-capture');

  // Find the input element
  const input = fieldDiv.querySelector('input');
  if (!input) {
    console.error('Input element not found in signature-capture component');
    return;
  }

  // Hide the original input (we'll use it to store the signature data)
  input.style.display = 'none';

  // Create canvas container
  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'signature-canvas-container';

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.className = 'signature-canvas';
  canvas.width = 600;
  canvas.height = 200;

  // Create clear button
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'signature-clear-button';
  clearButton.textContent = 'Clear';

  // Create instruction text
  const instructionText = document.createElement('div');
  instructionText.className = 'signature-instruction';
  instructionText.textContent = 'Sign using your mouse or finger';

  // Append elements
  canvasContainer.appendChild(instructionText);
  canvasContainer.appendChild(canvas);
  canvasContainer.appendChild(clearButton);

  // Insert canvas container after the input
  input.parentNode.insertBefore(canvasContainer, input.nextSibling);

  // Initialize canvas drawing
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let hasSignature = false;

  // Set canvas background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set drawing style
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Helper function to get coordinates
  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // Start drawing
  function startDrawing(e) {
    e.preventDefault();
    isDrawing = true;
    const coords = getCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;
  }

  // Draw
  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastX = coords.x;
    lastY = coords.y;
    hasSignature = true;
  }

  // Stop drawing and save signature
  function stopDrawing(e) {
    if (isDrawing) {
      e.preventDefault();
      isDrawing = false;

      // Save signature as base64 data URL
      if (hasSignature) {
        const dataURL = canvas.toDataURL('image/png');
        input.value = dataURL;

        // Trigger change event for form validation
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  // Clear signature
  function clearSignature() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hasSignature = false;
    input.value = '';

    // Trigger change event for form validation
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Touch events for mobile
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchcancel', stopDrawing);

  // Clear button event
  clearButton.addEventListener('click', clearSignature);

  // If input has a value (e.g., from saved form data), restore it to canvas
  if (input.value) {
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      hasSignature = true;
    };
    img.src = input.value;
  }
}
