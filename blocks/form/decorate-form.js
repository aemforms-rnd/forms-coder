import { loadCSS } from '../../scripts/aem.js';

export default function decorateForm(form, formDef) {
  const { customStylesPath } = formDef?.properties || {};
  if (customStylesPath) {
    try {
      loadCSS(`${window.hlx.codeBasePath}/${customStylesPath}`);
    } catch (error) {
      console.error('Failed to load CSS:', error);
    }
  }
}
