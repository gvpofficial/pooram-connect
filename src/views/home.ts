import { dbService } from '../db';
import { renderLayout, setupLayoutEvents } from '../components/layout';

export function renderHome() {
  const appDiv = document.getElementById('app')!;
  
  const festivals = dbService.getFestivals().slice(0, 3);
  const elephants = dbService.getElephants().filter(e => e.isVerified).slice(0, 3);
  const accessories = dbService.getAccessories().filter(a => a.isVerified).slice(0, 3);

  const festivalsHtml = festivals.map(fest => `
    <div class="card">
      <div class="card-img-wrapper">
        <img src="${fest.imageUrl}" alt="${fest.name}" class="card-img" />
      </div>
      <div class="card-content">
        <span class="badge badge-info" style="margin-bottom: 8px; display: inline-block;">
          ${fest.status.toUpperCase()}
        </span>
        <h3 style="font-size: 1.2rem; margin-bottom: 8px;">${fest.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
          📍 ${fest.temple?.name} (${fest.temple?.district})
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 16px; min-height: 60px;">
          ${fest.description}
        </p>
        <div style="font-size: 0.8rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px; color: var(--maroon-primary); font-weight: 600;">
          📅 ${new Date(fest.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
          ${new Date(fest.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  `).join('');

  const elephantsHtml = elephants.map(e => `
    <div class="card">
      <div class="card-img-wrapper">
        <img src="${e.imageUrl}" alt="${e.name}" class="card-img" />
      </div>
      <div class="card-content">
        <h3 style="font-size: 1.2rem; margin-bottom: 8px;">${e.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          🐘 Age: ${e.age} yrs | Height: ${e.height} cm
        </p>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 16px; min-height: 60px;">
          ${e.history.substring(0, 100)}...
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Reg: ${e.registrationNumber}
          </span>
          <a href="/elephants/${e.id}" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">
            View details
          </a>
        </div>
      </div>
    </div>
  `).join('');

  const accessoriesHtml = accessories.map(a => `
    <div class="card">
      <div class="card-img-wrapper">
        <img src="${a.imageUrl}" alt="${a.name}" class="card-img" />
      </div>
      <div class="card-content">
        <span class="badge" style="background-color: var(--deep-green-light); color: var(--deep-green); margin-bottom: 8px; display: inline-block; font-size: 0.75rem;">
          ${a.category}
        </span>
        <h3 style="font-size: 1.2rem; margin-bottom: 8px;">${a.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 16px; min-height: 60px;">
          ${a.description.substring(0, 100)}...
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px;">
          <span style="font-weight: 700; color: var(--maroon-primary); font-size: 0.95rem;">
            ₹${a.rentalPrice}/day
          </span>
          <a href="/accessories/${a.id}" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;">
            Rent Accessories
          </a>
        </div>
      </div>
    </div>
  `).join('');

  const html = `
    <div>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <h2 class="hero-title poornam-accent">കേരള പൂരം</h2>
          <h1 class="hero-title" style="font-size: 2.8rem; margin-top: -10px;">
            Kerala Pooram Management Portal
          </h1>
          <p class="hero-subtitle">
            A centralized state ecosystem for temple festival planning, majestic elephant bookings, and traditional festival accessory rentals.
          </p>
          <div style="display: flex; justify-content: center; gap: 16px;">
            <a href="/festivals" class="btn btn-primary">
              Explore Festivals &rarr;
            </a>
            <a href="/login" class="btn btn-secondary">
              Access Portal Dashboards
            </a>
          </div>
        </div>
      </section>

      <!-- Overview Cards & CTA -->
      <section style="padding: 60px 0; background-color: var(--ivory-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 48px;">
            <h2 style="font-size: 2.2rem; margin-bottom: 12px;">A Digital Gateway to Kerala's Heritage</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto;">
              Pooram Connect bridges the gap between temple committees and resource owners to simplify planning, eliminate scheduling conflicts, and preserve traditions.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px;">
            <div class="card" style="padding: 32px; text-align: center; align-items: center;">
              <span style="font-size: 3rem; margin-bottom: 16px; display: block;">🕌</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 8px; color: var(--maroon-primary);">Festival Committees</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
                Register your temple, add festival dates and event schedules, search verified elephants, and secure accessories all in one workflow.
              </p>
              <a href="/register?role=committee" style="color: var(--gold-dark); font-weight: 600; font-size: 0.9rem;">
                Register Committee &rarr;
              </a>
            </div>

            <div class="card" style="padding: 32px; text-align: center; align-items: center;">
              <span style="font-size: 3rem; margin-bottom: 16px; display: block;">🐘</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 8px; color: var(--maroon-primary);">Elephant Owners</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
                List your elephants, manage fitness certs, publish availability calendars, and receive digital booking requests directly from verified committees.
              </p>
              <a href="/register?role=elephant_owner" style="color: var(--gold-dark); font-weight: 600; font-size: 0.9rem;">
                Register as Elephant Owner &rarr;
              </a>
            </div>

            <div class="card" style="padding: 32px; text-align: center; align-items: center;">
              <span style="font-size: 3rem; margin-bottom: 16px; display: block;">☂️</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 8px; color: var(--maroon-primary);">Accessory Owners</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
                List traditional ornaments, Chenda sets, or Muthukudas. Track stock inventory automatically and approve rental requests in real-time.
              </p>
              <a href="/register?role=accessory_owner" style="color: var(--gold-dark); font-weight: 600; font-size: 0.9rem;">
                Register as Accessory Owner &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Festivals -->
      <section style="padding: 60px 0; background-color: rgba(212, 175, 55, 0.05); border-top: 1px solid rgba(212, 175, 55, 0.15); border-bottom: 1px solid rgba(212, 175, 55, 0.15);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
            <div>
              <h2 style="font-size: 2rem;">Featured Poorams & Velas</h2>
              <p style="color: var(--text-muted); margin-top: 4px;">Witness the grandeur of upcoming temple festivals</p>
            </div>
            <a href="/festivals" style="color: var(--maroon-primary); font-weight: 700; font-size: 0.95rem;">
              View All Festivals &rarr;
            </a>
          </div>

          <div class="card-grid">
            ${festivalsHtml}
          </div>
        </div>
      </section>

      <!-- Verified Majestic Elephants -->
      <section style="padding: 60px 0;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
            <div>
              <h2 style="font-size: 2rem;">Majestic Elephants</h2>
              <p style="color: var(--text-muted); margin-top: 4px;">Devaswom certified and health-screened temple elephants</p>
            </div>
            <a href="/elephants" style="color: var(--maroon-primary); font-weight: 700; font-size: 0.95rem;">
              Browse Elephant Directory &rarr;
            </a>
          </div>

          <div class="card-grid">
            ${elephantsHtml}
          </div>
        </div>
      </section>

      <!-- Traditional Festival Accessories -->
      <section style="padding: 60px 0; background-color: var(--ivory-bg); border-top: 1px solid rgba(0,0,0,0.05);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;">
            <div>
              <h2 style="font-size: 2rem;">Festival Ornaments & Rentals</h2>
              <p style="color: var(--text-muted); margin-top: 4px;">Secure premium traditional decorations for Kudamattom & Melam</p>
            </div>
            <a href="/accessories" style="color: var(--maroon-primary); font-weight: 700; font-size: 0.95rem;">
              View Rental Catalog &rarr;
            </a>
          </div>

          <div class="card-grid">
            ${accessoriesHtml}
          </div>
        </div>
      </section>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/');
  setupLayoutEvents();
}
