// 初始化便签数据
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let isNotesVisible = localStorage.getItem('notesVisible') !== 'false';

// DOM 元素
const notesContainer = document.querySelector('.notes-container');
const addNoteBtn = document.querySelector('.add-note-btn');
const notesList = document.querySelector('.notes-list');
const notesBtn = document.querySelector('.notes-btn');

// 切换便签显示/隐藏
notesBtn.addEventListener('click', () => {
    notesContainer.classList.toggle('visible');
    isNotesVisible = notesContainer.classList.contains('visible');
    localStorage.setItem('notesVisible', isNotesVisible);
});

// 初始化便签显示状态
if (isNotesVisible) {
    notesContainer.classList.add('visible');
}

// 添加新便签
function addNote() {
    const note = {
        id: Date.now(),
        content: '',
        completed: false
    };
    notes.unshift(note);
    saveNotes();
    renderNotes();
    const newNoteElement = notesList.firstElementChild;
    if (newNoteElement) {
        const noteInput = newNoteElement.querySelector('.note-content');
        noteInput.focus();
    }
}

// 删除便签
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// 切换便签完成状态
function toggleNoteComplete(id) {
    const note = notes.find(note => note.id === id);
    if (note) {
        note.completed = !note.completed;
        saveNotes();
        renderNotes();
    }
}

// 更新便签内容
function updateNoteContent(id, content) {
    const note = notes.find(note => note.id === id);
    if (note) {
        note.content = content;
        saveNotes();
    }
}

// 保存便签到本地存储
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// 渲染便签列表
function renderNotes() {
    notesList.innerHTML = notes.map(note => `
        <div class="note-item ${note.completed ? 'completed' : ''}" data-id="${note.id}">
            <input type="checkbox" class="note-checkbox" ${note.completed ? 'checked' : ''}>
            <textarea class="note-content" placeholder="输入待办事项...">${note.content}</textarea>
            <button class="delete-note-btn">×</button>
        </div>
    `).join('');

    // 添加事件监听器
    notesList.querySelectorAll('.note-item').forEach(noteElement => {
        const id = parseInt(noteElement.dataset.id);
        const checkbox = noteElement.querySelector('.note-checkbox');
        const content = noteElement.querySelector('.note-content');
        const deleteBtn = noteElement.querySelector('.delete-note-btn');

        checkbox.addEventListener('change', () => toggleNoteComplete(id));
        content.addEventListener('input', (e) => updateNoteContent(id, e.target.value));
        deleteBtn.addEventListener('click', () => deleteNote(id));
    });
}

// 初始化事件监听器
addNoteBtn.addEventListener('click', addNote);

// 初始渲染
renderNotes();