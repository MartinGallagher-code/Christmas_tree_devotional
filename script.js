(function () {
  // Theme toggle with localStorage persistence
  const root = document.documentElement;
  let theme = root.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  root.setAttribute('data-theme', theme);

  const sunSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moonSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  const toggle = document.querySelector('[data-theme-toggle]');
  if (toggle) {
    function syncToggle() {
      toggle.innerHTML = theme === 'dark' ? sunSVG : moonSVG;
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    }
    syncToggle();
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch (e) {}
      syncToggle();
    });
  }

  // Sticky header shadow
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('site-header--scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // Advent dates — computed from the current year so "this year" references stay correct.
  // First Sunday of Advent is the fourth Sunday before 25 December.
  function computeAdvent(year) {
    const christmas = new Date(year, 11, 25);
    const dow = christmas.getDay();
    const daysBack = dow === 0 ? 7 : dow;
    const advent4 = new Date(year, 11, 25 - daysBack);
    const mk = (offset) => {
      const d = new Date(advent4);
      d.setDate(advent4.getDate() - offset);
      return d;
    };
    return [mk(21), mk(14), mk(7), advent4, christmas];
  }
  const dates = computeAdvent(new Date().getFullYear());
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const ordinals = ['first', 'second', 'third', 'fourth'];
  document.querySelectorAll('[data-advent-week]').forEach((el) => {
    const w = parseInt(el.getAttribute('data-advent-week'), 10);
    if (w >= 1 && w <= 4) {
      el.textContent = 'This year, the ' + ordinals[w - 1] + ' Sunday of Advent falls on ' + fmt(dates[w - 1]) + '.';
      el.hidden = false;
    }
  });
  document.querySelectorAll('[data-advent-season]').forEach((el) => {
    el.textContent = 'This year, Advent runs from Sunday ' + fmt(dates[0]) + ' to Christmas Day, ' + fmt(dates[4]) + '.';
    el.hidden = false;
  });
  document.querySelectorAll('[data-advent-start]').forEach((el) => {
    el.textContent = 'Advent begins Sunday ' + fmt(dates[0]) + ' — prepare your tree and family.';
    el.hidden = false;
  });

  // Scripture expand/collapse — loads text from passages.js on first click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.scripture-toggle');
    if (!btn) return;
    const li = btn.closest('li');
    let textDiv = li.querySelector('.scripture-text');

    // First click: create the text div and populate from data
    if (!textDiv && typeof ESV_PASSAGES !== 'undefined') {
      const ref = btn.getAttribute('data-ref');
      const html = ref && ESV_PASSAGES[ref];
      if (html) {
        textDiv = document.createElement('div');
        textDiv.className = 'scripture-text';
        textDiv.innerHTML = html;
        li.appendChild(textDiv);
      }
    }

    if (!textDiv) return;
    const open = textDiv.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('.toggle-label').textContent = open ? 'Hide' : 'Read';
  });
})();
