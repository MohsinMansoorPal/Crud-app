const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbFile = 'data.json';

function readData() {
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '[]');
  return JSON.parse(fs.readFileSync(dbFile));
}

function writeData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// GET all
app.get('/students', (req, res) => {
  res.json(readData());
});

// CREATE
app.post('/students', (req, res) => {
  const data = readData();
  const newStudent = { id: Date.now(), ...req.body };
  data.push(newStudent);
  writeData(data);
  res.status(201).json(newStudent);
});

// UPDATE
app.put('/students/:id', (req, res) => {
  let data = readData();
  const id = Number(req.params.id);
  data = data.map(student => student.id === id ? { ...student, ...req.body } : student);
  writeData(data);
  res.json({ message: 'Updated' });
});

// DELETE
app.delete('/students/:id', (req, res) => {
  let data = readData();
  const id = Number(req.params.id);
  data = data.filter(student => student.id !== id);
  writeData(data);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
