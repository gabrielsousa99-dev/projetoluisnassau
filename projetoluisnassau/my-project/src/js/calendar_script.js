/// ===== ELEMENTOS DO CALENDÁRIO =====
const header = document.querySelector('.calendar h3');
const dates = document.querySelector('.dates');
const navs = document.querySelectorAll('#prev, #next');
const daysContainer = document.querySelector('.days');

// ===== BOTÃO DO TEMA =====
const themeBtn = document.querySelector('#theme-toggle');

// ===== ELEMENTOS DA CHECKLIST =====
const checklistList = document.querySelector('#checklist-list');
const selectedDayTitle = document.querySelector('#selected-day-title');
const selectedDayTasks = document.querySelector('#selected-day-tasks');

// ===== MENU LATERAL =====
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

// ===== MODAL DO BOOTSTRAP =====
const addTaskModalEl = document.getElementById('addTaskModal');
const modalSelectedDate = document.getElementById('modal-selected-date');
const modalTaskInput = document.getElementById('modal-task-input');
const modalSaveTask = document.getElementById('modal-save-task');
const addTaskModal = new bootstrap.Modal(addTaskModalEl);

// data atual do sistema
const today = new Date();

// controle do calendário
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

// dia selecionado no calendário
let selectedDate = "";

// lista de tarefas
let checklist = JSON.parse(localStorage.getItem('checklist')) || [];

// salva tarefas no localStorage
function saveChecklist() {
    localStorage.setItem('checklist', JSON.stringify(checklist));
}

// cria chave de data tipo: 2026-06-05
function formatDateKey(y, m, d) {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
}

// transforma data em texto bonito
function formatReadableDate(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);

    return new Date(y, m - 1, d).toLocaleDateString(navigator.language, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// limpa texto para evitar HTML estranho
function escapeHTML(text) {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// ===== NAVEGAÇÃO DO MENU =====
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        pages.forEach(page => page.classList.remove('active'));

        const pageId = btn.dataset.page;
        document.getElementById(pageId).classList.add('active');
    });
});

// ===== DIAS DA SEMANA =====
function renderWeekDays() {
    const weekdays = [];
    const firstSunday = new Date(2025, 0, 5);

    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(firstSunday);
        dayDate.setDate(firstSunday.getDate() + i);

        weekdays.push(
            dayDate.toLocaleDateString(navigator.language, {
                weekday: 'short'
            })
        );
    }

    daysContainer.innerHTML = weekdays.map(day => `<li>${day}</li>`).join('');
}

// ===== CALENDÁRIO =====
function renderCalendar() {
    const start = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();

    let datesHtml = "";

    // dias vazios antes do começo do mês
    for (let i = start; i > 0; i--) {
        datesHtml += `<li class="inactive"></li>`;
    }

    // dias do mês atual
    for (let i = 1; i <= endDate; i++) {
        const currentDateKey = formatDateKey(year, month, i);
        const tasksOfDay = checklist.filter(t => t.date === currentDateKey);

        const isToday =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
                ? ' today'
                : '';

        const isSelected = selectedDate === currentDateKey ? ' selected' : '';

        datesHtml += `
            <li class="${isToday.trim()}${isSelected}" data-date="${currentDateKey}">
                <span class="day-number">${i}</span>
                ${tasksOfDay.length ? `<span class="task-count">• ${tasksOfDay.length}</span>` : ''}
            </li>
        `;
    }

    dates.innerHTML = datesHtml;

    header.textContent = new Date(year, month).toLocaleDateString(navigator.language, {
        month: 'long',
        year: 'numeric'
    });
}

// ===== CHECKLIST =====
function renderChecklist() {
    if (!checklist.length) {
        checklistList.innerHTML = `<li class="empty-state">Nenhuma tarefa criada ainda.</li>`;
        return;
    }

    checklistList.innerHTML = checklist.map((task, i) => `
        <li class="checklist-item ${task.done ? 'done' : ''}">
            <div class="checklist-item-left">
                <input type="checkbox" data-index="${i}" ${task.done ? "checked" : ""}>
                <div>
                    <div class="task-text">${escapeHTML(task.text)}</div>
                    <div class="task-meta">${formatReadableDate(task.date)}</div>
                </div>
            </div>

            <button class="delete-task" data-index="${i}" aria-label="Excluir tarefa">×</button>
        </li>
    `).join('');
}

// ===== TAREFAS DO DIA SELECIONADO =====
function renderSelectedDayTasks() {
    if (!selectedDate) {
        selectedDayTitle.textContent = "Tarefas do dia";
        selectedDayTasks.innerHTML = `<li class="empty-state">Clique em um dia do calendário.</li>`;
        return;
    }

    const tasks = checklist.filter(t => t.date === selectedDate);

    selectedDayTitle.textContent = `Tarefas do dia — ${formatReadableDate(selectedDate)}`;

    selectedDayTasks.innerHTML = tasks.length
        ? tasks.map(t => `
            <li class="selected-task ${t.done ? 'done' : ''}">
                <span class="task-text">${escapeHTML(t.text)}</span>
                <span class="task-meta">${t.done ? 'Concluída' : 'Pendente'}</span>
            </li>
        `).join("")
        : `<li class="empty-state">Nenhuma tarefa nesse dia.</li>`;
}

// ===== ABRIR MODAL QUANDO CLICA NO DIA =====
function openTaskModal(dateKey) {
    selectedDate = dateKey;

    modalSelectedDate.textContent = `Dia selecionado: ${formatReadableDate(selectedDate)}`;
    modalTaskInput.value = "";

    addTaskModal.show();
}

// ===== CLIQUE NO CALENDÁRIO =====
dates.addEventListener('click', (e) => {
    const li = e.target.closest('li');

    if (!li || !li.dataset.date) return;

    selectedDate = li.dataset.date;

    renderCalendar();
    renderSelectedDayTasks();

    // abre modal para adicionar a tarefa naquele dia
    openTaskModal(selectedDate);
});

// ===== SALVAR TAREFA PELO MODAL =====
modalSaveTask.addEventListener('click', () => {
    const text = modalTaskInput.value.trim();

    if (!text || !selectedDate) return;

    checklist.push({
        text,
        date: selectedDate,
        done: false
    });

    saveChecklist();

    renderChecklist();
    renderCalendar();
    renderSelectedDayTasks();

    addTaskModal.hide();
});

// ===== CHECKBOX E EXCLUSÃO =====
checklistList.addEventListener('change', (e) => {
    if (!e.target.matches('input[type="checkbox"]')) return;

    const index = Number(e.target.dataset.index);
    checklist[index].done = e.target.checked;

    saveChecklist();

    renderChecklist();
    renderCalendar();
    renderSelectedDayTasks();
});

checklistList.addEventListener('click', (e) => {
    if (!e.target.matches('.delete-task')) return;

    const index = Number(e.target.dataset.index);

    checklist.splice(index, 1);
    saveChecklist();

    renderChecklist();
    renderCalendar();
    renderSelectedDayTasks();
});

// ===== NAVEGAÇÃO ENTRE MESES =====
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

// ===== MODO ESCURO =====
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');

    themeBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ===== INICIALIZAÇÃO =====
selectedDate = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
);

renderWeekDays();
renderCalendar();
renderChecklist();
renderSelectedDayTasks();