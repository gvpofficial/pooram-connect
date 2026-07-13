import { getSession, logout } from '../auth';
import { navigate } from '../router';

export function renderLayout(contentHtml: string, currentPath: string): string {
  const session = getSession();
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/festivals', label: 'Festivals' },
    { href: '/elephants', label: 'Elephants' },
    { href: '/accessories', label: 'Accessories' }
  ];
  
  const navHtml = navLinks.map(link => {
    const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));
    return `<a href="${link.href}" class="nav-link ${isActive ? 'active' : ''}">${link.label}</a>`;
  }).join('');
  const authHtml = session 
    ? `
      <a href="/dashboard" class="nav-link ${currentPath.startsWith('/dashboard') ? 'active' : ''}">
        Dashboard (${session.role === 'admin' ? 'Admin' : session.role === 'committee' ? 'Committee' : 'Owner'})
      </a>
      <button id="logout-btn" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem; cursor: pointer; border: none;">
        Logout
      </button>
    `
    : `
      <a href="/login" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Login</a>
      <a href="/register" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;">Register</a>
    `;

  const currentTheme = typeof document !== 'undefined' ? (document.documentElement.getAttribute('data-theme') || 'light') : 'light';
  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';
  const themeToggleHtml = `
    <button id="theme-toggle-btn" class="btn" style="padding: 6px 12px; font-size: 1.1rem; cursor: pointer; border: none; background: transparent; color: var(--gold-primary);" title="Toggle Light/Dark Theme">
      ${themeIcon}
    </button>
  `;

  return `
    <header class="header">
      <div class="container header-container">
        <a href="/" class="logo-section">
          <span class="logo-icon">🐘</span>
          <div class="logo-text">
            <h1>Pooram Connect</h1>
            <p>Kerala Temple Festival Portal</p>
          </div>
        </a>

        <nav class="nav-links">
          ${navHtml}
          ${themeToggleHtml}
          ${authHtml}
        </nav>
      </div>
    </header>
    
    <main style="min-height: calc(100vh - 80px - 280px);">
      ${contentHtml}
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-info">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <span style="font-size: 1.8rem;">🐘</span>
              <h3 style="color: var(--gold-primary); font-family: var(--font-accent); font-size: 1.2rem; margin: 0;">
                Pooram Connect
              </h3>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 320px;">
              The official centralized state ecosystem for temple festival planning, majestic elephant bookings, and traditional festival accessory rentals.
            </p>
          </div>
          
          <div>
            <h4 style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 16px; font-family: var(--font-title);">Quick Links</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <li><a href="/" style="color: var(--text-muted); transition: color 0.2s;">Home</a></li>
              <li><a href="/festivals" style="color: var(--text-muted); transition: color 0.2s;">Festivals</a></li>
              <li><a href="/elephants" style="color: var(--text-muted); transition: color 0.2s;">Elephants</a></li>
              <li><a href="/accessories" style="color: var(--text-muted); transition: color 0.2s;">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 16px; font-family: var(--font-title);">Portal Access</h4>
            <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <li><a href="/login" style="color: var(--text-muted); transition: color 0.2s;">Login to Portal</a></li>
              <li><a href="/register" style="color: var(--text-muted); transition: color 0.2s;">Register New Account</a></li>
              <li><a href="/dashboard" style="color: var(--text-muted); transition: color 0.2s;">User Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 16px; font-family: var(--font-title);">State Authorities</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Administered by the Department of Devaswom, Government of Kerala. All rights reserved &copy; 2026.
            </p>
          </div>
        </div>
        
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: 32px; padding-top: 20px; text-align: center; font-size: 0.75rem; color: var(--text-muted);">
          <p>Designed and built for cultural heritage preservation and digital safety in animal bookings.</p>
        </div>
      </div>
    </footer>
  `;
}

export function setupLayoutEvents() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      navigate('/');
    });
  }

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pooram_theme', newTheme);
      themeToggleBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }
}
