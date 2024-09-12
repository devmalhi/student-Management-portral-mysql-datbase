const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Enter your MySQL password here
    database: 'test'
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files (e.g., HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Route to handle adding student data
app.post('/add-student', (req, res) => {
    const { name, email, age, course } = req.body;

    if (!name || !email || !age || !course) {
        return res.status(400).send('All fields are required.');
    }

    let sql = 'INSERT INTO students (name, email, age, course) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, age, course], (err, results) => {
        if (err) {
            console.error('Error adding student data:', err);
            return res.status(500).send('Error adding student data');
        }
        res.send('Student added successfully');
    });
});

// Route to handle updating student data
app.put('/update-student', (req, res) => {
    const { id, name, email, age, course } = req.body;

    if (!id) {
        return res.status(400).send('Student ID is required.');
    }

    let sql = 'UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?';
    db.query(sql, [name, email, age, course, id], (err, results) => {
        if (err) {
            console.error('Error updating student data:', err);
            return res.status(500).send('Error updating student data');
        }
        res.send('Student updated successfully');
    });
});

// Route to handle removing student data
app.delete('/remove-student', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send('Student ID is required.');
    }

    let sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error removing student data:', err);
            return res.status(500).send('Error removing student data');
        }
        res.send('Student removed successfully');
    });
});

// Route to fetch student data and display in the table
app.get('/data', (req, res) => {
    let sql = 'SELECT * FROM students';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching student data:', err);
            return res.status(500).send('Error fetching student data');
        }
        res.json(results); // Send the student data back to the frontend as JSON
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
