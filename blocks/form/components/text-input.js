/**
 * Custom Text Input Component
 * Enhanced text input with additional features
 */

export default {
  name: 'CustomTextInput',
  version: '1.0.0',

  /**
   * Component props
   */
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    maxLength: { type: Number, default: null },
    pattern: { type: String, default: null },
    icon: { type: String, default: null },
    onChange: { type: Function, required: true }
  },

  /**
   * Render the component
   */
  render: function(props) {
    const { value, placeholder, disabled, maxLength, pattern, icon, onChange } = props;

    return `
      <div class="custom-text-input">
        ${icon ? `<span class="input-icon">${icon}</span>` : ''}
        <input
          type="text"
          class="form-input ${icon ? 'with-icon' : ''}"
          value="${value || ''}"
          placeholder="${placeholder || ''}"
          ${disabled ? 'disabled' : ''}
          ${maxLength ? `maxlength="${maxLength}"` : ''}
          ${pattern ? `pattern="${pattern}"` : ''}
          onchange="handleChange(event)"
        />
        ${maxLength ? `<span class="char-count">${value?.length || 0}/${maxLength}</span>` : ''}
      </div>
    `;
  },

  /**
   * Component lifecycle
   */
  mounted: function(element, props) {
    const input = element.querySelector('input');
    input.addEventListener('input', (e) => {
      props.onChange(e.target.value);
    });
  }
};
