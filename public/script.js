const form = document.getElementById('studentForm');
const list = document.getElementById('studentList');

const loadStudents = async () => {
  const res = await fetch('/students');
  const students = await res.json();
  list.innerHTML = '';
  students.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `
      Name: ${s.name}, Roll No: ${s.roll}, Class: ${s.class}
      <button onclick="editStudent(${s.id}, '${s.name}', '${s.roll}', '${s.class}')">Edit</button>
      <button onclick="deleteStudent(${s.id})">Delete</button>
    `;
    list.appendChild(li);
  });
};

form.onsubmit = async (e) => {
  e.preventDefault();
  const student = {
    name: form.name.value,
    roll: form.roll.value,
    class: form.class.value
  };
  await fetch('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  form.reset();
  loadStudents();
};

async function deleteStudent(id) {
  await fetch(`/students/${id}`, { method: 'DELETE' });
  loadStudents();
}

function editStudent(id, name, roll, studentClass) {
  const newName = prompt('Edit name:', name);
  const newRoll = prompt('Edit roll no:', roll);
  const newClass = prompt('Edit class:', studentClass);
  if (newName && newRoll && newClass) {
    fetch(`/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, roll: newRoll, class: newClass })
    }).then(loadStudents);
  }
}

loadStudents();
