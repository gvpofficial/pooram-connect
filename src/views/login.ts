import { dbService, sha256 } from '../db';
import { getSession, setSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { navigate } from '../router';

export function renderLogin(params: Record<string, string> = {}) {
  const appDiv = document.getElementById('app')!;
  const redirect = params.redirect || '/dashboard';
  
  // If already logged in, redirect
  if (getSession()) {
    setTimeout(() => navigate(redirect), 0);
    return;
  }

  const html = `
    <div style="padding: 80px 0; background-color: var(--ivory-bg); min-height: 80vh; display: flex; align-items: center;">
      <div class="container">
        <div style="max-width: 450px; margin: 0 auto; width: 100%;">
          <div class="card" style="padding: 40px; border-top: 4px solid var(--gold-primary);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 1.8rem; color: var(--maroon-primary);">Portal Sign In</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
                Access your committee or owner dashboards
              </p>
            </div>

            <div id="login-error" style="color: var(--color-booked); background-color: #FFEBEE; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; display: none;">
              ⚠️ <span id="error-msg"></span>
            </div>

            <form id="login-form" style="display: flex; flex-direction: column; gap: 20px;">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="e.g. name@pooramconnect.org"
                  class="form-control"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••"
                  class="form-control"
                  required
                />
              </div>

              <button type="submit" class="btn btn-maroon" style="height: 46px; margin-top: 12px; cursor: pointer;">
                Sign In
              </button>
            </form>

            <div style="text-align: center; marginTop: 24px; font-size: 0.9rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px;">
              <p style="color: var(--text-muted);">
                New to the portal? 
                <a href="/register" style="color: var(--maroon-primary); font-weight: 700;">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/login');
  setupLayoutEvents();

  const form = document.getElementById('login-form') as HTMLFormElement;
  const errorDiv = document.getElementById('login-error')!;
  const errorMsg = document.getElementById('error-msg')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';

    const email = (document.getElementById('email-input') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password-input') as HTMLInputElement).value;

    try {
      const user = dbService.getUserByEmail(email);
      if (!user) {
        errorMsg.textContent = 'Account not found with this email.';
        errorDiv.style.display = 'block';
        return;
      }

      if (user.passwordHash !== sha256(password)) {
        errorMsg.textContent = 'Invalid password. Please try again.';
        errorDiv.style.display = 'block';
        return;
      }

      // Successful login
      setSession(user);
      navigate(redirect);
    } catch (err: any) {
      errorMsg.textContent = err.message || 'An unexpected error occurred.';
      errorDiv.style.display = 'block';
    }
  });
}
