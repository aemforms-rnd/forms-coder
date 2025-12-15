/**
 * Modal Consent Component
 * Extends checkbox to show a modal with consent content when clicked.
 * User must accept from modal to check the checkbox.
 */

class ModalConsent {
  constructor(fieldDiv, fieldJson) {
    this.fieldDiv = fieldDiv;
    this.fieldJson = fieldJson;
    this.dialog = null;
    this.checkbox = null;
    this.label = null;
  }

  createModal() {
    const dialog = document.createElement('dialog');
    dialog.classList.add('modal-consent-dialog');

    // Modal content container
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-consent-content');

    // Modal header
    const header = document.createElement('div');
    header.classList.add('modal-consent-header');

    const title = document.createElement('h2');
    title.classList.add('modal-consent-title');
    title.textContent = this.fieldJson.label || 'Consent Agreement';
    header.appendChild(title);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.classList.add('modal-consent-close');
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => this.closeModal(false));
    header.appendChild(closeBtn);

    modalContent.appendChild(header);

    // Modal body - extract content from label
    const body = document.createElement('div');
    body.classList.add('modal-consent-body');

    // Get the consent text from the label
    const labelText = this.label ? this.label.innerHTML : this.fieldJson.label || '';
    body.innerHTML = labelText;

    modalContent.appendChild(body);

    // Modal footer with buttons
    const footer = document.createElement('div');
    footer.classList.add('modal-consent-footer');

    const declineBtn = document.createElement('button');
    declineBtn.type = 'button';
    declineBtn.classList.add('modal-consent-btn', 'modal-consent-btn-decline');
    declineBtn.textContent = 'Decline';
    declineBtn.addEventListener('click', () => this.closeModal(false));

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.classList.add('modal-consent-btn', 'modal-consent-btn-accept');
    acceptBtn.textContent = 'I Accept';
    acceptBtn.addEventListener('click', () => this.closeModal(true));

    footer.appendChild(declineBtn);
    footer.appendChild(acceptBtn);
    modalContent.appendChild(footer);

    dialog.appendChild(modalContent);

    // Close on backdrop click
    dialog.addEventListener('click', (event) => {
      const dialogDimensions = dialog.getBoundingClientRect();
      if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
      ) {
        this.closeModal(false);
      }
    });

    // Handle escape key
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.closeModal(false);
    });

    return dialog;
  }

  openModal() {
    if (!this.dialog) {
      this.dialog = this.createModal();
      document.body.appendChild(this.dialog);
    }
    this.dialog.showModal();
    document.body.classList.add('modal-consent-open');
  }

  closeModal(accepted) {
    if (this.dialog) {
      this.dialog.close();
      document.body.classList.remove('modal-consent-open');

      if (accepted && this.checkbox) {
        this.checkbox.checked = true;
        // Dispatch change event to notify form system
        this.checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  decorate() {
    // Get the checkbox and label elements
    this.checkbox = this.fieldDiv.querySelector('input[type="checkbox"]');
    this.label = this.fieldDiv.querySelector('label.field-label');

    if (!this.checkbox || !this.label) {
      console.warn('Modal consent: checkbox or label not found');
      return;
    }

    // Add custom class to field wrapper
    this.fieldDiv.classList.add('modal-consent-wrapper');

    // Prevent default checkbox behavior when clicking the label or checkbox
    const handleClick = (event) => {
      // Only intercept if checkbox is not checked
      if (!this.checkbox.checked) {
        event.preventDefault();
        event.stopPropagation();
        this.openModal();
      }
    };

    // Intercept clicks on label
    this.label.addEventListener('click', handleClick);

    // Intercept clicks on checkbox itself
    this.checkbox.addEventListener('click', handleClick);

    // Style the label to indicate it's clickable
    this.label.style.cursor = 'pointer';

    // Add visual indicator that this opens a modal
    const indicator = document.createElement('span');
    indicator.classList.add('modal-consent-indicator');
    indicator.innerHTML = ' (click to view)';
    this.label.appendChild(indicator);
  }
}

export default async function decorate(fieldDiv, fieldJson) {
  const modalConsent = new ModalConsent(fieldDiv, fieldJson);
  modalConsent.decorate();
  return fieldDiv;
}
