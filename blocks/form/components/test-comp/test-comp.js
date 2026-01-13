/**
 * Custom component: test-comp
 * Base type: text-input
 */

export default async function decorate(fieldDiv, fieldJson) {
  // fieldDiv: HTML of the base component (text-input)
  // fieldJson: Field properties (enabled, visible, placeholder, etc.)
  
  // Add your custom logic here to extend the text-input component
  console.log('Decorating test-comp', fieldJson);
  
  // Example: Add a custom class
  fieldDiv.classList.add('test-comp');
  
  // Example: Access field properties
  // const placeholder = fieldJson.placeholder;
  // const label = fieldJson.label;
  
  // Your customization logic goes here...
}
