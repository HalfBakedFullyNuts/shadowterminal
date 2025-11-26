export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

export function generateRecurringDates(startDate, months, dayOfWeek, weekNumber) {
    const dates = [];
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();

    for (let i = 0; i < months; i++) {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);

        // Find the first occurrence of the dayOfWeek (0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
        let dayOffset = dayOfWeek - firstDayOfMonth.getDay();
        if (dayOffset < 0) dayOffset += 7;

        // Calculate the date of the Nth occurrence
        let date = 1 + dayOffset + (weekNumber - 1) * 7;

        if (date <= daysInMonth) {
            dates.push(new Date(currentYear, currentMonth, date));
        }

        // Move to next month
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }
    return dates;
}

export function formatDate(date) {
    return date.toISOString().split('T')[0];
}

export function getISOWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
}
