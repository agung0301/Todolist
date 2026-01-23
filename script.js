// Menangkap semua elemen dari HTML
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const priority = document.getElementById('priority-level');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
const clearButton = document.getElementById('delete-all-btn');
const displayDate = document.getElementById('display-date');
const deadlineDate = document.getElementById('todo-date');
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search-icon');
const loadingSpinner = document.getElementById('loading-spinner');
const searchButton = document.getElementById('search-button');
const soundDone = document.getElementById('sound-pop');
const soundUndone = document.getElementById('sound-undo');
const soundDelete = document.getElementById('sound-swoosh');
const todoCount = document.getElementById('todo-count');
const doneCount = document.getElementById('done-count');
const overdueCount = document.getElementById('overdue-count');

// Menampilkan Waktu Utama secara realtime 
function updateWaktu() {
    const sekarang = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = sekarang.toLocaleDateString('en-US', options);
    displayDate.textContent = formattedDate;
}
setInterval(updateWaktu, 1000);
updateWaktu();

// Menghitung jumlah task dan task selesai
function updateCounters() {
    const totalTodo = todoList.children.length;
    const totalDone = doneList.children.length;

    let totalOverdue = 0;
    const allTodoItems = todoList.querySelectorAll('li');
    allTodoItems.forEach(item => {
        if (item.innerHTML.includes('OVERDUE')) {
            totalOverdue++;
        }
    });

    todoCount.textContent = totalTodo;
    doneCount.textContent = totalDone;
    overdueCount.textContent = totalOverdue;
}

// Menambahkan task baru saat Form di-submit
form.addEventListener('submit', function (event) {
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

    updateCounters();
    saveToLocalStorage();

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
    span.innerHTML = text + (isOverdue ? ' <span class="badge rounded-pill bg-danger-subtle text-danger ms-2" style="font-size: 0.6rem;">OVERDUE</span>' : '');
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
        doneButton.addEventListener('click', function () {
            soundDone.currentTime = 0;
            soundDone.play();

            li.remove();
            const taskSelesai = createTask(text, priorityLevel, true, deadline, createdAt);
            doneList.appendChild(taskSelesai);

            updateCounters();
            saveToLocalStorage();
        });
        li.appendChild(doneButton);
    } else {
        const undoneButton = document.createElement('button');
        undoneButton.textContent = 'Undone';
        undoneButton.className = 'btn btn-primary btn-sm ms-2';
        undoneButton.addEventListener('click', function () {
            soundUndone.currentTime = 0;
            soundUndone.play();

            li.remove();
            const taskBack = createTask(text, priorityLevel, false, deadline, createdAt);
            todoList.appendChild(taskBack);

            updateCounters();
            saveToLocalStorage();
        });
        li.appendChild(undoneButton);

    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm ms-2';

    deleteButton.onclick = () => {
        Swal.fire({
            title: "Hapus tugas ini?",
            text: "Tugas yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then((result) => {

            if (result.isConfirmed) {
                soundDelete.currentTime = 0;
                soundDelete.play();
                li.remove();

                updateCounters();
                saveToLocalStorage();

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Tugas berhasil dihapus'
                });
            }
        });
    };

    li.appendChild(deleteButton);
    return li;
}

// Fitur Delete All
clearButton.addEventListener('click', function () {
    Swal.fire({
        title: 'Hapus Semua Tugas?',
        text: "Tindakan ini tidak bisa dibatalkan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus semua!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            soundDelete.currentTime = 0;
            soundDelete.play();
            todoList.innerHTML = '';
            doneList.innerHTML = '';

            updateCounters();
            saveToLocalStorage();

            Swal.fire(
                'Berhasil!',
                'Semua tugas telah dibersihkan.',
                'success'
            );
        }
    });
});
// Fitur Pencarian

let debounceTimer;
function filterTasks() {
    clearTimeout(debounceTimer);

    searchIcon.classList.add('d-none');
    loadingSpinner.classList.remove('d-none');

    debounceTimer = setTimeout(() => {
        const filter = searchInput.value.toLowerCase();
        const allTasks = document.querySelectorAll('.list-group-item');

        allTasks.forEach(task => {
            const taskText = task.querySelector('span').textContent.toLowerCase();

            if (taskText.includes(filter)) {
                task.style.setProperty('display', 'flex', 'important');
            } else {
                task.style.setProperty('display', 'none', 'important');
            }
        });

        searchIcon.classList.remove('d-none');
        loadingSpinner.classList.add('d-none');

    }, 500);
}


searchInput.addEventListener('input', filterTasks);
searchButton.addEventListener('click', filterTasks);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        filterTasks();
    }
});

function saveToLocalStorage() {
    const tasks = [];

    document.querySelectorAll('.list-group-item').forEach(li => {
        tasks.push({
            text: li.querySelector('span').innerText.replace(' OVERDUE', '').trim(),
            priority: li.querySelector('.badge:not(.bg-danger-subtle)').textContent,
            isDone: li.parentElement.id === 'done-list',
            deadline: li.querySelector('small').textContent.split('Deadline: ')[1] || "",
            createdAt: li.querySelector('small').textContent.split('|')[0].replace('Dibuat: ', '').trim()
        });
    });

    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('myTasks')) || [];

    savedTasks.forEach(task => {
        const taskElement = createTask(task.text, task.priority, task.isDone, task.deadline, task.createdAt);
        if (task.isDone) {
            doneList.appendChild(taskElement);
        } else {
            todoList.appendChild(taskElement);
        }
    });

    updateCounters();
}

loadFromLocalStorage();