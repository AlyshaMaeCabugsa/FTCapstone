// routes/annualRecordRoutes.js

const express = require('express');
const router = express.Router();
const annualRecordController = require('../controller/annualRecordController');

// Route for creating a new annual record
router.post('/', annualRecordController.createRecord);

// Route for getting all annual records for a specific year
router.get('/:year', annualRecordController.getRecordsByYear);

// Route for duplicating and updating an annual record for the new year
router.post('/duplicateAndUpdate', annualRecordController.duplicateAndUpdateRecordForNewYear);

// Route for deleting an annual record by ID
router.delete('/:id', annualRecordController.deleteRecord);

module.exports = router; 
