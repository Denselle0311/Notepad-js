const writeTitle = document.querySelector('.write-title');
const noteTextField = document.querySelector('.note-textfield');
const saveBtn = document.querySelector('.save');
const notesContainer = document.querySelector('.note-container');
const modal = document.querySelector('.note-modal');

saveBtn.addEventListener('click', writeNote);

function writeNote() {
    const noteAppObj = getNotes();
    const id = generateId();
    const title = writeTitle.textContent || `Untitled-${Object.keys(noteAppObj).length}`;
    const content = noteTextField.textContent;
    const date = new Date().toGMTString();

    noteAppObj[id] = {
        id
        ,title
        ,content
        ,date
    };

    writeTitle.textContent = '';
    noteTextField.textContent = '';

    updateStorage(noteAppObj);
    updateDisplay();
}

function createElement(id,title,content,modal=false) {
    const note = createDiv();
    note.className = 'note';
    note.id = id;

    const spanBtns = createSpan();
    spanBtns.className = 'note-buttons';

    const LocalTitle = createP();
    LocalTitle.className = 'note-title';
    LocalTitle.textContent = title;

    const editbtn = createImg();
    editbtn.className = 'edit button';
    editbtn.src = './images/edit-button.png';

    const deleteBtn = createImg();
    deleteBtn.className = 'delete button';
    deleteBtn.src = './images/delete-button.png';
    
    editbtn.addEventListener('click', () => editNote(note));
    deleteBtn.addEventListener('click', () => deleteNote(note));

    const noteContent = createP();
    noteContent.className = 'note-content';
    noteContent.textContent = content;
    if(noteContent.textContent.length > 160 && !modal ) {
        noteContent.textContent = content.slice(0,187);
        noteContent.innerHTML = `${noteContent.textContent}<span>...</span>`;
    }
    spanBtns.append(LocalTitle,editbtn,deleteBtn);
    note.append(spanBtns,noteContent);

    return note;
}


function createDiv() {
    return document.createElement('div');
}
  
function createSpan() {
    return document.createElement('span');
}

function createImg() {
    return document.createElement('img');
}

function createP() {
    return document.createElement('p');
}


function generateId() {
    return new Date().getTime().toString();
}


function updateStorage(noteObj) {
    localStorage.setItem('notes',JSON.stringify(noteObj));
}


function updateDisplay() {
    const noteAppObj = getNotes();
    const div = new DocumentFragment();
    notesContainer.innerHTML = '';
    if(Object.keys(noteAppObj).length == 0) {
        const ghost = createImg();
        ghost.src = './images/ghost.png';
        ghost.className = 'ghost';
        const t = createDiv();
        t.textContent = 'SOoo Empty...';
        t.className = 't';
        notesContainer.append(ghost,t);
    }

    for(let key in noteAppObj) {
        if(noteAppObj.hasOwnProperty(key)) {
            const noteObj = noteAppObj[key];
            const id = noteObj.id;
            const title = noteObj.title;
            const content = noteObj.content;
            const note = createElement(id,title,content);
            
            div.appendChild(note);
        }
    }
    notesContainer.appendChild(div);
}


function getNotes() {
    let notes =  localStorage.getItem('notes');
    notes = JSON.parse(notes || '{}');
    return notes;
}

function deleteNote(note) {
    const noteAppObj = getNotes();
    delete noteAppObj[note.id];

    const dark = document.querySelector('.active-dark');
    const modal = document.querySelector('.note-modal');

    modal.innerHTML = ``;
    [].forEach.call(document.body.children, e => {
        if(e.className == 'active-dark') {
            console.log('delete')
            document.body.removeChild(dark);
            modal.classList.remove('active');
            document.body.style.overflowY = 'auto';
        }
    });

    updateStorage(noteAppObj);
    updateDisplay()
}

function editNote(note) {
    modal.classList.add('active');
    const noteAppObj = getNotes();
    const id = note.id;
    const noteClone = createElement(id,noteAppObj[id].title,noteAppObj[id].content,true);

    const span = noteClone.children[0];
    span.removeChild(noteClone.children[0].children[1]);

    const title = span.children[0]
    const del = span.children[1];
    const close = createImg();
    close.src = './images/x.png';
    close.classList.add('button')
    close.addEventListener('click' , () => {
        closelBtn(note.id,title,content,noteAppObj);
    })
    span.innerHTML ='';
    span.append(title,close,del)

    const content = noteClone.children[1];

    modal.innerHTML = ``;
    modal.append(span,content);

    title.setAttribute('contenteditable', true);
    content.setAttribute('contenteditable', true);

    const dark = createDiv();
    dark.className = 'active-dark';
    dark.addEventListener('click', () => removeDark(note.id,title,content,noteAppObj));

    document.body.append(dark)
    document.body.style.overflowY = 'hidden';

    dark.style.cssText = `
        display: block;
        position: fixed;
        top: 0px;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background-color: #202124;
        transition: opacity 0.218s ease-in;
        overflow-y: hidden;
    `;
}

function closelBtn(id,title,content,noteAppObj) {
    const dark = document.querySelector('.active-dark');
    const modal = document.querySelector('.note-modal');

    modal.innerHTML = ``;

    document.body.removeChild(dark);
    modal.classList.remove('active');
    document.body.style.overflowY = 'auto';

    noteAppObj[id].title = title.textContent;
    noteAppObj[id].content = content.textContent;

    console.log(noteAppObj[id])
    updateStorage(noteAppObj);
    updateDisplay();
}

function removeDark(id,title,content,noteAppObj) {
    const dark = document.querySelector('.active-dark');
    const modal = document.querySelector('.note-modal');

    modal.innerHTML = ``;

    document.body.removeChild(dark);
    modal.classList.remove('active');
    document.body.style.overflowY = 'auto';

    noteAppObj[id].title = title.textContent;
    noteAppObj[id].content = content.textContent;

    console.log(noteAppObj[id])
    updateStorage(noteAppObj);
    updateDisplay();
}

window.addEventListener('DOMContentLoaded', updateDisplay);