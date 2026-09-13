try {
  let currentFetch = window.fetch;
  const ensureSetter = (target: any) => {
    if (!target) return;
    try {
      const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
      if (desc && (desc.configurable || desc.set === undefined)) {
        Object.defineProperty(target, 'fetch', {
          configurable: true,
          enumerable: desc.enumerable !== undefined ? desc.enumerable : true,
          get() {
            return currentFetch;
          },
          set(fn) {
            currentFetch = fn;
          },
        });
      }
    } catch {}
  };

  let curr: any = window;
  while (curr) {
    ensureSetter(curr);
    try {
      curr = Object.getPrototypeOf(curr);
    } catch {
      break;
    }
  }
  if (typeof Window !== 'undefined' && Window.prototype) {
    ensureSetter(Window.prototype);
  }
} catch {
  // Ignore descriptor errors
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

