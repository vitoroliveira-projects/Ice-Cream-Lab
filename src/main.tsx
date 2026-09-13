// Ensure window.fetch is writable / has a setter so libraries or polyfills assigning to window.fetch do not throw:
// "TypeError: Cannot set property fetch of #<Window> which has only a getter"
try {
  let currentFetch = window.fetch;
  const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (desc && (!desc.writable || !desc.set)) {
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get() {
        return currentFetch;
      },
      set(fn) {
        currentFetch = fn;
      },
    });
  }
} catch (e) {
  // Ignore descriptor errors if not allowed
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

