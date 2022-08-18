const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all employees and their department affiliation
router.get('/employee', (req, res) => {
  const sql = `SELECT employee.*, department. 
                AS first_name 
                FROM employee 
                LEFT JOIN department 
                ON employee_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Get single employee with department affiliation
router.get('employee/:id', (req, res) => {
  const sql = `SELECT employee.*, department. 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON employee_id = department.id 
               WHERE employee.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// Create an employee
router.post('/employee', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO employee (first_name, last_name,, title, department, salary, manager) VALUES (?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.title,
    body.department,
    body.salary,
    body.manager
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Update an employee's department
router.put('/employee/:id', (req, res) => {
  const errors = inputCheck(req.body, 'department_id');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `UPDATE employee SET department_id = ? 
               WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Delete an employee
router.delete('/candidate/:id', (req, res) => {});

router.post('/seed', (req, res) => {
  employee.bulkCreate([
  ]).then(() => {
    res.send('Seeding Success!');
  });
});

module.exports = router;