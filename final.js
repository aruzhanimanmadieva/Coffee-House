/* SOLACE Coffee House — final-project features.
   Theme, demo authentication, contact validation, Open-Meteo and menu search. */
(function () {
  const THEME_KEY = 'solaceTheme';
  const LIGHT = 'light';
  const DARK = 'dark';
  const $ = (id) => document.getElementById(id);

  // Apply the saved theme before the page is interactive.
  try { document.documentElement.dataset.theme = localStorage.getItem(THEME_KEY) || LIGHT; }
  catch (_) { document.documentElement.dataset.theme = LIGHT; }

  function restoreThemeOverrides() {
    document.querySelectorAll('[data-solace-bg-original]').forEach((el) => {
      const value = el.dataset.solaceBgOriginal;
      const priority = el.dataset.solaceBgPriority || '';
      if (value) el.style.setProperty('background-color', value, priority);
      else el.style.removeProperty('background-color');
      delete el.dataset.solaceBgOriginal; delete el.dataset.solaceBgPriority;
    });
    document.querySelectorAll('[data-solace-bg-image-original]').forEach((el) => {
      const value = el.dataset.solaceBgImageOriginal;
      if (value) el.style.setProperty('background-image', value);
      else el.style.removeProperty('background-image');
      delete el.dataset.solaceBgImageOriginal;
    });
    document.querySelectorAll('[data-solace-color-original]').forEach((el) => {
      const value = el.dataset.solaceColorOriginal;
      const priority = el.dataset.solaceColorPriority || '';
      if (value) el.style.setProperty('color', value, priority);
      else el.style.removeProperty('color');
      delete el.dataset.solaceColorOriginal; delete el.dataset.solaceColorPriority;
    });
  }

  function rgbLuminance(value) {
    const m = value.match(/[\d.]+/g);
    if (!m || m.length < 3) return 1;
    const channels = m.slice(0, 3).map(Number).map((v) => {
      v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }

  // Legacy pages contain many separately styled sections and nested panels.
  // This contrast pass catches light-colored surfaces that older CSS rules miss.
  function repairDarkContrast() {
    if (document.documentElement.dataset.theme !== DARK) return;
    const surfaceSelectors = '.card, article, .contact-info, .contact-form-card, .weather-card, .account-card, .order-summary, .highlight-search, .menu-hero-note, .about-hero-note, .value-card, .team-card, .faq-item, .menu-search-history, .a6-search-suggestions, .input-group-text';
    document.querySelectorAll('body *').forEach((el) => {
      if (el.matches('script, style, img, svg, path, video, iframe, source, br, hr')) return;
      const style = getComputedStyle(el);
      const hasGradient = style.backgroundImage !== 'none' && style.backgroundImage.includes('gradient');
      if (hasGradient) {
        if (!('solaceBgImageOriginal' in el.dataset)) el.dataset.solaceBgImageOriginal = el.style.getPropertyValue('background-image');
        el.style.setProperty('background-image', 'linear-gradient(135deg, #3a3028, #211b16)', 'important');
      }
      const bg = style.backgroundColor;
      if (style.backgroundImage === 'none' && bg && bg !== 'rgba(0, 0, 0, 0)' && rgbLuminance(bg) > 0.58) {
        if (!('solaceBgOriginal' in el.dataset)) {
          el.dataset.solaceBgOriginal = el.style.getPropertyValue('background-color');
          el.dataset.solaceBgPriority = el.style.getPropertyPriority('background-color');
        }
        const rect = el.getBoundingClientRect();
        const isLarge = rect.width * rect.height > window.innerWidth * window.innerHeight * 0.18;
        const isSurface = el.matches(surfaceSelectors) || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.tagName === 'BUTTON';
        const color = isSurface ? '#2b241e' : (isLarge || ['SECTION','MAIN','HEADER','FOOTER'].includes(el.tagName) ? '#1d1915' : '#302821');
        el.style.setProperty('background-color', color, 'important');
      }
      const colorLum = rgbLuminance(style.color);
      if (colorLum < 0.38 && !el.matches('img, svg, path')) {
        if (!('solaceColorOriginal' in el.dataset)) {
          el.dataset.solaceColorOriginal = el.style.getPropertyValue('color');
          el.dataset.solaceColorPriority = el.style.getPropertyPriority('color');
        }
        const textColor = el.matches('a, .nav-link, .logo') ? '#e0b58e' : '#f1e8df';
        el.style.setProperty('color', textColor, 'important');
      }
    });
  }

  function applyTheme(theme) {
    const normalized = theme === DARK ? DARK : LIGHT;
    restoreThemeOverrides();
    document.documentElement.dataset.theme = normalized;
    try { localStorage.setItem(THEME_KEY, normalized); } catch (_) {}
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.innerHTML = normalized === DARK ? '☀️ <span>Light</span>' : '🌙 <span>Dark</span>';
      button.setAttribute('aria-pressed', String(normalized === DARK));
      button.setAttribute('aria-label', normalized === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
    if (normalized === DARK) {
      requestAnimationFrame(() => { repairDarkContrast(); window.setTimeout(repairDarkContrast, 120); });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(document.documentElement.dataset.theme || LIGHT);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === DARK ? LIGHT : DARK));
    });

    // Authentication simulation — localStorage only, no backend/security.
    const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    const passwordValid = (value) => value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
    const setMessage = (id, text, kind) => { const el = $(id); if (el) { el.textContent = text; el.className = (el.className.split(' ')[0] || '') + (kind ? ' ' + kind : ''); } };
    const getUsers = () => { try { return JSON.parse(localStorage.getItem('solaceUsers') || '[]'); } catch (_) { return []; } };

    const signup = $('signupAccountForm');
    if (signup) signup.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = $('accountName').value.trim();
      const email = $('accountEmail').value.trim().toLowerCase();
      const password = $('accountPassword').value;
      $('accountNameError').textContent = name.length >= 2 ? '' : 'Please enter your name (at least 2 characters).';
      $('accountEmailError').textContent = emailValid(email) ? '' : 'Please enter a valid email address.';
      $('accountPasswordError').textContent = passwordValid(password) ? '' : 'Use at least 8 characters, including a letter and a number.';
      if (name.length < 2 || !emailValid(email) || !passwordValid(password)) { setMessage('signupAccountMessage','Please correct the highlighted fields.','error'); return; }
      const users = getUsers();
      if (users.some((user) => user.email === email)) { setMessage('signupAccountMessage','An account with this email already exists. Please log in.','error'); return; }
      users.push({ name, email, password });
      localStorage.setItem('solaceUsers', JSON.stringify(users));
      localStorage.setItem('solaceCurrentUser', email);
      window.location.href = 'profile.html';
    });

    const login = $('loginAccountForm');
    if (login) login.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = $('loginEmail').value.trim().toLowerCase();
      const password = $('loginPassword').value;
      $('loginEmailError').textContent = emailValid(email) ? '' : 'Enter a valid email address.';
      $('loginPasswordError').textContent = password ? '' : 'Please enter your password.';
      if (!emailValid(email) || !password) { setMessage('loginAccountMessage','Please complete both fields.','error'); return; }
      const user = getUsers().find((item) => item.email === email && item.password === password);
      if (!user) { setMessage('loginAccountMessage','We could not find an account with these details. Check your email and password.','error'); return; }
      localStorage.setItem('solaceCurrentUser', user.email);
      window.location.href = 'profile.html';
    });

    if ($('profileDetails')) {
      const email = localStorage.getItem('solaceCurrentUser');
      const user = getUsers().find((item) => item.email === email);
      if (!user) { window.location.replace('login.html'); return; }
      const safe = (value) => String(value).replace(/[&<>"']/g, (ch) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
      $('profileDetails').innerHTML = `<strong>Name:</strong> ${safe(user.name)}<br><strong>Email:</strong> ${safe(user.email)}<br><strong>Membership:</strong> SOLACE Coffee Club`;
      $('logoutButton').addEventListener('click', () => { localStorage.removeItem('solaceCurrentUser'); window.location.href = 'index.html'; });
    }

    // Contact form validation. The form keeps its original three-step UX.
    const contact = $('contactForm');
    if (contact) {
      const phoneValid = (value) => /^\+?[0-9\s()\-]{7,20}$/.test(value.trim());
      const validateIdentityStep = () => {
        let valid = true;
        const name = $('name'), email = $('email'), phone = $('phone');
        if (name) { const ok = name.value.trim().length >= 2; name.classList.toggle('is-invalid', !ok); if (!ok) valid = false; }
        if (email) { const ok = emailValid(email.value); email.classList.toggle('is-invalid', !ok); if (!ok) valid = false; }
        if (phone) { const ok = phoneValid(phone.value); phone.classList.toggle('is-invalid', !ok); const err = $('phoneError'); if (err) err.textContent = ok ? '' : 'Please enter a valid phone number, e.g. +7 700 123 45 67.'; if (!ok) valid = false; }
        return valid;
      };
      contact.querySelectorAll('[data-next-step]').forEach((button) => {
        button.addEventListener('click', (event) => {
          if (button.closest('.form-step')?.dataset.step === '1' && !validateIdentityStep()) {
            event.preventDefault(); event.stopImmediatePropagation();
            const message = $('contactFormMessage'); if (message) { message.textContent = 'Please check your name, email and phone number before continuing.'; message.className = 'contact-form-message error'; }
          }
        }, true);
      });
      contact.addEventListener('submit', (event) => {
        const messageField = contact.querySelector('textarea');
        const validIdentity = validateIdentityStep();
        const validMessage = !!messageField && !!messageField.value.trim();
        if (messageField) messageField.classList.toggle('is-invalid', !validMessage);
        if (!validIdentity || !validMessage) {
          event.preventDefault(); event.stopImmediatePropagation();
          const message = $('contactFormMessage'); if (message) { message.textContent = 'Please complete all required fields and check your email and phone number.'; message.className = 'contact-form-message error'; }
        }
      }, true);
    }

    // Open-Meteo API — current Astana weather, no API key required.
    const weatherStatus = $('weatherStatus');
    const refreshWeather = $('refreshWeather');
    async function loadWeather() {
      if (!weatherStatus) return;
      weatherStatus.hidden = false; weatherStatus.textContent = 'Loading current weather for Astana...';
      const result = $('weatherResult'); if (result) result.hidden = true;
      if (refreshWeather) refreshWeather.disabled = true;
      try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=51.1694&longitude=71.4491&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=Asia%2FAlmaty';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather service unavailable');
        const data = await response.json();
        if (!data.current) throw new Error('Weather data missing');
        const current = data.current, code = current.weather_code;
        const description = code === 0 ? 'Clear sky' : [1,2,3].includes(code) ? 'Partly cloudy' : [45,48].includes(code) ? 'Foggy' : [51,53,55,56,57].includes(code) ? 'Drizzle' : [61,63,65,66,67,80,81,82].includes(code) ? 'Rainy' : [71,73,75,77,85,86].includes(code) ? 'Snowy' : [95,96,99].includes(code) ? 'Thunderstorm' : 'Current conditions';
        $('weatherTemperature').textContent = `${Math.round(current.temperature_2m)}°C`;
        $('weatherDescription').textContent = `${description} · Feels like ${Math.round(current.apparent_temperature)}°C · Humidity ${current.relative_humidity_2m}%`;
        $('weatherRecommendation').textContent = current.temperature_2m <= 8 ? '☕ Our pick: a warm cappuccino or honey ginger tea — perfect for a chilly day.' : current.temperature_2m >= 24 ? '🧊 Our pick: an iced latte — something cool and refreshing.' : '🥐 Our pick: a classic latte with a little something sweet.';
        if (result) result.hidden = false; weatherStatus.hidden = true;
      } catch (_) { weatherStatus.textContent = 'We could not load the weather right now. Please check your connection and try again.'; }
      finally { if (refreshWeather) refreshWeather.disabled = false; }
    }
    if (weatherStatus) { loadWeather(); if (refreshWeather) refreshWeather.addEventListener('click', loadWeather); }

    // One unified menu search. It cooperates with the existing category filter.
    const search = $('menuAutocompleteInput');
    if (search) {
      const historyBox = $('menuSearchHistory'), status = $('menuSearchStatus');
      const HISTORY_KEY = 'solaceMenuSearchHistory', SEARCH_KEY = 'solaceMenuSearch';
      const readHistory = () => { try { const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(data) ? data.filter((v) => typeof v === 'string') : []; } catch (_) { return []; } };
      const activeCategory = () => document.querySelector('.menu-filter-button.is-active')?.dataset.filter || 'All';
      const records = () => Array.from(document.querySelectorAll('.menu-card, .tea-card, .dessert-card')).map((card) => {
        const section = card.closest('[data-menu-section]');
        const wrapper = card.closest('.tea-product-item, .col-12, .col-md-6, .col-lg-4') || card.parentElement;
        const category = section?.dataset.menuSection || (card.classList.contains('tea-card') ? 'Tea' : card.classList.contains('dessert-card') ? 'Desserts' : 'Coffee');
        return { card, wrapper, section, category };
      });
      const renderHistory = () => {
        if (!historyBox) return;
        historyBox.replaceChildren(); const history = readHistory(); historyBox.hidden = !history.length;
        if (!history.length) return;
        const label = document.createElement('span'); label.className = 'menu-search-history-label'; label.textContent = 'Recent searches'; historyBox.append(label);
        history.forEach((term) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'menu-search-history-item'; b.textContent = term; b.addEventListener('click', () => { search.value = term; applySearch(false); search.focus(); }); historyBox.append(b); });
        const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'menu-search-history-clear'; clear.textContent = 'Clear history'; clear.addEventListener('click', () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); }); historyBox.append(clear);
      };
      const remember = (query) => { if (query.length < 2) return; const next = readHistory().filter((x) => x.toLowerCase() !== query.toLowerCase()); next.unshift(query); localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, 6))); renderHistory(); };
      function applySearch(saveHistory) {
        const query = search.value.trim().toLowerCase(), category = activeCategory();
        let count = 0;
        records().forEach(({card, wrapper, category: itemCategory}) => {
          const text = `${card.textContent} ${card.querySelector('img')?.alt || ''}`.toLowerCase();
          const visible = (!query || text.includes(query)) && (category === 'All' || category === itemCategory);
          if (wrapper) wrapper.hidden = !visible;
          count += visible ? 1 : 0;
        });
        document.querySelectorAll('[data-menu-section]').forEach((section) => {
          const cards = Array.from(section.querySelectorAll('.menu-card, .tea-card, .dessert-card'));
          const hasVisible = cards.some((card) => { const w = card.closest('.tea-product-item, .col-12, .col-md-6, .col-lg-4') || card.parentElement; return w && !w.hidden; });
          section.hidden = !hasVisible; section.style.display = hasVisible ? '' : 'none';
        });
        if (status) status.textContent = query ? (count ? `${count} matching item${count === 1 ? '' : 's'} found.` : `No results for “${search.value.trim()}”. Try another search.`) : '';
        localStorage.setItem(SEARCH_KEY, search.value);
        if (saveHistory) remember(query);
      }
      search.placeholder = 'Search coffee, tea or desserts...';
      search.value = localStorage.getItem(SEARCH_KEY) || '';
      search.addEventListener('input', () => applySearch(false));
      search.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); applySearch(true); } });
      search.addEventListener('change', () => applySearch(true));
      document.querySelectorAll('.menu-filter-button').forEach((button) => button.addEventListener('click', () => window.setTimeout(() => applySearch(false), 30)));
      renderHistory();
      window.setTimeout(() => applySearch(false), 100);
    }
  });
})();
