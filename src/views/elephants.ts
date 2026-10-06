import { dbService, resolveUrl } from '../db';
import { getSession } from '../auth';
import { renderLayout, setupLayoutEvents } from '../components/layout';
import { renderCalendarWidget } from '../components/calendar';

export function renderElephants(params: Record<string, string> = {}) {
  const appDiv = document.getElementById('app')!;
  
  const initialSearch = params.search || '';
  const initialDistrict = params.district || '';
  const initialGender = params.gender || '';
  const initialMinHeight = params.minHeight || '';
  const initialFrom = params.availableFrom || '';
  const initialTo = params.availableTo || '';
  
  const districts = [
    'Thrissur', 'Palakkad', 'Kollam', 'Kottayam', 'Ernakulam',
    'Alappuzha', 'Thiruvananthapuram', 'Malappuram', 'Pathanamthitta',
    'Kozhikode', 'Kannur', 'Wayanad', 'Idukki', 'Kasaragod',
    'Forest Reserve (Statewide)'
  ];

  const html = `
    <div style="padding: 40px 0; background-color: var(--ivory-bg); min-height: 80vh;">
      <div class="container">
        <div style="margin-bottom: 32px;">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px;">
            <div>
              <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Majestic Pooram Elephants</h1>
              <p style="color: var(--text-muted); font-size: 1.05rem;">
                Official state database of captive elephants in Kerala, synced with Kerala Forest & Wildlife Department & High Court records.
              </p>
            </div>
            <div id="stats-badge" style="background: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.3); padding: 8px 16px; border-radius: 8px; font-weight: 600; color: var(--gold-primary); font-size: 0.9rem;">
              Loading registry...
            </div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="search-bar-container" style="margin-top: 0; margin-bottom: 40px; padding: 24px; border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Search Name / Microchip / Custodian</label>
              <input
                id="search-input"
                type="text"
                placeholder="e.g. Ramachandran, 00065DC96D, Devaswom..."
                class="form-control"
                value="${initialSearch}"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Registered District</label>
              <select id="district-input" class="form-control">
                <option value="">All Districts (Kerala)</option>
                ${districts.map(d => `<option value="${d}" ${initialDistrict === d ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Category / Gender</label>
              <select id="gender-input" class="form-control">
                <option value="">All Categories</option>
                <option value="Male" ${initialGender === 'Male' ? 'selected' : ''}>Tusker (Male / Komban)</option>
                <option value="Female" ${initialGender === 'Female' ? 'selected' : ''}>Cow Elephant (Female / Pidiyan)</option>
                <option value="Makhana" ${initialGender === 'Makhana' ? 'selected' : ''}>Makhana (Tuskless Male)</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Min Height (cm)</label>
              <input
                id="height-input"
                type="number"
                placeholder="e.g. 300"
                class="form-control"
                value="${initialMinHeight}"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Available From</label>
              <input
                id="from-input"
                type="date"
                class="form-control"
                value="${initialFrom}"
              />
            </div>

            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 0.85rem; font-weight: 600;">Available To</label>
              <input
                id="to-input"
                type="date"
                class="form-control"
                value="${initialTo}"
              />
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06);">
            <button id="reset-btn" class="btn btn-secondary" style="font-size: 0.85rem; padding: 8px 18px; cursor: pointer;">
              Reset Filters
            </button>
          </div>
        </div>

        <div id="results-container"></div>
        <div id="pagination-container" style="text-align: center; margin-top: 40px;"></div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/elephants');
  setupLayoutEvents();

  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const districtInput = document.getElementById('district-input') as HTMLSelectElement;
  const genderInput = document.getElementById('gender-input') as HTMLSelectElement;
  const heightInput = document.getElementById('height-input') as HTMLInputElement;
  const fromInput = document.getElementById('from-input') as HTMLInputElement;
  const toInput = document.getElementById('to-input') as HTMLInputElement;
  const resetBtn = document.getElementById('reset-btn')!;
  const resultsContainer = document.getElementById('results-container')!;
  const statsBadge = document.getElementById('stats-badge')!;
  const paginationContainer = document.getElementById('pagination-container')!;

  const PAGE_SIZE = 24;
  let currentVisibleCount = PAGE_SIZE;

  function filterAndRender() {
    const search = searchInput.value.toLowerCase().trim();
    const selectedDist = districtInput.value;
    const selectedGender = genderInput.value;
    const minHeight = heightInput.value ? parseInt(heightInput.value, 10) : 0;
    const fromVal = fromInput.value;
    const toVal = toInput.value;

    let list = dbService.getElephants().filter(e => e.isVerified);

    if (search) {
      list = list.filter(e => 
        e.name.toLowerCase().includes(search) || 
        e.registrationNumber.toLowerCase().includes(search) ||
        (e.microchipNumber && e.microchipNumber.toLowerCase().includes(search)) ||
        (e.microchipCertNo && e.microchipCertNo.toLowerCase().includes(search)) ||
        (e.presentCustodian && e.presentCustodian.toLowerCase().includes(search)) ||
        (e.district && e.district.toLowerCase().includes(search))
      );
    }

    if (selectedDist) {
      list = list.filter(e => e.district && e.district.toLowerCase() === selectedDist.toLowerCase());
    }

    if (selectedGender) {
      list = list.filter(e => e.gender && e.gender.toLowerCase() === selectedGender.toLowerCase());
    }

    if (minHeight) {
      list = list.filter(e => e.height >= minHeight);
    }

    if (fromVal || toVal) {
      const bookings = dbService.getElephantBookings();
      list = list.filter(e => {
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

    const totalMatches = list.length;
    statsBadge.textContent = `Showing ${Math.min(currentVisibleCount, totalMatches)} of ${totalMatches} verified elephants`;

    if (totalMatches === 0) {
      resultsContainer.innerHTML = `
        <div class="card" style="padding: 60px; text-align: center; color: var(--text-muted); border-radius: 12px;">
          <span style="font-size: 3.5rem; display: block; margin-bottom: 16px;">🐘</span>
          <h3 style="color: var(--maroon-primary); margin-bottom: 8px;">No elephants matched your criteria</h3>
          <p style="margin-top: 4px;">Try loosening the search filters, removing district constraints, or resetting filters.</p>
        </div>
      `;
      paginationContainer.innerHTML = '';
      return;
    }

    const visibleItems = list.slice(0, currentVisibleCount);

    resultsContainer.innerHTML = `
      <div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 24px;">
        ${visibleItems.map(ele => {
          const genderLabel = ele.gender === 'Female' ? 'Female' : (ele.gender === 'Makhana' ? 'Makhana' : 'Tusker');
          const chipLabel = ele.microchipNumber && ele.microchipNumber !== 'NIL' ? `MC: ${ele.microchipNumber}` : `Cert #${ele.microchipCertNo || 'KFD'}`;
          const districtLabel = ele.district || 'Kerala';
          const custodianLabel = ele.presentCustodian ? ele.presentCustodian.substring(0, 45) : (ele.owner?.name || 'Devaswom');

          return `
            <div class="card" style="display: flex; flex-direction: column; overflow: hidden; border-radius: 12px; box-shadow: var(--box-shadow-md); transition: transform 0.2s, box-shadow 0.2s;">
              <div class="card-img-wrapper" style="position: relative; height: 210px; overflow: hidden; background: #2c2523;">
                <img src="${resolveUrl(ele.imageUrl)}" alt="${ele.name}" class="card-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onerror="this.onerror=null; this.src='${resolveUrl('/assets/elephants/ramachandran.jpg')}';" />
                <div style="position: absolute; top: 12px; left: 12px; display: flex; flex-wrap: wrap; gap: 6px; z-index: 2;">
                  <span style="background: rgba(139, 28, 28, 0.9); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.5px;">
                    ${chipLabel}
                  </span>
                  <span style="background: rgba(197, 149, 40, 0.95); color: #3E1000; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">
                    📍 ${districtLabel}
                  </span>
                </div>
                <div style="position: absolute; bottom: 8px; right: 12px; background: rgba(0,0,0,0.65); color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 500;">
                  ${genderLabel}
                </div>
              </div>
              <div class="card-content" style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                  <h3 class="card-title" style="font-size: 1.25rem; font-weight: 700; margin: 0; line-height: 1.3;">${ele.name}</h3>
                </div>
                
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; display: flex; gap: 6px; align-items: center;">
                  <span>Reg: <strong>${ele.registrationNumber}</strong></span>
                </div>

                <div class="card-meta" style="display: flex; gap: 12px; font-size: 0.85rem; color: var(--text-dark); background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.15); padding: 8px 12px; border-radius: 6px; margin-bottom: 12px;">
                  <span><strong>${ele.height}</strong> cm</span>
                  <span>•</span>
                  <span><strong>${ele.age}</strong> Yrs</span>
                  <span>•</span>
                  <span><strong>${ele.weight}</strong> kg</span>
                </div>

                <p class="card-description" style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 14px; flex-grow: 1;">
                  ${ele.history.substring(0, 110)}...
                </p>

                ${ele.antecedents ? `
                  <div style="margin-bottom: 12px; font-size: 0.75rem; color: #FFA726; background: rgba(255, 152, 0, 0.15); border: 1px solid rgba(255, 152, 0, 0.35); padding: 4px 8px; border-radius: 4px;">
                    ⚠️ HC Record: ${ele.antecedents.substring(0, 50)}...
                  </div>
                ` : ''}
                
                <div style="margin-top: auto; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                  <span style="font-size: 0.75rem; color: var(--text-muted); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${ele.presentCustodian || ''}">
                    ${custodianLabel}
                  </span>
                  <a href="/elephants/${ele.id}" class="btn btn-primary" style="padding: 7px 14px; font-size: 0.8rem; font-weight: 600; white-space: nowrap;">
                    View Availability &rarr;
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Render Load More button if more elephants available
    if (currentVisibleCount < totalMatches) {
      paginationContainer.innerHTML = `
        <button id="load-more-btn" class="btn btn-secondary" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 600; cursor: pointer; border-radius: 8px;">
          Load More Elephants (${totalMatches - currentVisibleCount} remaining) &darr;
        </button>
      `;
      document.getElementById('load-more-btn')?.addEventListener('click', () => {
        currentVisibleCount += PAGE_SIZE;
        filterAndRender();
      });
    } else {
      paginationContainer.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.9rem;">All ${totalMatches} verified elephants loaded.</p>
      `;
    }
  }

  searchInput.addEventListener('input', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });
  districtInput.addEventListener('change', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });
  genderInput.addEventListener('change', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });
  heightInput.addEventListener('input', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });
  fromInput.addEventListener('change', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });
  toInput.addEventListener('change', () => {
    currentVisibleCount = PAGE_SIZE;
    filterAndRender();
  });

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    districtInput.value = '';
    genderInput.value = '';
    heightInput.value = '';
    fromInput.value = '';
    toInput.value = '';
    currentVisibleCount = PAGE_SIZE;
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

              <button type="submit" class="btn btn-maroon" style="margin-top: 8px; cursor: pointer; width: 100%;">
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

  const genderDisplay = elephant.gender === 'Female' ? 'Cow Elephant (Pidiyan)' : (elephant.gender === 'Makhana' ? 'Tuskless Male (Makhana)' : 'Tusker (Komban)');

  const html = `
    <div style="padding: 60px 0; background-color: var(--ivory-bg);">
      <div class="container">
        <!-- Breadcrumb -->
        <a href="/elephants" style="color: var(--maroon-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; text-decoration: none;">
          &larr; Back to Elephant Registry
        </a>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 48px; align-items: start;">
          <!-- Left Column: Elephant Details -->
          <div>
            <div style="border-radius: var(--border-radius-lg); overflow: hidden; box-shadow: var(--box-shadow-lg); border: var(--border-glow); margin-bottom: 28px; height: 380px; background: #2c2523;">
              <img src="${resolveUrl(elephant.imageUrl)}" alt="${elephant.name}" class="card-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='${resolveUrl('/assets/elephants/ramachandran.jpg')}';" />
            </div>

            <h1 style="font-size: 2.4rem; margin-bottom: 8px;">${elephant.name}</h1>
            
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
              <span class="badge badge-verified">Verified Government Registry</span>
              <span class="badge badge-confirmed">Reg: ${elephant.registrationNumber}</span>
              ${elephant.microchipNumber && elephant.microchipNumber !== 'NIL' ? `
                <span class="badge" style="background: var(--maroon-primary); color: white;">Microchip: ${elephant.microchipNumber}</span>
              ` : ''}
              <span class="badge" style="background: rgba(212, 175, 55, 0.2); color: var(--gold-primary); font-weight: 700; border: 1px solid rgba(212, 175, 55, 0.4);">📍 ${elephant.district || 'Kerala'}</span>
            </div>

            <!-- Card 1: Official Forest & Wildlife Dept Registry Record -->
            <div class="card" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--maroon-primary);">
              <h3 style="font-size: 1.15rem; margin-bottom: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                📜 Forest & Wildlife Dept Official Registry Details
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.9rem;">
                <p style="margin: 0;"><strong>Microchip ID:</strong> ${elephant.microchipNumber || 'NIL'}</p>
                <p style="margin: 0;"><strong>Microchip Certificate:</strong> #${elephant.microchipCertNo || 'Official Record'}</p>
                <p style="margin: 0;"><strong>Ownership Certificate (OC):</strong> ${elephant.ownershipCertNo || 'Devaswom / Forest Dept Registry'}</p>
                <p style="margin: 0;"><strong>Registered District:</strong> ${elephant.district || 'Kerala'}</p>
                <p style="margin: 0;"><strong>Elephant Category:</strong> ${genderDisplay}</p>
                <p style="margin: 0;"><strong>Present Custodian:</strong> ${elephant.presentCustodian || elephant.owner?.name || 'Devaswom'}</p>
              </div>
            </div>

            <!-- Card 2: Physical & Mathangaleela Characteristics -->
            <div class="card" style="padding: 24px; margin-bottom: 24px; border-left: 4px solid var(--gold-primary);">
              <h3 style="font-size: 1.15rem; margin-bottom: 16px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                🐘 Physical Characteristics & Mathangaleela Attributes
              </h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 0.9rem; margin-bottom: 12px;">
                <p style="margin: 0;"><strong>Height:</strong> ${elephant.height} cm</p>
                <p style="margin: 0;"><strong>Estimated Weight:</strong> ${elephant.weight} kg</p>
                <p style="margin: 0;"><strong>Age:</strong> ${elephant.age} Years</p>
                <p style="margin: 0;"><strong>Fitness Expiry:</strong> ${elephant.fitnessValidity}</p>
                <p style="margin: 0;"><strong>Primary Mahout:</strong> ${elephant.mahoutName}</p>
                <p style="margin: 0;"><strong>Mahout Contact:</strong> ${elephant.mahoutPhone}</p>
              </div>
              ${elephant.identificationMarks ? `
                <div style="padding-top: 10px; border-top: 1px dashed rgba(212, 175, 55, 0.2); font-size: 0.85rem; color: var(--text-muted);">
                  <strong>Physical Identification Marks:</strong> ${elephant.identificationMarks}
                </div>
              ` : ''}
            </div>

            <!-- Card 3: Behavioral Compliance & Antecedents (High Court Record) -->
            <div class="card" style="padding: 24px; margin-bottom: 24px;">
              <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--maroon-primary); display: flex; align-items: center; gap: 8px;">
                ⚖️ High Court & Veterinary Antecedents Record
              </h3>
              ${elephant.antecedents ? `
                <div style="padding: 12px 16px; background: rgba(255, 152, 0, 0.15); border-left: 4px solid #FFA726; border-radius: 4px; font-size: 0.85rem; color: #FFA726; margin-bottom: 12px;">
                  <strong>High Court Antecedent Filing:</strong> ${elephant.antecedents}
                </div>
              ` : `
                <div style="padding: 12px 16px; background: rgba(76, 175, 80, 0.15); border-left: 4px solid #81C784; border-radius: 4px; font-size: 0.85rem; color: #81C784; margin-bottom: 12px;">
                  ✅ <strong>Clear Safety Track Record:</strong> No adverse fatal incident antecedents recorded in Kerala High Court captive elephant submissions.
                </div>
              `}
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                <strong>Medical & Protocol Status:</strong> ${elephant.medicalRecords || 'Certified fit under Kerala Captive Elephants (Management and Maintenance) Rules.'}
              </p>
            </div>

            <!-- Card 4: Biography & History -->
            <div class="card" style="padding: 24px;">
              <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--maroon-primary);">
                📖 Heritage Profile & History
              </h3>
              <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-dark); margin: 0;">
                ${elephant.history}
              </p>
            </div>
          </div>

          <!-- Right Column: Calendar & Booking Panel -->
          <div style="display: flex; flex-direction: column; gap: 32px;">
            <!-- Interactive Calendar -->
            <div id="calendar-container"></div>

            <!-- Booking Form Card -->
            <div class="card" style="padding: 32px; border-radius: 12px;">
              <h3 style="font-size: 1.4rem; color: var(--maroon-primary); margin-bottom: 8px;">Book for your Festival</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
                Verified festival committees can request ceremonial booking dates for ${elephant.name}.
              </p>
              
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

        successMsg.textContent = 'Booking request submitted successfully! The owner/custodian has been notified.';
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
