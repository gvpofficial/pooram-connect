interface BookingInfo {
  id: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'confirmed' | 'cancelled' | 'completed';
  festival?: { name: string; temple?: { name: string } };
  quantity?: number;
}

export function renderCalendarWidget(
  container: HTMLElement,
  bookings: BookingInfo[],
  totalQuantity = 1,
  itemName: string
) {
  // Start calendar view on April 2026 (since seed data is in April 2026)
  let currentDate = new Date(2026, 3, 1);
  let selectedDayInfo: { date: string; status: string; label: string; details: string | null } | null = null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  function getDayAvailability(dateStr: string) {
    if (!dateStr) return { status: 'empty', label: '', shortLabel: '', details: null };

    const overlapping = bookings.filter(b => {
      return dateStr >= b.startDate && dateStr <= b.endDate && b.status !== 'rejected' && b.status !== 'cancelled';
    });

    if (overlapping.length === 0) {
      return {
        status: 'available',
        label: totalQuantity > 1 ? `Available: ${totalQuantity}/${totalQuantity}` : 'Available',
        shortLabel: totalQuantity > 1 ? `${totalQuantity}/${totalQuantity}` : 'Avail',
        details: null
      };
    }

    const confirmed = overlapping.filter(b => b.status === 'confirmed');
    
    if (totalQuantity === 1) {
      if (confirmed.length > 0) {
        const b = confirmed[0];
        return {
          status: 'booked',
          label: 'Booked',
          shortLabel: 'Booked',
          details: `${b.festival?.name || 'Festival'} at ${b.festival?.temple?.name || 'Temple'}`
        };
      }

      const pendingOrAccepted = overlapping.find(b => b.status === 'pending' || b.status === 'accepted');
      if (pendingOrAccepted) {
        return {
          status: 'pending',
          label: pendingOrAccepted.status === 'accepted' ? 'Accepted (Hold)' : 'Pending',
          shortLabel: pendingOrAccepted.status === 'accepted' ? 'Hold' : 'Pending',
          details: `Requested for ${pendingOrAccepted.festival?.name || 'Festival'}`
        };
      }
    } else {
      let confirmedRented = 0;
      confirmed.forEach(b => confirmedRented += (b.quantity || 1));

      const remaining = totalQuantity - confirmedRented;

      if (remaining <= 0) {
        return {
          status: 'booked',
          label: 'Fully Booked',
          shortLabel: `0/${totalQuantity}`,
          details: 'Out of stock due to multiple reservations'
        };
      }

      const pending = overlapping.filter(b => b.status === 'pending' || b.status === 'accepted');
      let pendingRequested = 0;
      pending.forEach(b => pendingRequested += (b.quantity || 1));

      if (pendingRequested > 0) {
        return {
          status: 'pending',
          label: `Pending: ${pendingRequested} units requested`,
          shortLabel: `${remaining}/${totalQuantity}`,
          details: `Remaining stock: ${remaining}/${totalQuantity}`
        };
      }

      return {
        status: 'available',
        label: `Available: ${remaining}/${totalQuantity}`,
        shortLabel: `${remaining}/${totalQuantity}`,
        details: null
      };
    }

    return { status: 'available', label: 'Available', shortLabel: 'Avail', details: null };
  }

  function update() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const dayCells = [];
    for (let i = 0; i < firstDay; i++) {
      dayCells.push({ dateStr: '', dayNum: 0 });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      dayCells.push({ dateStr: dStr, dayNum: d });
    }

    const gridHtml = dayCells.map((cell, idx) => {
      if (cell.dayNum === 0) {
        return `<div class="calendar-cell cell-empty"></div>`;
      }

      const dayInfo = getDayAvailability(cell.dateStr);
      let cellClass = 'cell-available';
      if (dayInfo.status === 'booked') cellClass = 'cell-booked';
      if (dayInfo.status === 'pending') cellClass = 'cell-pending';

      return `
        <div class="calendar-cell ${cellClass}" data-date="${cell.dateStr}" style="cursor: pointer;">
          <span style="font-size: 0.9rem; align-self: flex-start;">${cell.dayNum}</span>
          <span class="calendar-cell-label">
            ${dayInfo.shortLabel}
          </span>
        </div>
      `;
    }).join('');

    const detailHtml = selectedDayInfo 
      ? `
        <div style="margin-top: 24px; padding: 16px; border-radius: var(--border-radius-sm); border: 1px solid rgba(0,0,0,0.1); background-color: var(--ivory-bg);">
          <h4 style="font-size: 1rem; color: var(--maroon-primary); margin-bottom: 4px;">
            Schedule details for ${selectedDayInfo.date}
          </h4>
          <p style="font-size: 0.9rem; font-weight: 600;">
            Status: <span style="color: ${selectedDayInfo.status === 'booked' ? 'var(--color-booked)' : selectedDayInfo.status === 'pending' ? 'var(--color-pending)' : 'var(--color-available)'};">
              ${selectedDayInfo.label}
            </span>
          </p>
          ${selectedDayInfo.details ? `<p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px;">📍 ${selectedDayInfo.details}</p>` : ''}
        </div>
      `
      : '';

    container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <h3 style="font-size: 1.2rem; font-family: var(--font-body);">${itemName} Calendar</h3>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button id="cal-prev" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; cursor: pointer;">&larr; Prev</button>
            <span style="font-weight: 700; font-size: 1.05rem; color: var(--maroon-primary); min-width: 110px; text-align: center;">
              ${monthNames[month]} ${year}
            </span>
            <button id="cal-next" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem; cursor: pointer;">Next &rarr;</button>
          </div>
        </div>

        <div class="calendar-grid">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(h => `<div class="calendar-day-header">${h}</div>`).join('')}
          ${gridHtml}
        </div>

        <div class="calendar-legend">
          <div class="legend-item">
            <span class="legend-dot available"></span>
            <span>Available</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot pending"></span>
            <span>Requested</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot booked"></span>
            <span>Fully Booked</span>
          </div>
        </div>
        
        <div id="cal-details-container">${detailHtml}</div>
      </div>
    `;

    // Bind event listeners
    document.getElementById('cal-prev')!.addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      update();
    });

    document.getElementById('cal-next')!.addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      update();
    });

    container.querySelectorAll('.calendar-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const dStr = cell.getAttribute('data-date');
        if (!dStr) return;
        const info = getDayAvailability(dStr);
        selectedDayInfo = {
          date: dStr,
          status: info.status,
          label: info.label,
          details: info.details
        };
        update();
      });
    });
  }

  update();
}
