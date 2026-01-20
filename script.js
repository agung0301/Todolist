const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const priority = document.getElementById('priority-level');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const clearButton = document.getElementById('delete-all-btn');
const displayDate = document.getElementById('display-date');

// Menampilkan Waktu secara realtime
function updateWaktu() {
    const sekarang = new Date();

    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = sekarang.toLocaleDateString('en-US', options);

    displayDate.textContent = formattedDate;
}
setInterval(updateWaktu, 1000);

updateWaktu();

// Menambahkan task baru
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = input.value.trim();
    const taskPriority = priority.value;

    const task = createTask(taskText, taskPriority);
    todoList.appendChild(task);
    input.value = '';
    priority.value = '';
});

// Membuat elemen task
function createTask(text, priorityLevel, isDone = false) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm border-start border-4 border-primary';
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = priorityLevel;

    if (priorityLevel === 'High') {
        prioritySpan.className = 'badge bg-danger ms-2';
    } else if (priorityLevel === 'Medium') {
        prioritySpan.className = 'badge bg-warning text-dark ms-2';
    } else if (priorityLevel === 'Low') {
        prioritySpan.className = 'badge bg-success ms-2';
    }
    li.appendChild(prioritySpan);

    if (!isDone) {
        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.className = 'btn btn-success btn-sm ms-2';
        doneButton.addEventListener('click', function() {
            li.remove();
            const taskSelesai = createTask(text, priorityLevel, true);
            doneList.appendChild(taskSelesai);
        });
        li.appendChild(doneButton);
    }
    if (isDone) {
        const undoneButton = document.createElement('button');
        undoneButton.textContent = 'Undone';
        undoneButton.className = 'btn btn-primary btn-sm ms-2';
        undoneButton.addEventListener('click', function() {
            li.remove();
            const taskBack = createTask(text, priorityLevel, false);
            todoList.appendChild(taskBack);
        });
        li.appendChild(undoneButton);
    }
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger';
    deleteButton.addEventListener('click', function() {
        li.remove();
    });
    li.appendChild(deleteButton);

    return li;
}
clearButton.addEventListener('click', function() {
    if (confirm('Hapus semua tugas di kedua kolom?')) {
        todoList.innerHTML = '';
        doneList.innerHTML = '';
    }
});