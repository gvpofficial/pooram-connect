import { dbService, sha256 } from '../db';
import { getSession, setSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { navigate } from '../router';

const DISTRICTS = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Trivandrum', 'Thrissur', 'Wayanad'
];

export function renderRegister(params: Record<string, string> = {}) {
  const appDiv = document.getElementById('app')!;
  const initialRole = params.role || 'committee';
  
  if (getSession()) {
    setTimeout(() => navigate('/dashboard'), 0);
    return;
  }

  const districtOptions = DISTRICTS.map(d => `
    <option value="${d}" ${d === 'Thrissur' ? 'selected' : ''}>${d}</option>
  `).join('');

  const html = `
    <div style="padding: 60px 0; background-color: var(--ivory-bg); min-height: 80vh; display: flex; align-items: center;">
      <div class="container">
        <div style="max-width: 550px; margin: 0 auto; width: 100%;">
          <div class="card" style="padding: 40px; border-top: 4px solid var(--gold-primary);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h2 style="font-size: 1.8rem; color: var(--maroon-primary);">Create Portal Account</h2>
              <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
                Register as a Committee, Elephant Owner, or Accessory Rental service
              </p>
            </div>

            <div id="register-error" style="color: var(--color-booked); background-color: #FFEBEE; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; display: none;">
              ⚠️ <span id="error-msg"></span>
            </div>

            <div id="register-success" style="color: var(--color-available); background-color: #E8F5E9; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; display: none;">
              ✅ <span id="success-msg"></span>
            </div>

            <form id="register-form" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Full Name / Organization Name</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="e.g. Thrissur Devaswom Board"
                  class="form-control"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="e.g. contact@devaswom.org"
                  class="form-control"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <input
                  id="password-input"
                  type="password"
                  placeholder="Min 6 characters"
                  class="form-control"
                  required
                />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Account Role Type</label>
                  <select id="role-select" class="form-control" required>
                    <option value="committee" ${initialRole === 'committee' ? 'selected' : ''}>Festival Committee</option>
                    <option value="elephant_owner" ${initialRole === 'elephant_owner' ? 'selected' : ''}>Elephant Owner</option>
                    <option value="accessory_owner" ${initialRole === 'accessory_owner' ? 'selected' : ''}>Accessory Rental Owner</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Home District</label>
                  <select id="district-select" class="form-control" required>
                    ${districtOptions}
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Contact Mobile Number</label>
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  class="form-control"
                  required
                />
              </div>

              <button type="submit" class="btn btn-maroon" style="height: 46px; margin-top: 12px; cursor: pointer;">
                Register Account
              </button>
            </form>

            <div style="text-align: center; margin-top: 24px; font-size: 0.9rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px;">
              <p style="color: var(--text-muted);">
                Already have an account? 
                <a href="/login" style="color: var(--maroon-primary); font-weight: 700;">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/register');
  setupLayoutEvents();

  const form = document.getElementById('register-form') as HTMLFormElement;
  const errorDiv = document.getElementById('register-error')!;
  const errorMsg = document.getElementById('error-msg')!;
  const successDiv = document.getElementById('register-success')!;
  const successMsg = document.getElementById('success-msg')!;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    const name = (document.getElementById('name-input') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email-input') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password-input') as HTMLInputElement).value;
    const role = (document.getElementById('role-select') as HTMLSelectElement).value;
    const district = (document.getElementById('district-select') as HTMLSelectElement).value;
    const phone = (document.getElementById('phone-input') as HTMLInputElement).value.trim();

    if (password.length < 6) {
      errorMsg.textContent = 'Password must be at least 6 characters.';
      errorDiv.style.display = 'block';
      return;
    }

    try {
      const existingUser = dbService.getUserByEmail(email);
      if (existingUser) {
        errorMsg.textContent = 'An account with this email already exists.';
        errorDiv.style.display = 'block';
        return;
      }

      const newUser = dbService.createUser({
        name,
        email,
        passwordHash: sha256(password),
        role: role as any,
        phone,
        district
      });

      setSession(newUser);
      successMsg.textContent = 'Registration successful! Directing to dashboard...';
      successDiv.style.display = 'block';

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      errorMsg.textContent = err.message || 'An unexpected error occurred.';
      errorDiv.style.display = 'block';
    }
  });
}
