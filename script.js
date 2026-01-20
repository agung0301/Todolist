// Menangkap semua elemen dari HTML
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const priority = document.getElementById('priority-level');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const clearButton = document.getElementById('delete-all-btn');
const displayDate = document.getElementById('display-date');
const deadlineDate = document.getElementById('todo-date');

// Menampilkan Waktu Utama secara realtime 
function updateWaktu() {
    const sekarang = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = sekarang.toLocaleDateString('en-US', options);
    displayDate.textContent = formattedDate;
}
setInterval(updateWaktu, 1000);
updateWaktu();

// Menambahkan task baru saat Form di-submit
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const taskText = input.value.trim();
    const taskPriority = priority.value;
    const taskDeadline = deadlineDate.value; 

    // Membuat stempel waktu buat saat klik tombol Add
    const sekarang = new Date();
    const waktuBuat = sekarang.toLocaleString('en-US', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });

    const task = createTask(taskText, taskPriority, false, taskDeadline, waktuBuat);
    todoList.appendChild(task);
    
    input.value = '';
    priority.value = '';
    deadlineDate.value = '';
});

// membuat elemen Task
function createTask(text, priorityLevel, isDone = false, deadline = "", createdAt = "") {
    const li = document.createElement('li');

    let isOverdue = false;
    if (deadline && !isDone) {
        const tglDeadline = new Date(deadline);
        const tglSekarang = new Date();
        tglSekarang.setHours(0, 0, 0, 0);
        
        if (tglDeadline < tglSekarang) {
            isOverdue = true;
        }
    }
    
    // penentuan warna border berdasarkan prioritas
    let borderColor = 'border-primary';
    if (priorityLevel === 'High') borderColor = 'border-danger';
    else if (priorityLevel === 'Medium') borderColor = 'border-warning';
    else if (priorityLevel === 'Low') borderColor = 'border-success';

    li.className = `list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border-start border-4 ${borderColor}`;

    // background merah jika deadline sudah lewat
    if (isOverdue) {
        li.style.backgroundColor = '#ffe9e9'; 
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'flex-grow-1';

    const span = document.createElement('span');
    span.className = 'fw-bold d-block';
    span.innerHTML = text + (isOverdue ? ' <span class="text-danger" style="font-size: 0.8rem;">(TERLAMBAT)</span>' : '');
    if (isDone) span.style.textDecoration = 'line-through';

    const infoWaktu = document.createElement('small');
    infoWaktu.className = 'text-muted d-block';
    infoWaktu.style.fontSize = '0.75rem';
    
    const deadlineTxt = deadline ? ` | Deadline: ${deadline}` : " | No Deadline";
    infoWaktu.textContent = `Dibuat: ${createdAt}${deadlineTxt}`;

    contentWrapper.appendChild(span);
    contentWrapper.appendChild(infoWaktu);
    li.appendChild(contentWrapper);

    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = priorityLevel;
    if (priorityLevel === 'High') prioritySpan.className = 'badge bg-danger ms-2';
    else if (priorityLevel === 'Medium') prioritySpan.className = 'badge bg-warning text-dark ms-2';
    else if (priorityLevel === 'Low') prioritySpan.className = 'badge bg-success ms-2';
    li.appendChild(prioritySpan);

    if (!isDone) {
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.className = 'btn btn-success btn-sm ms-2';
        doneButton.addEventListener('click', function() {
            li.remove();
            const taskSelesai = createTask(text, priorityLevel, true, deadline, createdAt);
            doneList.appendChild(taskSelesai);
        });
        li.appendChild(doneButton);
    } else {
        const undoneButton = document.createElement('button');
        undoneButton.textContent = 'Undone';
        undoneButton.className = 'btn btn-primary btn-sm ms-2';
        undoneButton.addEventListener('click', function() {
            li.remove();
            const taskBack = createTask(text, priorityLevel, false, deadline, createdAt);
            todoList.appendChild(taskBack);
        });
        li.appendChild(undoneButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm ms-2';
    deleteButton.onclick = () => li.remove();
    li.appendChild(deleteButton);

    return li;
}

// Fitur Delete All
clearButton.addEventListener('click', function() {
    if (confirm('Hapus semua tugas di kedua kolom?')) {
        todoList.innerHTML = '';
        doneList.innerHTML = '';
    }
});