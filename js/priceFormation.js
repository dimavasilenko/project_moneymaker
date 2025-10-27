(function () {
    const STORAGE_STEP_KEY = 'pricing_increase_step';
    const STORAGE_BASE_KEY = 'pricing_base_prices';
    const priceSelector = '.promo-pricing__price--new';

    const promoTimerEl = document.querySelector(
        '.promo-pricing__banner--timer'
    );
    const courseOfferTimerEl = document.querySelector(
        '.course-offer__banner--timer'
    );

    function makeUnitEl(timerEl) {
        if (!timerEl) return null;
        return {
            el: timerEl,
            days: timerEl.querySelector('[data-unit="days"]'),
            hours: timerEl.querySelector('[data-unit="hours"]'),
            minutes: timerEl.querySelector('[data-unit="minutes"]'),
            seconds: timerEl.querySelector('[data-unit="seconds"]'),
        };
    }

    const promoUnits = makeUnitEl(promoTimerEl);
    const courseOfferUnits = makeUnitEl(courseOfferTimerEl);

    function setUnits(units, d, h, m, s) {
        if (!units) return;
        if (units.days) units.days.textContent = String(d);
        if (units.hours) units.hours.textContent = String(h);
        if (units.minutes) units.minutes.textContent = String(m);
        if (units.seconds) units.seconds.textContent = String(s);
    }

    function getNextFridayAt235959(now) {
        const target = new Date(now);
        const FRIDAY = 5;
        let daysToAdd = (FRIDAY - now.getDay() + 7) % 7;
        if (daysToAdd === 0) {
            const todayTarget = new Date(now);
            todayTarget.setHours(23, 59, 59, 0);
            if (now >= todayTarget) daysToAdd = 7;
        }
        target.setDate(now.getDate() + daysToAdd);
        target.setHours(23, 59, 59, 0);
        target.setMinutes(59);
        target.setSeconds(59);
        target.setMilliseconds(0);
        return target;
    }

    function formatPrice(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function captureBasePrices() {
        const elems = Array.from(document.querySelectorAll(priceSelector));
        if (!elems.length) return [];
        const stored = localStorage.getItem(STORAGE_BASE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length === elems.length) {
                    return parsed;
                }
            } catch (e) {}
        }
        const bases = elems.map((el) => {
            const text = el.textContent || el.innerText || '';
            const num = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
            return num;
        });
        localStorage.setItem(STORAGE_BASE_KEY, JSON.stringify(bases));
        return bases;
    }

    function updateDisplayedPrices(step) {
        const elems = Array.from(document.querySelectorAll(priceSelector));
        const bases = captureBasePrices();
        if (!elems.length || !bases.length) return;
        elems.forEach((el, i) => {
            const base = bases[i] || 0;
            const newPrice = base + step * 1000;
            el.dataset.currentPrice = newPrice;
            const grnSpan = el.querySelector('.promo-pricing__price--grn');
            if (grnSpan) {
                el.innerHTML = `${formatPrice(newPrice)}${grnSpan.outerHTML}`;
            } else {
                el.textContent = formatPrice(newPrice) + ' грн';
            }
        });
    }

    let step = parseInt(localStorage.getItem(STORAGE_STEP_KEY), 10);
    if (isNaN(step) || step < 0) step = 0;
    captureBasePrices();
    updateDisplayedPrices(step);

    let currentTarget = getNextFridayAt235959(new Date());
    if (step > 0) {
        currentTarget.setDate(currentTarget.getDate() + step * 7);
    }

    let intervalId = null;

    function stopTimerFinal() {
        setUnits(promoUnits, '0', '0', '0', '0');
        setUnits(courseOfferUnits, '0', '0', '0', '0');
        if (promoTimerEl) promoTimerEl.classList.add('promo-pricing--ended');
        if (courseOfferTimerEl)
            courseOfferTimerEl.classList.add('promo-pricing--ended');
        if (intervalId) clearInterval(intervalId);
    }

    if (step >= 4) {
        stopTimerFinal();
        return;
    }

    function tick() {
        const now = new Date();
        const diff = currentTarget.getTime() - now.getTime();

        if (diff <= 0) {
            step = Math.min(4, step + 1);
            localStorage.setItem(STORAGE_STEP_KEY, String(step));
            updateDisplayedPrices(step);

            if (step >= 4) {
                stopTimerFinal();
                return;
            }

            currentTarget.setDate(currentTarget.getDate() + 7);
        } else {
            const seconds = Math.floor(diff / 1000) % 60;
            const minutes = Math.floor(diff / (1000 * 60)) % 60;
            const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setUnits(promoUnits, days, hours, minutes, seconds);
            setUnits(courseOfferUnits, days, hours, minutes, seconds);
        }
    }

    tick();
    intervalId = setInterval(tick, 1000);
})();
