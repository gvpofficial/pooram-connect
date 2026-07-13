import { dbService } from '../db';
import { getSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { renderCalendarWidget } from '../components/calendar';
import { navigate } from '../router';

const CATEGORIES = [
  'Nettipattam', 'Venchamaram', 'Aalavattam', 'Muthukuda',
  'Decorative umbrellas', 'Temple ornaments', 'Traditional lamps',
  'Festival decorations', 'Chenda Melam instruments', 'Panchavadyam instruments',
  'Other traditional Pooram accessories'
];

export function renderAccessories(params: Record<string, string> = {}) {
  const appDiv = document.getElementById('app')!;
  
  const initialSearch = params.search || '';
  const initialCategory = params.category || '';
  
  const categoryOptions = CATEGORIES.map(cat => `
    <option value="${cat}" ${cat === initialCategory ? 'selected' : ''}>${cat}</option>
  `).join('');

  const html = `
    <div style="padding: 40px 0; background-color: var(--ivory-bg); min-height: 80vh;">
      <div class="container">
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Traditional Pooram Accessories & Instruments</h1>
          <p style="color: var(--text-muted);">
            Rent high-quality gold-plated Nettipattams, decorative velvet Muthukudas, Chenda sets, and festival ornaments.
          </p>
        </div>

        <!-- Filter Bar -->
        <div class="search-bar-container" style="margin-top: 0; margin-bottom: 40px;">
          <div class="search-grid" style="grid-template-columns: 2fr 2fr auto;">
            <div class="form-group">
              <label class="form-label">Search Name or Specs</label>
              <input
                id="search-input"
                type="text"
                placeholder="e.g. Gold Nettipattam, Silk Velvet Muthukuda..."
                class="form-control"
                value="${initialSearch}"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Accessory Category</label>
              <select id="category-select" class="form-control">
                <option value="">All Categories</option>
                ${categoryOptions}
              </select>
            </div>

            <button id="reset-btn" class="btn btn-secondary" style="height: 44px; cursor: pointer;">
              Clear Filters
            </button>
          </div>
        </div>

        <div id="results-container"></div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/accessories');
  setupLayoutEvents();

  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
  const resetBtn = document.getElementById('reset-btn')!;
  const resultsContainer = document.getElementById('results-container')!;

  function filterAndRender() {
    const search = searchInput.value.toLowerCase().trim();
    const category = categorySelect.value;

    let list = dbService.getAccessories().filter(a => a.isVerified);

    if (search) {
      list = list.filter(a => 
        a.name.toLowerCase().includes(search) || 
        a.description.toLowerCase().includes(search)
      );
    }

    if (category) {
      list = list.filter(a => a.category === category);
    }

    if (list.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card" style="padding: 60px; text-align: center; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 16px;">☂️</span>
          <h3>No matching accessories found.</h3>
          <p style="margin-top: 8px;">Try modifying your keywords or selecting a different category filter.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="card-grid">
        ${list.map(acc => `
          <div class="card">
            <div class="card-img-wrapper">
              <img src="${acc.imageUrl}" alt="${acc.name}" class="card-img" />
            </div>
            <div class="card-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge badge-verified">${acc.category}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Stock: ${acc.quantityTotal} units</span>
              </div>
              <h3 class="card-title">${acc.name}</h3>
              <p class="card-description">${acc.description}</p>
              
              <div style="margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Daily Rent Rate:</span>
                  <span style="font-size: 1.1rem; fontWeight: 700; color: var(--color-available);">₹${acc.rentalPrice} / day</span>
                </div>
                <a href="/accessories/${acc.id}" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">
                  Check Availability &rarr;
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  searchInput.addEventListener('input', filterAndRender);
  categorySelect.addEventListener('change', filterAndRender);

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    filterAndRender();
  });

  filterAndRender();
}

export function renderAccessoryDetail(params: Record<string, string>) {
  const appDiv = document.getElementById('app')!;
  const accessoryId = params.id;

  const accessory = dbService.getAccessoryById(accessoryId);
  if (!accessory) {
    appDiv.innerHTML = renderLayout(`
      <div class="container" style="padding: 80px 24px; text-align: center;">
        <h2 style="color: var(--maroon-primary);">Accessory not found</h2>
        <a href="/accessories" class="btn btn-primary" style="margin-top: 20px;">Back to Accessories Directory</a>
      </div>
    `, `/accessories/${accessoryId}`);
    setupLayoutEvents();
    return;
  }

  const session = getSession();
  const bookings = dbService.getAccessoryBookingsByAccessoryId(accessoryId);

  let userFestivals: any[] = [];
  if (session && session.role === 'committee') {
    userFestivals = dbService.getFestivals().filter(f => f.temple?.committeeId === session.userId);
  }

  const festivalOptions = userFestivals.map(f => `
    <option value="${f.id}">${f.name} (${f.startDate})</option>
  `).join('');

  const bookingFormHtml = session
    ? session.role === 'committee'
      ? session.isVerified
        ? userFestivals.length > 0
          ? `
            <form id="booking-form" style="display: flex; flex-direction: column; gap: 16px;">
              <div class="form-group">
                <label class="form-label">Select Festival Event</label>
                <select id="festival-select" class="form-control" required>
                  <option value="">-- Choose Festival --</option>
                  ${festivalOptions}
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input id="booking-start" type="date" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">End Date</label>
                  <input id="booking-end" type="date" class="form-control" required />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Rental Quantity (Max: ${accessory.quantityTotal})</label>
                <input
                  id="booking-qty"
                  type="number"
                  min="1"
                  max="${accessory.quantityTotal}"
                  value="1"
                  class="form-control"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Special Delivery / Customization Notes</label>
                <textarea
                  id="booking-notes"
                  rows="3"
                  placeholder="Detail color codes, transport setups, or timing details..."
                  class="form-control"
                ></textarea>
              </div>

              <button type="submit" class="btn btn-maroon" style="margin-top: 8px; cursor: pointer;">
                Request Rental Booking
              </button>
            </form>
          `
          : `
            <div style="text-align: center; padding: 16px; border: 1px dashed rgba(0,0,0,0.1); border-radius: 8px;">
              <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">
                You need to register a Temple & Festival in your dashboard before you can book resources.
              </p>
              <a href="/dashboard" class="btn btn-secondary" style="font-size: 0.85rem;">
                Go to Dashboard &rarr;
              </a>
            </div>
          `
        : `
          <div style="padding: 16px; background-color: #FFF3E0; border-radius: 8px; border-left: 4px solid #E65100; color: #E65100; font-size: 0.9rem;">
            <strong>Verification Pending:</strong> Your committee registration is currently undergoing administrative review. You will be able to book accessories once verified.
          </div>
        `
      : `
        <p style="font-size: 0.9rem; color: var(--text-muted);">
          Only users registered under a <strong>Festival Committee</strong> account can submit booking requests. Your current role is <strong>${session.role}</strong>.
        </p>
      `
    : `
      <div style="text-align: center; padding: 16px;">
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">
          Need to rent this item? Log in with your Festival Committee account.
        </p>
        <a href="/login?redirect=/accessories/${accessoryId}" class="btn btn-maroon" style="display: block; text-align: center;">
          Login to Rent &rarr;
        </a>
      </div>
    `;

  const specRows = Object.entries(accessory.specifications || {}).map(([key, val]) => `
    <p><strong>${key}:</strong> ${val}</p>
  `).join('');

  const html = `
    <div style="padding: 60px 0; background-color: var(--ivory-bg);">
      <div class="container">
        <!-- Breadcrumb -->
        <a href="/accessories" style="color: var(--maroon-primary); font-weight: 600; display: inline-block; margin-bottom: 24px;">
          &larr; Back to Accessories List
        </a>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 48px; align-items: start;">
          <!-- Left Column: Accessory Details -->
          <div>
            <div style="border-radius: var(--border-radius-lg); overflow: hidden; box-shadow: var(--box-shadow-lg); border: var(--border-glow); margin-bottom: 32px; height: 400px;">
              <img src="${accessory.imageUrl}" alt="${accessory.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <h1 style="font-size: 2.5rem; margin-bottom: 8px; color: var(--maroon-primary);">${accessory.name}</h1>
            
            <div style="display: flex; gap: 8px; margin-bottom: 24px;">
              <span class="badge badge-verified">${accessory.category}</span>
              <span class="badge badge-confirmed">Price: ₹${accessory.rentalPrice}/day</span>
            </div>

            <div class="card" style="padding: 24px; margin-bottom: 32px;">
              <h3 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--maroon-primary); border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">
                Item Specifications
              </h3>
              <div style="display: flex; flex-direction: column; gap: 12px; fontSize: 0.95rem;">
                <p><strong>Total Inventory Stock:</strong> ${accessory.quantityTotal} units</p>
                <p><strong>Rental Charge:</strong> ₹${accessory.rentalPrice} per day</p>
                ${specRows}
              </div>
            </div>

            <div class="card" style="padding: 24px;">
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">Description</h3>
              <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-dark);">${accessory.description}</p>
            </div>
          </div>

          <!-- Right Column: Calendar & Booking Panel -->
          <div style="display: flex; flex-direction: column; gap: 32px;">
            <!-- Interactive Calendar -->
            <div id="calendar-container"></div>

            <!-- Booking Form Card -->
            <div class="card" style="padding: 32px;">
              <h3 style="font-size: 1.4rem; color: var(--maroon-primary); margin-bottom: 16px;">Request Rental Booking</h3>
              
              <div id="booking-error" style="color: var(--color-booked); background-color: #FFEBEE; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; display: none;">
                ⚠️ <span id="error-msg"></span>
              </div>

              <div id="booking-success" style="color: var(--color-available); background-color: #E8F5E9; padding: 12px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px; display: none;">
                ✅ <span id="success-msg"></span>
              </div>

              ${bookingFormHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, `/accessories/${accessoryId}`);
  setupLayoutEvents();

  // Render the Calendar Widget
  const calContainer = document.getElementById('calendar-container')!;
  renderCalendarWidget(calContainer, bookings, accessory.quantityTotal, accessory.name);

  // Setup Form Events if it exists
  const bookingForm = document.getElementById('booking-form') as HTMLFormElement;
  if (bookingForm) {
    const festSelect = document.getElementById('festival-select') as HTMLSelectElement;
    const startInput = document.getElementById('booking-start') as HTMLInputElement;
    const endInput = document.getElementById('booking-end') as HTMLInputElement;
    const qtyInput = document.getElementById('booking-qty') as HTMLInputElement;
    const notesInput = document.getElementById('booking-notes') as HTMLTextAreaElement;
    const errorDiv = document.getElementById('booking-error')!;
    const errorMsg = document.getElementById('error-msg')!;
    const successDiv = document.getElementById('booking-success')!;
    const successMsg = document.getElementById('success-msg')!;

    festSelect.addEventListener('change', () => {
      const selectedId = festSelect.value;
      const fest = userFestivals.find(f => f.id === selectedId);
      if (fest) {
        startInput.value = fest.startDate;
        endInput.value = fest.endDate;
      } else {
        startInput.value = '';
        endInput.value = '';
      }
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';
      successDiv.style.display = 'none';

      const festivalId = festSelect.value;
      const startDate = startInput.value;
      const endDate = endInput.value;
      const quantity = parseInt(qtyInput.value) || 1;
      const notes = notesInput.value.trim();

      if (!festivalId || !startDate || !endDate || quantity < 1) {
        errorMsg.textContent = 'Please fill in all rental fields.';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        dbService.createAccessoryBooking({
          festivalId,
          accessoryId,
          startDate,
          endDate,
          quantity,
          notes
        });

        successMsg.textContent = 'Accessory rental request submitted successfully!';
        successDiv.style.display = 'block';

        // Clear form
        bookingForm.reset();
        
        // Rerender details and calendar with new pending booking
        setTimeout(() => {
          renderAccessoryDetail(params);
        }, 1500);

      } catch (err: any) {
        errorMsg.textContent = err.message || 'Overbooking detected or rental request failed.';
        errorDiv.style.display = 'block';
      }
    });
  }
}
