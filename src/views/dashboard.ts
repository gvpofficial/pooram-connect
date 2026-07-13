import { dbService } from '../db';
import { getSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { navigate } from '../router';

const DISTRICTS = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Trivandrum', 'Thrissur', 'Wayanad'
];

const CATEGORIES = [
  'Nettipattam', 'Venchamaram', 'Aalavattam', 'Muthukuda',
  'Decorative umbrellas', 'Temple ornaments', 'Traditional lamps',
  'Festival decorations', 'Chenda Melam instruments', 'Panchavadyam instruments',
  'Other traditional Pooram accessories'
];

export function renderDashboard() {
  const appDiv = document.getElementById('app')!;
  const session = getSession();

  if (!session) {
    setTimeout(() => navigate('/login'), 0);
    return;
  }

  // Load appropriate dashboard HTML based on user role
  let dashboardHtml = '';
  
  if (session.role === 'admin') {
    dashboardHtml = renderAdminDashboard(session);
  } else if (session.role === 'committee') {
    dashboardHtml = renderCommitteeDashboard(session);
  } else if (session.role === 'elephant_owner') {
    dashboardHtml = renderElephantOwnerDashboard(session);
  } else if (session.role === 'accessory_owner') {
    dashboardHtml = renderAccessoryOwnerDashboard(session);
  } else {
    dashboardHtml = `
      <div class="container" style="padding: 80px 24px; text-align: center;">
        <h2>Invalid Account Role</h2>
      </div>
    `;
  }

  appDiv.innerHTML = renderLayout(dashboardHtml, '/dashboard');
  setupLayoutEvents();
  setupDashboardEvents(session);
}

// ----------------------------------------------------
// 1. ADMIN DASHBOARD
// ----------------------------------------------------
function renderAdminDashboard(session: any): string {
  const users = dbService.getUsers();
  const elephants = dbService.getElephants();
  const accessories = dbService.getAccessories();
  const elephantBookings = dbService.getElephantBookings();
  const accessoryBookings = dbService.getAccessoryBookings();

  // Metrics
  const metrics = {
    committeeCount: users.filter(u => u.role === 'committee').length,
    elephantsCount: elephants.length,
    elephantsVerified: elephants.filter(e => e.isVerified).length,
    accessoriesCount: accessories.length,
    accessoriesVerified: accessories.filter(a => a.isVerified).length,
    elBookingsConfirmed: elephantBookings.filter(b => b.status === 'confirmed').length,
    elBookingsPending: elephantBookings.filter(b => b.status === 'pending').length,
  };

  // Pending verification lists
  const pendingUsers = users.filter(u => !u.isVerified && u.role !== 'admin');
  const pendingElephants = elephants.filter(e => !e.isVerified);
  const pendingAccessories = accessories.filter(a => !a.isVerified);

  const pendingUsersRows = pendingUsers.map(u => `
    <tr data-id="${u.id}">
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="badge badge-pending">${u.role.replace('_', ' ')}</span></td>
      <td>${u.district}</td>
      <td>
        <button class="btn btn-maroon verify-user-btn" data-id="${u.id}" style="padding: 6px 12px; font-size: 0.75rem; cursor: pointer;">
          Verify Account
        </button>
      </td>
    </tr>
  `).join('');

  const pendingElephantsRows = pendingElephants.map(e => `
    <tr data-id="${e.id}">
      <td><strong>${e.name}</strong></td>
      <td>${e.age} Years</td>
      <td><code>${e.registrationNumber}</code></td>
      <td>${e.owner?.name || 'Devaswom'}</td>
      <td>
        <button class="btn btn-maroon verify-elephant-btn" data-id="${e.id}" style="padding: 6px 12px; font-size: 0.75rem; cursor: pointer;">
          Approve Registration
        </button>
      </td>
    </tr>
  `).join('');

  const pendingAccessoriesRows = pendingAccessories.map(a => `
    <tr data-id="${a.id}">
      <td><strong>${a.name}</strong></td>
      <td>${a.category}</td>
      <td>₹${a.rentalPrice}</td>
      <td>${a.owner?.name || 'Independent'}</td>
      <td>
        <button class="btn btn-maroon verify-accessory-btn" data-id="${a.id}" style="padding: 6px 12px; font-size: 0.75rem; cursor: pointer;">
          Approve Listing
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <h4 class="sidebar-title">Admin Console</h4>
        <nav class="sidebar-nav">
          <a href="/dashboard" class="sidebar-nav-item active">📈 Analytics Overview</a>
          <a href="#approvals" class="sidebar-nav-item">🛡️ Pending Approvals</a>
          <a href="/festivals" class="sidebar-nav-item">📅 View Festivals</a>
          <a href="/elephants" class="sidebar-nav-item">🐘 View Elephants</a>
        </nav>
      </aside>

      <main class="dashboard-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 2rem;">State Administration Dashboard</h1>
            <p style="color: var(--text-muted);">Welcome back Commissioner, Devaswom Department</p>
          </div>
          <span class="badge badge-verified" style="padding: 8px 16px;">Govt. Overseer</span>
        </div>

        <div id="admin-error" style="color: var(--color-booked); margin-bottom: 20px; font-weight: 700; display: none;"></div>
        <div id="admin-success" style="color: var(--color-available); margin-bottom: 20px; font-weight: 700; display: none;"></div>

        <!-- Metrics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 40px;">
          <div class="card" style="padding: 20px;">
            <p style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Active Committees</p>
            <h3 style="font-size: 2rem; margin-top: 6px; color: var(--maroon-primary);">${metrics.committeeCount}</h3>
          </div>
          <div class="card" style="padding: 20px;">
            <p style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Registered Elephants</p>
            <h3 style="font-size: 2rem; margin-top: 6px; color: var(--maroon-primary);">
              ${metrics.elephantsCount} <span style="font-size: 1rem; color: var(--text-muted);">(${metrics.elephantsVerified} Verified)</span>
            </h3>
          </div>
          <div class="card" style="padding: 20px;">
            <p style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Accessory Rent Listings</p>
            <h3 style="font-size: 2rem; margin-top: 6px; color: var(--maroon-primary);">
              ${metrics.accessoriesCount} <span style="font-size: 1rem; color: var(--text-muted);">(${metrics.accessoriesVerified} Verified)</span>
            </h3>
          </div>
          <div class="card" style="padding: 20px;">
            <p style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Elephant Bookings</p>
            <h3 style="font-size: 2rem; margin-top: 6px; color: var(--maroon-primary);">
              ${metrics.elBookingsConfirmed} <span style="font-size: 1rem; color: var(--text-muted);">(${metrics.elBookingsPending} Pending)</span>
            </h3>
          </div>
        </div>

        <!-- Approvals Section -->
        <section id="approvals" style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            🛡️ Registrations Pending Verification
          </h2>

          <div style="display: flex; flex-direction: column; gap: 32px;">
            <!-- Pending Users -->
            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">Pending Accounts (${pendingUsers.length})</h3>
              ${pendingUsers.length === 0 ? `
                <p style="color: var(--text-muted); font-size: 0.9rem;">No accounts awaiting verification.</p>
              ` : `
                <div class="data-table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>District</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${pendingUsersRows}
                    </tbody>
                  </table>
                </div>
              `}
            </div>

            <!-- Pending Elephants -->
            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">Pending Elephants (${pendingElephants.length})</h3>
              ${pendingElephants.length === 0 ? `
                <p style="color: var(--text-muted); font-size: 0.9rem;">No elephants awaiting verification.</p>
              ` : `
                <div class="data-table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Elephant Name</th>
                        <th>Age</th>
                        <th>Reg Number</th>
                        <th>Owner Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${pendingElephantsRows}
                    </tbody>
                  </table>
                </div>
              `}
            </div>

            <!-- Pending Accessories -->
            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">Pending Accessories (${pendingAccessories.length})</h3>
              ${pendingAccessories.length === 0 ? `
                <p style="color: var(--text-muted); font-size: 0.9rem;">No accessories awaiting verification.</p>
              ` : `
                <div class="data-table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Accessory Name</th>
                        <th>Category</th>
                        <th>Price / day</th>
                        <th>Owner</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${pendingAccessoriesRows}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

// ----------------------------------------------------
// 2. COMMITTEE DASHBOARD
// ----------------------------------------------------
function renderCommitteeDashboard(session: any): string {
  const temple = dbService.getTempleByCommitteeId(session.userId);
  const festivals = dbService.getFestivals().filter(f => f.temple?.committeeId === session.userId);
  const elBookings = dbService.getElephantBookingsByCommitteeId(session.userId);
  const accBookings = dbService.getAccessoryBookingsByCommitteeId(session.userId);

  const districtOptions = DISTRICTS.map(d => `
    <option value="${d}" ${d === 'Thrissur' ? 'selected' : ''}>${d}</option>
  `).join('');

  const scheduledFestivalsList = festivals.map(fest => `
    <div class="card" style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="font-size: 1.15rem; color: var(--maroon-primary);">${fest.name}</h4>
        <span class="badge badge-confirmed">${fest.status}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 10px;">
        📅 Duration: ${fest.startDate} to ${fest.endDate}
      </p>
      <p style="font-size: 0.9rem;">${fest.description}</p>
      <div style="display: flex; gap: 12px; marginTop: 16px;">
        <a href="/elephants?availableFrom=${fest.startDate}&availableTo=${fest.endDate}" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">
          🐘 Request Elephants
        </a>
        <a href="/accessories" class="btn btn-maroon" style="padding: 6px 12px; font-size: 0.8rem;">
          ☂️ Rent Ornaments
        </a>
      </div>
    </div>
  `).join('');

  const elephantBookingsRows = elBookings.map(b => `
    <tr>
      <td><strong>${b.elephant?.name || 'Elephant'}</strong></td>
      <td>${b.festival?.name || 'Festival'}</td>
      <td>${b.startDate} to ${b.endDate}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>
        ${(b.status === 'pending' || b.status === 'accepted') ? `
          <button class="btn btn-secondary cancel-el-booking-btn" data-id="${b.id}" style="padding: 4px 10px; font-size: 0.75rem; border-color: var(--color-booked); color: var(--color-booked); cursor: pointer;">
            Cancel Request
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');

  const accessoryBookingsRows = accBookings.map(b => `
    <tr>
      <td><strong>${b.accessory?.name || 'Accessory'}</strong></td>
      <td>${b.quantity} units</td>
      <td>${b.festival?.name || 'Festival'}</td>
      <td>${b.startDate} to ${b.endDate}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>
        ${(b.status === 'pending' || b.status === 'accepted') ? `
          <button class="btn btn-secondary cancel-acc-booking-btn" data-id="${b.id}" style="padding: 4px 10px; font-size: 0.75rem; border-color: var(--color-booked); color: var(--color-booked); cursor: pointer;">
            Cancel Request
          </button>
        ` : ''}
      </td>
    </tr>
  `).join('');

  return `
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <h4 class="sidebar-title">Pooram Planner</h4>
        <nav class="sidebar-nav">
          <a href="/dashboard" class="sidebar-nav-item active">🕌 Temple & Festivals</a>
          <a href="#bookings" class="sidebar-nav-item">📅 Booking Requests</a>
          <a href="/elephants" class="sidebar-nav-item">🐘 Search Elephants</a>
          <a href="/accessories" class="sidebar-nav-item">☂️ Rent Accessories</a>
        </nav>
      </aside>

      <main class="dashboard-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 2rem;">Festival Committee Dashboard</h1>
            <p style="color: var(--text-muted);">Manage your temple and request resources for Poorams</p>
          </div>
          <div style="text-align: right;">
            <span style="display: block; font-size: 0.85rem; font-weight: bold;">${session.name}</span>
            <span class="badge ${session.isVerified ? 'badge-verified' : 'badge-pending'}" style="margin-top: 4px;">
              ${session.isVerified ? 'Verified Committee' : 'Pending Verification'}
            </span>
          </div>
        </div>

        <div id="comm-error" style="color: var(--color-booked); margin-bottom: 20px; font-weight: 700; display: none;"></div>
        <div id="comm-success" style="color: var(--color-available); margin-bottom: 20px; font-weight: 700; display: none;"></div>

        ${!session.isVerified ? `
          <div style="padding: 16px; background-color: #FFF3E0; border-radius: 8px; border-left: 4px solid #E65100; color: #E65100; font-size: 0.9rem; margin-bottom: 32px;">
            <strong>Administrative Notice:</strong> Your account is currently unverified. You can set up your temple and festival draft events, but booking requests will be blocked until an administrator approves your registration.
          </div>
        ` : ''}

        <!-- Temple Section -->
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            🕌 Registered Temple Profile
          </h2>

          ${!temple ? `
            <div class="card" style="padding: 32px;">
              <p style="margin-bottom: 20px; color: var(--text-muted);">
                No temple registered for this committee. Please register your temple shrine to begin scheduling events.
              </p>
              <form id="temple-reg-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Temple Name</label>
                  <input id="t-name" type="text" placeholder="e.g. Sree Krishna Temple" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Location Address</label>
                  <input id="t-loc" type="text" placeholder="e.g. Guruvayur" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">District</label>
                  <select id="t-dist" class="form-control" required>
                    ${districtOptions}
                  </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                  <label class="form-label">Historical Background (optional)</label>
                  <textarea id="t-hist" placeholder="Enter traditional background or legends of this temple..." class="form-control"></textarea>
                </div>
                <button type="submit" class="btn btn-maroon" style="grid-column: span 2; margin-top: 10px; cursor: pointer;">
                  Register Temple Shrines
                </button>
              </form>
            </div>
          ` : `
            <div class="card" style="padding: 24px; display: flex; gap: 20px; align-items: center;">
              <span style="font-size: 3.5rem;">🕌</span>
              <div>
                <h3 style="font-size: 1.4rem; color: var(--maroon-primary);">${temple.name}</h3>
                <p style="font-size: 0.95rem; color: var(--text-muted);">
                  📍 ${temple.location}, ${temple.district} District
                </p>
                ${temple.history ? `<p style="font-size: 0.9rem; margin-top: 8px; font-style: italic;">${temple.history}</p>` : ''}
              </div>
            </div>
          `}
        </section>

        <!-- Festivals Section -->
        ${temple ? `
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
              📅 Scheduled Ulsavams & Poorams
            </h2>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: start;">
              <div>
                ${festivals.length === 0 ? `
                  <p style="color: var(--text-muted); font-style: italic;">No upcoming festival events registered.</p>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${scheduledFestivalsList}
                  </div>
                `}
              </div>

              <div class="card" style="padding: 24px;">
                <h3 style="font-size: 1.2rem; margin-bottom: 16px; color: var(--maroon-primary);">Schedule New Event</h3>
                <form id="fest-create-form" style="display: flex; flex-direction: column; gap: 12px;">
                  <div class="form-group">
                    <label class="form-label">Festival Title</label>
                    <input id="f-name" type="text" placeholder="e.g. Annual Arattu Maholsavam" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input id="f-start" type="date" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input id="f-end" type="date" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Event Description</label>
                    <textarea id="f-desc" rows="3" placeholder="Write brief schedule and key attractions..." class="form-control" required></textarea>
                  </div>
                  <button type="submit" class="btn btn-maroon" ${!session.isVerified ? 'disabled' : ''} style="margin-top: 8px; cursor: pointer;">
                    Schedule Festival
                  </button>
                </form>
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Bookings Section -->
        <section id="bookings" style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            📅 Track Resource Booking Requests
          </h2>

          <div style="display: flex; flex-direction: column; gap: 32px;">
            <!-- Elephants -->
            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">🐘 Elephant Bookings</h3>
              ${elBookings.length === 0 ? `
                <p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No elephant bookings submitted.</p>
              ` : `
                <div class="data-table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Elephant Name</th>
                        <th>Festival</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${elephantBookingsRows}
                    </tbody>
                  </table>
                </div>
              `}
            </div>

            <!-- Accessories -->
            <div>
              <h3 style="font-size: 1.2rem; margin-bottom: 12px; color: var(--maroon-primary);">☂️ Accessory Rentals</h3>
              ${accBookings.length === 0 ? `
                <p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No rental bookings submitted.</p>
              ` : `
                <div class="data-table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Accessory Name</th>
                        <th>Quantity</th>
                        <th>Festival</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${accessoryBookingsRows}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
}

// ----------------------------------------------------
// 3. ELEPHANT OWNER DASHBOARD
// ----------------------------------------------------
function renderElephantOwnerDashboard(session: any): string {
  const elephants = dbService.getElephants().filter(e => e.ownerId === session.userId);
  const bookings = dbService.getElephantBookingsByOwnerId(session.userId);

  const elephantListHtml = elephants.map(e => `
    <div class="card" style="padding: 20px; display: flex; gap: 20px; align-items: center;">
      <img src="${e.imageUrl}" alt="${e.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
      <div style="flex-grow: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-size: 1.2rem; color: var(--maroon-primary);">${e.name}</h4>
          <span class="badge ${e.isVerified ? 'badge-verified' : 'badge-pending'}">
            ${e.isVerified ? 'Verified' : 'Verification Pending'}
          </span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); marginTop: 4px;">
          Reg: <code>${e.registrationNumber}</code> | Height: ${e.height} cm | Age: ${e.age} Yrs
        </p>
        <p style="font-size: 0.85rem; marginTop: 6px;">
          <strong>Mahout:</strong> ${e.mahoutName} (${e.mahoutPhone})
        </p>
        <p style="font-size: 0.85rem; color: var(--color-booked); font-weight: 600;">
          Fitness Certificate Expiry: ${e.fitnessValidity}
        </p>
      </div>
    </div>
  `).join('');

  const bookingsRows = bookings.map(b => `
    <tr>
      <td><strong>${b.elephant?.name}</strong></td>
      <td>
        <strong>${b.festival?.name}</strong>
        <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">📍 ${b.temple?.name || 'Temple'}</span>
      </td>
      <td>${b.startDate} to ${b.endDate}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>
        ${b.status === 'pending' ? `
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary accept-el-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; cursor: pointer;">Accept</button>
            <button class="btn btn-secondary reject-el-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; color: var(--color-booked); border-color: var(--color-booked); cursor: pointer;">Reject</button>
          </div>
        ` : ''}
        ${b.status === 'accepted' ? `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Awaiting offline communication...</span>
            <button class="btn btn-maroon confirm-el-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; cursor: pointer;">Confirm Booking</button>
          </div>
        ` : ''}
      </td>
    </tr>
  `).join('');

  return `
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <h4 class="sidebar-title">Owner Controls</h4>
        <nav class="sidebar-nav">
          <a href="/dashboard" class="sidebar-nav-item active">🐘 Elephant Directory</a>
          <a href="#requests" class="sidebar-nav-item">📬 Booking Requests</a>
        </nav>
      </aside>

      <main class="dashboard-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 2rem;">Elephant Owner Dashboard</h1>
            <p style="color: var(--text-muted);">Register elephants, track health documents, and confirm festival bookings</p>
          </div>
          <div style="text-align: right;">
            <span style="display: block; font-size: 0.85rem; font-weight: bold;">${session.name}</span>
            <span class="badge badge-verified" style="margin-top: 4px;">Verified Owner</span>
          </div>
        </div>

        <div id="owner-error" style="color: var(--color-booked); margin-bottom: 20px; font-weight: 700; display: none;"></div>
        <div id="owner-success" style="color: var(--color-available); margin-bottom: 20px; font-weight: 700; display: none;"></div>

        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            🐘 Manage Elephant Registry
          </h2>

          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: start;">
            <div>
              ${elephants.length === 0 ? `
                <div class="card" style="padding: 32px; text-align: center; color: var(--text-muted);">
                  <p>No elephants registered. Register your first elephant using the panel on the right.</p>
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 20px;">
                  ${elephantListHtml}
                </div>
              `}
            </div>

            <!-- Form -->
            <div class="card" style="padding: 24px;">
              <h3 style="font-size: 1.2rem; marginBottom: 16px; color: var(--maroon-primary);">Register Elephant</h3>
              <form id="elephant-reg-form" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Elephant Name</label>
                  <input id="e-name" type="text" placeholder="e.g. Mangalamkunnu Karnan" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Registration Number</label>
                  <input id="e-reg" type="text" placeholder="e.g. KERALA-DEV-E123" class="form-control" required />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
                  <div class="form-group">
                    <label class="form-label">Age (Yrs)</label>
                    <input id="e-age" type="number" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Height (cm)</label>
                    <input id="e-height" type="number" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Weight (kg)</label>
                    <input id="e-weight" type="number" class="form-control" required />
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-group">
                    <label class="form-label">Mahout Name</label>
                    <input id="e-mahout" type="text" placeholder="e.g. Mani Nair" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Mahout Phone</label>
                    <input id="e-phone" type="tel" placeholder="e.g. 94460..." class="form-control" required />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Fitness Certificate Expiry Date</label>
                  <input id="e-validity" type="date" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Descriptive Biography & History</label>
                  <textarea id="e-hist" rows="3" placeholder="Describe historical background..." class="form-control" required></textarea>
                </div>
                <button type="submit" class="btn btn-maroon" style="marginTop: 8px; cursor: pointer;">
                  Register Elephant
                </button>
              </form>
            </div>
          </div>
        </section>

        <!-- Requests Panel -->
        <section id="requests" style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            📬 Pending Elephant Booking Requests
          </h2>
          ${bookings.length === 0 ? `
            <p style="color: var(--text-muted); font-style: italic; font-size: 0.95rem;">No booking requests received yet.</p>
          ` : `
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Elephant</th>
                    <th>Festival & Temple</th>
                    <th>Dates Requested</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${bookingsRows}
                </tbody>
              </table>
            </div>
          `}
        </section>
      </main>
    </div>
  `;
}

// ----------------------------------------------------
// 4. ACCESSORY OWNER DASHBOARD
// ----------------------------------------------------
function renderAccessoryOwnerDashboard(session: any): string {
  const accessories = dbService.getAccessories().filter(a => a.ownerId === session.userId);
  const bookings = dbService.getAccessoryBookingsByOwnerId(session.userId);

  const listHtml = accessories.map(a => `
    <div class="card" style="padding: 20px; display: flex; gap: 20px; align-items: center;">
      <img src="${a.imageUrl}" alt="${a.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
      <div style="flex-grow: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-size: 1.2rem; color: var(--maroon-primary);">${a.name}</h4>
          <span class="badge ${a.isVerified ? 'badge-verified' : 'badge-pending'}">
            ${a.isVerified ? 'Verified' : 'Verification Pending'}
          </span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); marginTop: 4px;">
          Category: ${a.category} | Stock: ${a.quantityTotal} units | Rent: ₹${a.rentalPrice} / day
        </p>
        <p style="font-size: 0.85rem; marginTop: 6px;">${a.description}</p>
      </div>
    </div>
  `).join('');

  const bookingsRows = bookings.map(b => `
    <tr>
      <td><strong>${b.accessory?.name}</strong></td>
      <td>${b.quantity} units</td>
      <td>
        <strong>${b.festival?.name}</strong>
        <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">📍 ${b.temple?.name || 'Temple'}</span>
      </td>
      <td>${b.startDate} to ${b.endDate}</td>
      <td><span class="badge badge-${b.status}">${b.status}</span></td>
      <td>
        ${b.status === 'pending' ? `
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary accept-acc-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; cursor: pointer;">Accept</button>
            <button class="btn btn-secondary reject-acc-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; color: var(--color-booked); border-color: var(--color-booked); cursor: pointer;">Reject</button>
          </div>
        ` : ''}
        ${b.status === 'accepted' ? `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">Awaiting offline communication...</span>
            <button class="btn btn-maroon confirm-acc-booking-btn" data-id="${b.id}" style="padding: 6px 10px; font-size: 0.75rem; cursor: pointer;">Confirm Rental</button>
          </div>
        ` : ''}
      </td>
    </tr>
  `).join('');

  const categoryOptions = CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('');

  return `
    <div class="dashboard-layout">
      <aside class="dashboard-sidebar">
        <h4 class="sidebar-title">Rentals Hub</h4>
        <nav class="sidebar-nav">
          <a href="/dashboard" class="sidebar-nav-item active">☂️ Rental Inventory</a>
          <a href="#requests" class="sidebar-nav-item">📬 Rental Requests</a>
        </nav>
      </aside>

      <main class="dashboard-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 2rem;">Accessory Owner Dashboard</h1>
            <p style="color: var(--text-muted);">Manage traditional ornaments inventory and accept committee rentals</p>
          </div>
          <div style="text-align: right;">
            <span style="display: block; font-size: 0.85rem; font-weight: bold;">${session.name}</span>
            <span class="badge badge-verified" style="margin-top: 4px;">Verified Vendor</span>
          </div>
        </div>

        <div id="acc-owner-error" style="color: var(--color-booked); margin-bottom: 20px; font-weight: 700; display: none;"></div>
        <div id="acc-owner-success" style="color: var(--color-available); margin-bottom: 20px; font-weight: 700; display: none;"></div>

        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            ☂️ Manage Rental Listings
          </h2>

          <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; align-items: start;">
            <div>
              ${accessories.length === 0 ? `
                <div class="card" style="padding: 32px; text-align: center; color: var(--text-muted);">
                  <p>No accessories listed. Register your rental items using the panel on the right.</p>
                </div>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 20px;">
                  ${listHtml}
                </div>
              `}
            </div>

            <!-- Form -->
            <div class="card" style="padding: 24px;">
              <h3 style="font-size: 1.2rem; marginBottom: 16px; color: var(--maroon-primary);">Add Rental Item</h3>
              <form id="accessory-reg-form" style="display: flex; flex-direction: column; gap: 12px;">
                <div class="form-group">
                  <label class="form-label">Accessory Name</label>
                  <input id="a-name" type="text" placeholder="e.g. Gold Nettipattam 1.5m" class="form-control" required />
                </div>
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select id="a-cat" class="form-control" required>
                    ${categoryOptions}
                  </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div class="form-group">
                    <label class="form-label">Daily Price (₹)</label>
                    <input id="a-price" type="number" placeholder="3500" class="form-control" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Stock Quantity</label>
                    <input id="a-qty" type="number" placeholder="5" class="form-control" required />
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <label class="form-label">Specs (optional)</label>
                  <input id="a-spec-height" type="text" placeholder="Height/Size (e.g. 150cm)" class="form-control" style="margin-bottom: 6px;" />
                  <input id="a-spec-mat" type="text" placeholder="Material (e.g. Copper/Gold-plated)" class="form-control" style="margin-bottom: 6px;" />
                  <input id="a-spec-style" type="text" placeholder="Tradition (e.g. Central Travancore)" class="form-control" />
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea id="a-desc" rows="3" placeholder="Write brief description..." class="form-control" required></textarea>
                </div>
                <button type="submit" class="btn btn-maroon" style="marginTop: 8px; cursor: pointer;">
                  Add Rental Listing
                </button>
              </form>
            </div>
          </div>
        </section>

        <!-- Requests Panel -->
        <section id="requests" style="margin-bottom: 40px;">
          <h2 style="font-size: 1.5rem; margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px;">
            📬 Pending Rental Requests
          </h2>
          ${bookings.length === 0 ? `
            <p style="color: var(--text-muted); font-style: italic; font-size: 0.95rem;">No rental requests received yet.</p>
          ` : `
            <div class="data-table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Accessory</th>
                    <th>Qty Renting</th>
                    <th>Festival & Temple</th>
                    <th>Dates Requested</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${bookingsRows}
                </tbody>
              </table>
            </div>
          `}
        </section>
      </main>
    </div>
  `;
}

// ----------------------------------------------------
// EVENT BINDINGS FOR ALL DASHBOARDS
// ----------------------------------------------------
function setupDashboardEvents(session: any) {
  const showErr = (dash: string, msg: string) => {
    const errDiv = document.getElementById(`${dash}-error`);
    if (errDiv) {
      errDiv.textContent = '⚠️ ' + msg;
      errDiv.style.display = 'block';
    }
  };

  const showSucc = (dash: string, msg: string) => {
    const succDiv = document.getElementById(`${dash}-success`);
    if (succDiv) {
      succDiv.textContent = '✅ ' + msg;
      succDiv.style.display = 'block';
    }
  };

  // 1. Admin Event Handling
  if (session.role === 'admin') {
    document.querySelectorAll('.verify-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.verifyUser(id, true);
        showSucc('admin', 'Account verified successfully!');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.verify-elephant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.verifyElephant(id, true);
        showSucc('admin', 'Elephant registration approved!');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.verify-accessory-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.verifyAccessory(id, true);
        showSucc('admin', 'Accessory listing approved!');
        setTimeout(renderDashboard, 1000);
      });
    });
  }

  // 2. Committee Event Handling
  if (session.role === 'committee') {
    const templeForm = document.getElementById('temple-reg-form');
    if (templeForm) {
      templeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('t-name') as HTMLInputElement).value.trim();
        const location = (document.getElementById('t-loc') as HTMLInputElement).value.trim();
        const district = (document.getElementById('t-dist') as HTMLSelectElement).value;
        const history = (document.getElementById('t-hist') as HTMLTextAreaElement).value.trim();

        dbService.createTemple({
          committeeId: session.userId,
          name,
          location,
          district,
          history,
          imageUrl: '/images/temple_vadakkunnathan.jpg'
        });

        showSucc('comm', 'Temple registered successfully!');
        setTimeout(renderDashboard, 1000);
      });
    }

    const festForm = document.getElementById('fest-create-form');
    if (festForm) {
      festForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const temple = dbService.getTempleByCommitteeId(session.userId);
        if (!temple) {
          showErr('comm', 'No temple registered.');
          return;
        }

        const name = (document.getElementById('f-name') as HTMLInputElement).value.trim();
        const startDate = (document.getElementById('f-start') as HTMLInputElement).value;
        const endDate = (document.getElementById('f-end') as HTMLInputElement).value;
        const description = (document.getElementById('f-desc') as HTMLTextAreaElement).value.trim();

        dbService.createFestival({
          templeId: temple.id,
          name,
          startDate,
          endDate,
          description,
          imageUrl: '/images/festival_thrissur.jpg',
          schedule: {
            "Day 1": "Flag Hoisting & Introductory Processions",
            "Day 2": "Traditional Chenda Melam & Grand Kudamattom",
            "Day 3": "Farewell Ceremony (Upacharam Cholli Piriyal)"
          }
        });

        showSucc('comm', 'Pooram Festival Scheduled Successfully!');
        setTimeout(renderDashboard, 1000);
      });
    }

    document.querySelectorAll('.cancel-el-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateElephantBookingStatus(id, 'cancelled');
        showSucc('comm', 'Elephant booking request cancelled!');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.cancel-acc-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateAccessoryBookingStatus(id, 'cancelled');
        showSucc('comm', 'Accessory booking request cancelled!');
        setTimeout(renderDashboard, 1000);
      });
    });
  }

  // 3. Elephant Owner Event Handling
  if (session.role === 'elephant_owner') {
    const elRegForm = document.getElementById('elephant-reg-form');
    if (elRegForm) {
      elRegForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('e-name') as HTMLInputElement).value.trim();
        const registrationNumber = (document.getElementById('e-reg') as HTMLInputElement).value.trim();
        const age = parseInt((document.getElementById('e-age') as HTMLInputElement).value, 10);
        const height = parseInt((document.getElementById('e-height') as HTMLInputElement).value, 10);
        const weight = parseInt((document.getElementById('e-weight') as HTMLInputElement).value, 10);
        const mahoutName = (document.getElementById('e-mahout') as HTMLInputElement).value.trim();
        const mahoutPhone = (document.getElementById('e-phone') as HTMLInputElement).value.trim();
        const fitnessValidity = (document.getElementById('e-validity') as HTMLInputElement).value;
        const history = (document.getElementById('e-hist') as HTMLTextAreaElement).value.trim();

        dbService.createElephant({
          ownerId: session.userId,
          name,
          registrationNumber,
          age,
          height,
          weight,
          mahoutName,
          mahoutPhone,
          fitnessValidity,
          history,
          imageUrl: '/images/elephant_ramachandran.jpg',
          fitnessCertificateUrl: '/docs/fitness.pdf'
        });

        showSucc('owner', 'Elephant registered successfully! Awaiting verification.');
        setTimeout(renderDashboard, 1000);
      });
    }

    document.querySelectorAll('.accept-el-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateElephantBookingStatus(id, 'accepted');
        showSucc('owner', 'Booking request accepted! Coordinate details offline.');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.reject-el-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateElephantBookingStatus(id, 'rejected');
        showSucc('owner', 'Booking request rejected.');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.confirm-el-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        try {
          dbService.updateElephantBookingStatus(id, 'confirmed');
          showSucc('owner', 'Booking successfully confirmed!');
          setTimeout(renderDashboard, 1000);
        } catch (err: any) {
          showErr('owner', err.message || 'Verification / overlapping schedule error.');
        }
      });
    });
  }

  // 4. Accessory Owner Event Handling
  if (session.role === 'accessory_owner') {
    const accRegForm = document.getElementById('accessory-reg-form');
    if (accRegForm) {
      accRegForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('a-name') as HTMLInputElement).value.trim();
        const category = (document.getElementById('a-cat') as HTMLSelectElement).value;
        const rentalPrice = parseFloat((document.getElementById('a-price') as HTMLInputElement).value);
        const quantityTotal = parseInt((document.getElementById('a-qty') as HTMLInputElement).value, 10);
        const desc = (document.getElementById('a-desc') as HTMLTextAreaElement).value.trim();
        
        const specHeight = (document.getElementById('a-spec-height') as HTMLInputElement).value.trim();
        const specMat = (document.getElementById('a-spec-mat') as HTMLInputElement).value.trim();
        const specStyle = (document.getElementById('a-spec-style') as HTMLInputElement).value.trim();

        const specifications: Record<string, string> = {};
        if (specHeight) specifications['Size'] = specHeight;
        if (specMat) specifications['Material'] = specMat;
        if (specStyle) specifications['Tradition'] = specStyle;

        dbService.createAccessory({
          ownerId: session.userId,
          name,
          category,
          rentalPrice,
          quantityTotal,
          description: desc,
          specifications,
          imageUrl: '/images/accessory_nettipattam.jpg'
        });

        showSucc('acc-owner', 'Accessory listed successfully! Awaiting verification.');
        setTimeout(renderDashboard, 1000);
      });
    }

    document.querySelectorAll('.accept-acc-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateAccessoryBookingStatus(id, 'accepted');
        showSucc('acc-owner', 'Rental request accepted! Coordinate delivery offline.');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.reject-acc-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        dbService.updateAccessoryBookingStatus(id, 'rejected');
        showSucc('acc-owner', 'Rental request rejected.');
        setTimeout(renderDashboard, 1000);
      });
    });

    document.querySelectorAll('.confirm-acc-booking-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id')!;
        try {
          dbService.updateAccessoryBookingStatus(id, 'confirmed');
          showSucc('acc-owner', 'Accessory rental confirmed!');
          setTimeout(renderDashboard, 1000);
        } catch (err: any) {
          showErr('acc-owner', err.message || 'Stock limits or date overlap errors.');
        }
      });
    });
  }
}
