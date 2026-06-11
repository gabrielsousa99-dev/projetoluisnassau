//==============================
// ELEMENTOS DO CALENDÁRIO
//==============================

const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const daysContainer = document.querySelector(".days");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

//==============================
// MENU
//==============================

const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

//==============================
// TEMA
//==============================

const themeBtn = document.getElementById("theme-toggle");

//==============================
// PAINEL DE TAREFAS
//==============================

const selectedDateText =
document.getElementById("selected-date");

const taskList =
document.getElementById("task-list");

const difficultyFilter =
document.getElementById("difficulty-filter");

const addButton =
document.getElementById("add-task");

const editButton =
document.getElementById("edit-task");

const deleteButton =
document.getElementById("delete-task");

const moveButton =
document.getElementById("move-task");

//==============================
// MODAL
//==============================

const taskModal =
new bootstrap.Modal(
document.getElementById("taskModal")
);

const titleInput =
document.getElementById("task-title");

const descriptionInput =
document.getElementById("task-description");

const difficultyInput =
document.getElementById("task-difficulty");

const saveButton =
document.getElementById("save-task");

//==============================
// DATA
//==============================

const today = new Date();

let month = today.getMonth();
let year = today.getFullYear();

let selectedDate = null;

let editingTask = null;

//==============================
// LOCAL STORAGE
//==============================

let tasks =
JSON.parse(
localStorage.getItem("tasks")
) || [];

function saveTasks(){

localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);

}

//==============================
// FORMATAR DATA
//==============================

function formatDateKey(y,m,d){

return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

}

//==============================
// MENU
//==============================

navButtons.forEach(button=>{

button.addEventListener("click",()=>{

navButtons.forEach(b=>b.classList.remove("active"));

pages.forEach(p=>p.classList.remove("active"));

button.classList.add("active");

document
.getElementById(button.dataset.page)
.classList.add("active");

});

});

//==============================
// DIAS DA SEMANA
//==============================

function renderWeekDays(){

const names=[
"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sab"
];

daysContainer.innerHTML="";

names.forEach(day=>{

daysContainer.innerHTML+=`<li>${day}</li>`;

});

}

//==============================
// CALENDÁRIO
//==============================

function renderCalendar(){

header.textContent=

new Date(
year,
month
).toLocaleDateString(

"pt-BR",

{

month:"long",
year:"numeric"

}

);

const firstDay=

new Date(
year,
month,
1
).getDay();

const lastDay=

new Date(
year,
month+1,
0
).getDate();

dates.innerHTML="";

for(let i=0;i<firstDay;i++){

dates.innerHTML+=`<li></li>`;

}

for(let day=1;day<=lastDay;day++){

const key=

formatDateKey(
year,
month,
day
);

const total=

tasks.filter(
t=>t.date===key
).length;

dates.innerHTML+=`

<li
data-date="${key}"
>

<div>

${day}

</div>

${
total>0
?

`<small>${total} tarefa(s)</small>`

:

""

}

</li>

`;

}

}

//==============================
// MOSTRAR TAREFAS DO DIA
//==============================

function renderTasks(){

taskList.innerHTML="";

if(!selectedDate){

taskList.innerHTML=
"<li>Selecione um dia.</li>";

return;

}

let filtered=

tasks.filter(

t=>t.date===selectedDate

);

if(difficultyFilter.value!="all"){

filtered=

filtered.filter(

t=>t.difficulty===difficultyFilter.value

);

}

if(filtered.length==0){

taskList.innerHTML=
"<li>Nenhuma tarefa.</li>";

return;

}

filtered.forEach(task=>{

taskList.innerHTML+=`

<li>

<strong>

${task.title}

</strong>

<br>

${task.description}

<br>

${task.difficulty}

</li>

`;

});

}

//==============================
// CLICAR NO DIA
//==============================

dates.addEventListener("click",e=>{

const li=e.target.closest("li");

if(!li.dataset.date)return;

selectedDate=

li.dataset.date;

selectedDateText.textContent=

selectedDate;

renderTasks();

});

//==============================
// ADICIONAR
//==============================

addButton.addEventListener("click",()=>{

editingTask=null;

titleInput.value="";
descriptionInput.value="";

taskModal.show();

});

//==============================
// SALVAR
//==============================

saveButton.addEventListener("click",()=>{

if(!selectedDate)return;

const task={

id:Date.now(),

title:titleInput.value,

description:descriptionInput.value,

difficulty:difficultyInput.value,

date:selectedDate

};

tasks.push(task);

saveTasks();

renderCalendar();

renderTasks();

taskModal.hide();

});

//==============================
// FILTRO
//==============================

difficultyFilter.addEventListener(

"change",

renderTasks

);

//==============================
// MUDAR MÊS
//==============================

prevBtn.onclick=()=>{

month--;

if(month<0){

month=11;

year--;

}

renderCalendar();

};

nextBtn.onclick=()=>{

month++;

if(month>11){

month=0;

year++;

}

renderCalendar();

};

//==============================
// TEMA
//==============================

const savedTheme=

localStorage.getItem("theme");

if(savedTheme==="dark"){

document.body.classList.add(
"dark-mode"
);

}

themeBtn.onclick=()=>{

document.body.classList.toggle(
"dark-mode"
);

localStorage.setItem(

"theme",

document.body.classList.contains(
"dark-mode"
)

?

"dark"

:

"light"

);

};

//==============================
// INICIALIZAÇÃO
//==============================

renderWeekDays();

renderCalendar();

renderTasks();