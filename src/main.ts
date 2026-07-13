import './style.css';
import { addRoute, initRouter, navigate } from './router';
import { renderHome } from './views/home';
import { renderLogin } from './views/login';
import { renderRegister } from './views/register';
import { renderFestivals } from './views/festivals';
import { renderElephants, renderElephantDetail } from './views/elephants';
import { renderAccessories, renderAccessoryDetail } from './views/accessories';
import { renderDashboard } from './views/dashboard';

// Global error listener to display runtime failures on screen instead of a blank page
window.addEventListener('error', (event) => {
  const appDiv = document.getElementById('app');
  if (appDiv) {
    appDiv.innerHTML = `
      <div style="padding: 40px; max-width: 800px; margin: 40px auto; color: #721c24; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px;">
        <h2 style="margin-top: 0; color: #721c24; border-bottom: 1px solid #f5c6cb; padding-bottom: 12px;">Frontend Runtime Exception</h2>
        <p style="font-size: 1.05rem; margin-top: 16px;"><strong>Error Message:</strong> ${event.message}</p>
        <p style="font-size: 0.95rem; color: #555;"><strong>File:</strong> ${event.filename}:${event.lineno}:${event.colno}</p>
        <div style="margin-top: 20px;">
          <strong style="display: block; margin-bottom: 8px;">Stack Trace:</strong>
          <pre style="margin: 0; padding: 16px; background-color: rgba(0, 0, 0, 0.05); border-radius: 4px; overflow-x: auto; font-family: Consolas, monospace; font-size: 0.85rem; line-height: 1.5; white-space: pre-wrap;">${event.error?.stack || 'No stack trace available'}</pre>
        </div>
        <button onclick="localStorage.clear(); location.reload();" style="margin-top: 24px; padding: 10px 20px; font-size: 0.95rem; font-weight: bold; background-color: #721c24; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reset Local Database & Reload
        </button>
      </div>
    `;
  }
});

// Register routes
addRoute('/', () => renderHome());
addRoute('/login', (params) => renderLogin(params));
addRoute('/register', (params) => renderRegister(params));
addRoute('/festivals', () => renderFestivals());
addRoute('/elephants', (params) => renderElephants(params));
addRoute('/elephants/:id', (params) => renderElephantDetail(params));
addRoute('/accessories', (params) => renderAccessories(params));
addRoute('/accessories/:id', (params) => renderAccessoryDetail(params));
addRoute('/dashboard', () => renderDashboard());

// Initialize router navigation
initRouter();

// Trigger initial navigation based on the current window path
const initialPath = window.location.pathname + window.location.search;
navigate(initialPath, false);

// Listen to session changes to re-render active header state without refreshing
window.addEventListener('session-changed', () => {
  const currentPath = window.location.pathname + window.location.search;
  navigate(currentPath, false);
});
