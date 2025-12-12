/**
 * Custom component: autocomplete-dropdown
 * Base type: drop-down
 */

export default async function decorate(fieldDiv, fieldJson) {
  // Add custom class
  fieldDiv.classList.add('autocomplete-dropdown');

  // Get the original select element
  const select = fieldDiv.querySelector('select');
  if (!select) {
    console.warn('Select element not found in autocomplete dropdown');
    return;
  }

  // Get options from the select element
  const options = Array.from(select.options).map(option => ({
    value: option.value,
    label: option.textContent,
  })).filter(opt => opt.value !== ''); // Filter out empty placeholder option

  // Get autocomplete settings from fieldJson
  const minCharacters = fieldJson.minCharacters || 1;
  const maxSuggestions = fieldJson.maxSuggestions || 10;
  const caseSensitive = fieldJson.caseSensitive || false;
  const filterMode = fieldJson.filterMode || 'starts-with';

  // Hide the original select element
  select.style.display = 'none';

  // Create autocomplete input
  const input = document.createElement('input');
  input.type = 'text';
  input.id = `${select.id}-autocomplete`;
  input.className = 'autocomplete-input';
  input.placeholder = fieldJson.placeholder || 'Type to search...';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-controls', `${select.id}-suggestions`);

  // Create suggestions container
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.id = `${select.id}-suggestions`;
  suggestionsContainer.className = 'autocomplete-suggestions';
  suggestionsContainer.setAttribute('role', 'listbox');
  suggestionsContainer.style.display = 'none';

  // Insert input and suggestions after the select
  select.parentNode.insertBefore(input, select.nextSibling);
  input.parentNode.insertBefore(suggestionsContainer, input.nextSibling);

  // State management
  let currentFocus = -1;
  let filteredOptions = [];

  /**
   * Filter options based on input value
   */
  function filterOptions(inputValue) {
    if (inputValue.length < minCharacters) {
      return [];
    }

    const searchTerm = caseSensitive ? inputValue : inputValue.toLowerCase();

    const filtered = options.filter(option => {
      const optionLabel = caseSensitive ? option.label : option.label.toLowerCase();

      switch (filterMode) {
        case 'starts-with':
          return optionLabel.startsWith(searchTerm);
        case 'contains':
          return optionLabel.includes(searchTerm);
        case 'exact':
          return optionLabel === searchTerm;
        default:
          return optionLabel.startsWith(searchTerm);
      }
    });

    return filtered.slice(0, maxSuggestions);
  }

  /**
   * Render suggestions
   */
  function renderSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      return;
    }

    suggestions.forEach((option, index) => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'autocomplete-suggestion-item';
      suggestionItem.setAttribute('role', 'option');
      suggestionItem.setAttribute('data-value', option.value);
      suggestionItem.setAttribute('data-index', index);
      suggestionItem.textContent = option.label;

      suggestionItem.addEventListener('click', () => {
        selectOption(option);
      });

      suggestionItem.addEventListener('mouseenter', () => {
        removeActiveClass();
        suggestionItem.classList.add('active');
        currentFocus = index;
      });

      suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = 'block';
    input.setAttribute('aria-expanded', 'true');
  }

  /**
   * Select an option
   */
  function selectOption(option) {
    input.value = option.label;
    select.value = option.value;

    // Trigger change event on select
    const event = new Event('change', { bubbles: true });
    select.dispatchEvent(event);

    suggestionsContainer.style.display = 'none';
    input.setAttribute('aria-expanded', 'false');
    currentFocus = -1;
  }

  /**
   * Remove active class from all suggestions
   */
  function removeActiveClass() {
    const items = suggestionsContainer.querySelectorAll('.autocomplete-suggestion-item');
    items.forEach(item => item.classList.remove('active'));
  }

  /**
   * Add active class to current focused item
   */
  function addActiveClass() {
    const items = suggestionsContainer.querySelectorAll('.autocomplete-suggestion-item');
    removeActiveClass();
    if (currentFocus >= 0 && currentFocus < items.length) {
      items[currentFocus].classList.add('active');
      items[currentFocus].scrollIntoView({ block: 'nearest' });
    }
  }

  // Input event listener
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    filteredOptions = filterOptions(value);
    renderSuggestions(filteredOptions);
    currentFocus = -1;
  });

  // Keyboard navigation
  input.addEventListener('keydown', (e) => {
    const items = suggestionsContainer.querySelectorAll('.autocomplete-suggestion-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentFocus++;
      if (currentFocus >= items.length) {
        currentFocus = 0;
      }
      addActiveClass();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentFocus--;
      if (currentFocus < 0) {
        currentFocus = items.length - 1;
      }
      addActiveClass();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFocus > -1 && items[currentFocus]) {
        const value = items[currentFocus].getAttribute('data-value');
        const option = filteredOptions.find(opt => opt.value === value);
        if (option) {
          selectOption(option);
        }
      }
    } else if (e.key === 'Escape') {
      suggestionsContainer.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      currentFocus = -1;
    }
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!fieldDiv.contains(e.target)) {
      suggestionsContainer.style.display = 'none';
      input.setAttribute('aria-expanded', 'false');
      currentFocus = -1;
    }
  });

  // Handle focus on input
  input.addEventListener('focus', () => {
    if (input.value.length >= minCharacters) {
      filteredOptions = filterOptions(input.value);
      renderSuggestions(filteredOptions);
    }
  });

  // Initialize with selected value if exists
  if (select.value) {
    const selectedOption = options.find(opt => opt.value === select.value);
    if (selectedOption) {
      input.value = selectedOption.label;
    }
  }
}
