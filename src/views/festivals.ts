import { dbService } from '../db';
import { renderLayout, setupLayoutEvents } from '../components/layout';

const DISTRICTS = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Trivandrum', 'Thrissur', 'Wayanad'
];

export function renderFestivals() {
  const appDiv = document.getElementById('app')!;
  
  const html = `
    <div style="padding: 40px 0; background-color: var(--ivory-bg); min-height: 80vh;">
      <div class="container">
        <div style="margin-bottom: 32px;">
          <h1 style="font-size: 2.5rem; margin-bottom: 8px;">Kerala Festivals Calendar</h1>
          <p style="color: var(--text-muted);">
            Discover upcoming Poorams, Ulsavams, and traditional Velas across the state.
          </p>
        </div>

        <!-- Filter Bar -->
        <div class="search-bar-container" style="margin-top: 0; margin-bottom: 40px;">
          <div class="search-grid">
            <div class="form-group">
              <label class="form-label">Search Temple or Festival</label>
              <input
                id="search-input"
                type="text"
                placeholder="e.g. Vadakkunnathan, Thrissur Pooram..."
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label class="form-label">District</label>
              <select id="district-select" class="form-control">
                <option value="">All Districts</option>
                ${DISTRICTS.map(d => `<option value="${d}">${d}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Active Date</label>
              <input
                id="date-input"
                type="date"
                class="form-control"
              />
            </div>

            <button id="reset-btn" class="btn btn-maroon" style="height: 44px; cursor: pointer;">
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Grid Results Container -->
        <div id="results-container"></div>
      </div>
    </div>
  `;

  appDiv.innerHTML = renderLayout(html, '/festivals');
  setupLayoutEvents();

  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const districtSelect = document.getElementById('district-select') as HTMLSelectElement;
  const dateInput = document.getElementById('date-input') as HTMLInputElement;
  const resetBtn = document.getElementById('reset-btn')!;
  const resultsContainer = document.getElementById('results-container')!;

  function filterAndRender() {
    const search = searchInput.value.toLowerCase();
    const district = districtSelect.value;
    const dateVal = dateInput.value;

    let list = dbService.getFestivals();

    if (search) {
      list = list.filter(f => 
        f.name.toLowerCase().includes(search) || 
        (f.temple?.name || '').toLowerCase().includes(search)
      );
    }

    if (district) {
      list = list.filter(f => f.temple?.district === district);
    }

    if (dateVal) {
      list = list.filter(f => dateVal >= f.startDate && dateVal <= f.endDate);
    }

    if (list.length === 0) {
      resultsContainer.innerHTML = `
        <div class="card" style="padding: 60px; text-align: center; color: var(--text-muted);">
          <span style="font-size: 3rem; display: block; margin-bottom: 16px;">📅</span>
          <h3>No festivals match your search criteria.</h3>
          <p style="margin-top: 8px;">Try resetting the filters or modifying your search term.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="card-grid">
        ${list.map(fest => `
          <div class="card">
            <div class="card-img-wrapper">
              <img src="${fest.imageUrl}" alt="${fest.name}" class="card-img" />
            </div>
            <div class="card-content">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span class="badge badge-confirmed">${fest.status}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">📅 ${fest.startDate} to ${fest.endDate}</span>
              </div>
              <h3 class="card-title">${fest.name}</h3>
              <div class="card-meta">
                <span>📍 ${fest.temple?.name}</span>
                <span>District: ${fest.temple?.district}</span>
              </div>
              <p class="card-description">${fest.description}</p>
              
              <div style="margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 16px;">
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
                  Location: ${fest.temple?.location}
                </p>
                <div style="display: flex; gap: 8px;">
                  <a href="/elephants?festivalId=${fest.id}&availableFrom=${fest.startDate}&availableTo=${fest.endDate}" class="btn btn-secondary" style="flex: 1; padding: 6px 10px; font-size: 0.75rem; text-align: center;">
                    Book Elephants
                  </a>
                  <a href="/accessories?festivalId=${fest.id}" class="btn btn-maroon" style="flex: 1; padding: 6px 10px; font-size: 0.75rem; text-align: center;">
                    Rent Accessories
                  </a>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  searchInput.addEventListener('input', filterAndRender);
  districtSelect.addEventListener('change', filterAndRender);
  dateInput.addEventListener('change', filterAndRender);

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    districtSelect.value = '';
    dateInput.value = '';
    filterAndRender();
  });

  // Initial render
  filterAndRender();
}
