const header = document.querySelector('.calendar h3');
const dates = document.querySelector('.dates');
const navs = document.querySelectorAll('#prev, #next');
const daysContainer = document.querySelector('.days');
const themeBtn = document.querySelector('#theme-toggle');

const today = new Date();

let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

function renderWeekDays() {

    const weekdays = [];

    const firstSunday = new Date(2025, 0, 5);

    for (let i = 0; i < 7; i++) {

        const dayDate = new Date(firstSunday);

        dayDate.setDate(firstSunday.getDate() + i);

        weekdays.push(
            dayDate.toLocaleDateString(
                navigator.language,
                {
                    weekday: 'short'
                }
            )
        );
    }

    daysContainer.innerHTML = weekdays
        .map(day => `<li>${day}</li>`)
        .join('');
}

function renderCalendar() {

    const start = new Date(year, month, 1).getDay();

    const endDate = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const end = new Date(
        year,
        month,
        endDate
    ).getDay();

    const endDatePrev = new Date(
        year,
        month,
        0
    ).getDate();

    let datesHtml = '';

    for (let i = start; i > 0; i--) {

        datesHtml += `
            <li class="inactive">
                ${endDatePrev - i + 1}
            </li>
        `;
    }

    for (let i = 1; i <= endDate; i++) {

        const className =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
                ? ' class="today"'
                : '';

        datesHtml += `
            <li${className}>
                ${i}
            </li>
        `;
    }

    for (let i = end; i < 6; i++) {

        datesHtml += `
            <li class="inactive">
                ${i - end + 1}
            </li>
        `;
    }

    dates.innerHTML = datesHtml;

    header.textContent = new Date(year, month)
        .toLocaleDateString(
            navigator.language,
            {
                month: 'long',
                year: 'numeric'
            }
        );
}

navs.forEach(nav => {

    nav.addEventListener('click', e => {

        if (e.target.id === 'prev') {

            month--;

            if (month < 0) {
                month = 11;
                year--;
            }

        } else {

            month++;

            if (month > 11) {
                month = 0;
                year++;
            }

        }

        renderCalendar();
    });

});

// Modo noturno

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {

    document.body.classList.add('dark-mode');

    themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    const isDark =
        document.body.classList.contains(
            'dark-mode'
        );

    themeBtn.textContent =
        isDark ? '☀️' : '🌙';

    localStorage.setItem(
        'theme',
        isDark ? 'dark' : 'light'
    );
});

renderWeekDays();
renderCalendar();