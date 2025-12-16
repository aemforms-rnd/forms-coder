/**
 * Signature Capture Component
 * Provides a canvas-based signature capture field with drawing support
 * for mouse and touch input.
 */

class SignatureCapture {
  constructor(fieldDiv, fieldJson) {
    this.fieldDiv = fieldDiv;
    this.fieldJson = fieldJson;
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.hasSignature = false;
    this.decorate();
  }

  decorate() {
    // Hide the original input
    const input = this.fieldDiv.querySelector('input');
    if (input) {
      input.type = 'hidden';
      input.classList.add('signature-data-input');
    }

    // Create signature container
    const signatureContainer = document.createElement('div');
    signatureContainer.className = 'signature-container';

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'signature-canvas';
    this.canvas.width = 400;
    this.canvas.height = 150;
    this.ctx = this.canvas.getContext('2d');

    // Set initial canvas style
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Create clear button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'signature-clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.addEventListener('click', () => this.clearSignature());

    // Create placeholder text
    const placeholder = document.createElement('div');
    placeholder.className = 'signature-placeholder';
    placeholder.textContent = 'Sign here';

    // Assemble container
    signatureContainer.appendChild(placeholder);
    signatureContainer.appendChild(this.canvas);
    signatureContainer.appendChild(clearBtn);

    // Insert after label
    const label = this.fieldDiv.querySelector('.field-label');
    if (label) {
      label.after(signatureContainer);
    } else {
      this.fieldDiv.prepend(signatureContainer);
    }

    // Setup event listeners
    this.setupEventListeners();

    // Handle enabled/disabled state
    this.updateEnabledState();

    // Listen for custom enable/disable events
    this.fieldDiv.addEventListener('custom:setProperty', (e) => {
      if (e.detail && typeof e.detail.enabled !== 'undefined') {
        this.setEnabled(e.detail.enabled);
      }
    });
  }

  setupEventListeners() {
    // Mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.canvas.addEventListener('touchend', () => this.stopDrawing());
  }

  getPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  getTouchPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }

  startDrawing(e) {
    if (this.fieldDiv.classList.contains('field-disabled')) return;
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hidePlaceholder();
  }

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPosition(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hasSignature = true;
  }

  handleTouchStart(e) {
    if (this.fieldDiv.classList.contains('field-disabled')) return;
    e.preventDefault();
    this.isDrawing = true;
    const pos = this.getTouchPosition(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hidePlaceholder();
  }

  handleTouchMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getTouchPosition(e);
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.hasSignature = true;
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveSignature();
    }
  }

  hidePlaceholder() {
    const placeholder = this.fieldDiv.querySelector('.signature-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
  }

  showPlaceholder() {
    const placeholder = this.fieldDiv.querySelector('.signature-placeholder');
    if (placeholder) {
      placeholder.style.display = 'block';
    }
  }

  clearSignature() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.hasSignature = false;
    this.showPlaceholder();
    const input = this.fieldDiv.querySelector('.signature-data-input');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  saveSignature() {
    if (this.hasSignature) {
      const dataUrl = this.canvas.toDataURL('image/png');
      const input = this.fieldDiv.querySelector('.signature-data-input');
      if (input) {
        input.value = dataUrl;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  setEnabled(enabled) {
    if (enabled) {
      this.fieldDiv.classList.remove('field-disabled');
      this.canvas.classList.remove('disabled');
    } else {
      this.fieldDiv.classList.add('field-disabled');
      this.canvas.classList.add('disabled');
    }
  }

  updateEnabledState() {
    const isEnabled = this.fieldJson.enabled !== false;
    this.setEnabled(isEnabled);
  }
}

export default async function decorate(fieldDiv, fieldJson) {
  const signature = new SignatureCapture(fieldDiv, fieldJson);
  return signature.fieldDiv;
}
