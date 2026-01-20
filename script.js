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


