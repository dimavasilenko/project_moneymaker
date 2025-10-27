(function () {
    try {
        const dayEl = document.querySelector(
            '.installment-offer__deadline-day'
        );
        const monthEl = document.querySelector(
            '.installment-offer__deadline-month'
        );
        if (dayEl && monthEl) {
            const now = new Date();
            now.setDate(now.getDate() + 2);
            const day = now.getDate();
            const monthsGenitive = [
                'СІЧНЯ',
                'ЛЮТОГО',
                'БЕРЕЗНЯ',
                'КВІТНЯ',
                'ТРАВНЯ',
                'ЧЕРВНЯ',
                'ЛИПНЯ',
                'СЕРПНЯ',
                'ВЕРЕСНЯ',
                'ЖОВТНЯ',
                'ЛИСТОПАДА',
                'ГРУДНЯ',
            ];
            const monthName = monthsGenitive[now.getMonth()];
            dayEl.textContent = String(day);
            monthEl.textContent = monthName;
        }
    } catch (e) {}
})();
