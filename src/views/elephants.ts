import { dbService, resolveUrl } from '../db';
import { getSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { renderCalendarWidget } from '../components/calendar';
import { navigate } from '../router';

export function renderElephants(params: Record<string, string> = {}) {
  const appDiv = document.getElementById('app')!;
  
  const initialSearch = params.search || '';
  const initialMinHeight = params.minHeight || '';
  const initialFrom = params.availableFrom || '';
  const initialTo = params.availableTo || '';
  
  const html = `
    <div style="padding: 40px 0; background-color: var(--ivory-bg); min-height: 80vh;">
      <div class="container">
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Majestic Pooram Elephants</h1>
          <p style="color: var(--text-muted);">
            Browse profiles, registrations, and booking availability calendars for Kerala's temple elephants.
          </p>
        </div>

        <!-- Filter Bar -->
        <div class="search-bar-container" style="margin-top: 0; margin-bottom: 40px;">
          <div class="search-grid">
            <div class="form-group">
              <label class="form-label">Search Name or Register No</label>
              <input
                id="search-input"
                type="text"
                placeholder="e.g. Ramachandran, Karnan..."
                class="form-control"
                value="${initialSearch}"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Min Height (cm)</label>
              <input
                id="height-input"
                type="number"
                placeholder="e.g. 300"
                class="form-control"
                value="${initialMinHeight}"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Available From</label>
              <input
                id="from-input"
                type="date"
                class="form-control"
                value="${initialFrom}"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Available To</label>
              <input
                id="to-input"
                type="date"
                class="form-control"
                value="${initialTo}"
              />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
            <button id="reset-btn" class="btn btn-secondary" style="font-size: 0.85rem; cursor: pointer;">
              Reset Filters
            </button>
          </div>
        </div>

        <div id="results-container"></div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/elephants');
  setupLayoutEvents();

  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const heightInput = document.getElementById('height-input') as HTMLInputElement;
  const fromInput = document.getElementById('from-input') as HTMLInputElement;
  const toInput = document.getElementById('to-input') as HTMLInputElement;
  const resetBtn = document.getElementById('reset-btn')!;
  const resultsContainer = document.getElementById('results-container')!;

  function filterAndRender() {
    const search = searchInput.value.toLowerCase().trim();
    const minHeight = heightInput.value ? parseInt(heightInput.value, 10) : 0;
    const fromVal = fromInput.value;
    const toVal = toInput.value;

    let list = dbService.getElephants().filter(e => e.isVerified);

    if (search) {
      list = list.filter(e => 
        e.name.toLowerCase().includes(search) || 
        e.registrationNumber.toLowerCase().includes(search)
      );
    }

    if (minHeight) {
      list = list.filter(e => e.height >= minHeight);
    }

    if (fromVal || toVal) {
      // Find all elephant bookings
      const bookings = dbService.getElephantBookings();
      list = list.filter(e => {
        // Find if this elephant is booked in the date range
        const hasOverlap = bookings.some(b => {
          if (b.elephantId !== e.id || b.status !== 'confirmed') return false;
          const bStart = b.startDate;
          const bEnd = b.endDate;
          
          if (fromVal && toVal) {
            return (fromVal <= bEnd && toVal >= bStart);
          } else if (fromVal) {
            return (fromVal <= bEnd);
          } else if (toVal) {
            return (toVal >= bStart);
          }
          return false;
        });
        return !hasOverlap;
      });
    }

    if (list.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card" style="padding: 60px; text-align: center; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 16px;">🐘</span>
          <h3>No verified elephants match your parameters.</h3>
          <p style="margin-top: 8px;">They might have active bookings on the selected dates, or try loosening the filters.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="card-grid">
        ${list.map(ele => `
          <div class="card">
            <div class="card-img-wrapper">
              <img src="${resolveUrl(ele.imageUrl)}" alt="${ele.name}" class="card-img" />
            </div>
            <div class="card-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge badge-verified">Verified</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Reg: ${ele.registrationNumber}</span>
              </div>
              <h3 class="card-title">${ele.name}</h3>
              <div class="card-meta">
                <span>Height: ${ele.height} cm</span>
                <span>Age: ${ele.age} Yrs</span>
                <span>Weight: ${ele.weight} kg</span>
              </div>
              <p class="card-description">${ele.history.substring(0, 150)}...</p>
              
              <div style="margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                  Owner: ${ele.owner?.name || 'Devaswom'}
                </span>
                <a href="/elephants/${ele.id}" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;">
                  View Availability &rarr;
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  searchInput.addEventListener('input', filterAndRender);
  heightInput.addEventListener('input', filterAndRender);
  fromInput.addEventListener('change', filterAndRender);
  toInput.addEventListener('change', filterAndRender);

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    heightInput.value = '';
    fromInput.value = '';
    toInput.value = '';
    filterAndRender();
  });

  filterAndRender();
}

export function renderElephantDetail(params: Record<string, string>) {
  const appDiv = document.getElementById('app')!;
  const elephantId = params.id;
  
  const elephant = dbService.getElephantById(elephantId);
  if (!elephant) {
    appDiv.innerHTML = renderLayout(`
      <div class="container" style="padding: 80px 24px; text-align: center;">
        <h2 style="color: var(--maroon-primary);">Elephant not found</h2>
        <a href="/elephants" class="btn btn-primary" style="margin-top: 20px;">Back to Elephant Directory</a>
      </div>
    `, `/elephants/${elephantId}`);
    setupLayoutEvents();
    return;
  }

  const session = getSession();
  const bookings = dbService.getElephantBookingsByElephantId(elephantId);
  
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
                <label class="form-label">Special Notes / Requirements</label>
                <textarea
                  id="booking-notes"
                  rows="3"
                  placeholder="Detail procession type, duration, or timing requirements..."
                  class="form-control"
                ></textarea>
              </div>

              <button type="submit" class="btn btn-maroon" style="margin-top: 8px; cursor: pointer;">
                Submit Booking Request
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
            <strong>Verification Pending:</strong> Your committee registration is currently undergoing administrative review. You will be able to book elephants once verified.
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
          Need to book this elephant? Log in with your Festival Committee account.
        </p>
        <a href="/login?redirect=/elephants/${elephantId}" class="btn btn-maroon" style="display: block; text-align: center;">
          Login to Book &rarr;
        </a>
      </div>
    `;

  const html = `
    <div style="padding: 60px 0; background-color: var(--ivory-bg);">
      <div class="container">
        <!-- Breadcrumb -->
        <a href="/elephants" style="color: var(--maroon-primary); font-weight: 600; display: inline-block; margin-bottom: 24px;">
          &larr; Back to Elephants List
        </a>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 48px; align-items: start;">
          <!-- Left Column: Elephant Details -->
          <div>
            <div style="border-radius: var(--border-radius-lg); overflow: hidden; box-shadow: var(--box-shadow-lg); border: var(--border-glow); margin-bottom: 32px; height: 400px;">
              <img src="${resolveUrl(elephant.imageUrl)}" alt="${elephant.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <h1 style="font-size: 2.5rem; margin-bottom: 8px; color: var(--maroon-primary);">${elephant.name}</h1>
            
            <div style="display: flex; gap: 8px; margin-bottom: 24px;">
              <span class="badge badge-verified">Verified Profile</span>
              <span class="badge badge-confirmed">Registration: ${elephant.registrationNumber}</span>
            </div>

            <div class="card" style="padding: 24px; margin-bottom: 32px;">
              <h3 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--maroon-primary); border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">
                Physical & Fitness Characteristics
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; fontSize: 0.95rem;">
                <p><strong>Height:</strong> ${elephant.height} cm</p>
                <p><strong>Weight:</strong> ${elephant.weight} kg</p>
                <p><strong>Age:</strong> ${elephant.age} Years</p>
                <p><strong>Fitness Expiry:</strong> ${elephant.fitnessValidity}</p>
                <p><strong>Mahout Name:</strong> ${elephant.mahoutName}</p>
                <p><strong>Mahout Contact:</strong> ${elephant.mahoutPhone}</p>
              </div>
            </div>

            <div class="card" style="padding: 24px;">
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">Biography & History</h3>
              <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-dark);">${elephant.history}</p>
              ${elephant.medicalRecords ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.05);">
                  <h4 style="font-size: 1rem; color: var(--maroon-primary); margin-bottom: 6px;">Medical History Note</h4>
                  <p style="font-size: 0.9rem; color: var(--text-muted);">${elephant.medicalRecords}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Calendar & Booking Panel -->
          <div style="display: flex; flex-direction: column; gap: 32px;">
            <!-- Interactive Calendar -->
            <div id="calendar-container"></div>

            <!-- Booking Form Card -->
            <div class="card" style="padding: 32px;">
              <h3 style="font-size: 1.4rem; color: var(--maroon-primary); margin-bottom: 16px;">Book for your Festival</h3>
              
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

  appDiv.innerHTML = renderLayout(html, `/elephants/${elephantId}`);
  setupLayoutEvents();

  // Render the Calendar Widget
  const calContainer = document.getElementById('calendar-container')!;
  renderCalendarWidget(calContainer, bookings, 1, elephant.name);

  // Setup Booking Form Events if it exists
  const bookingForm = document.getElementById('booking-form') as HTMLFormElement;
  if (bookingForm) {
    const festSelect = document.getElementById('festival-select') as HTMLSelectElement;
    const startInput = document.getElementById('booking-start') as HTMLInputElement;
    const endInput = document.getElementById('booking-end') as HTMLInputElement;
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
      const notes = notesInput.value.trim();

      if (!festivalId || !startDate || !endDate) {
        errorMsg.textContent = 'Please fill in all booking fields.';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        dbService.createElephantBooking({
          festivalId,
          elephantId,
          startDate,
          endDate,
          notes
        });

        successMsg.textContent = 'Booking request submitted successfully! The owner has been notified.';
        successDiv.style.display = 'block';

        // Clear form
        bookingForm.reset();
        
        // Rerender details and calendar with new pending booking
        setTimeout(() => {
          renderElephantDetail(params);
        }, 1500);

      } catch (err: any) {
        errorMsg.textContent = err.message || 'Overlap detected or booking failed.';
        errorDiv.style.display = 'block';
      }
    });
  }
}
