// controllers/annualRecordController.js

const AnnualRecord = require('../models/AnnualRecords');

// Create a new record for a given year
const createRecord = async (req, res) => {
  try {
    const newRecord = new AnnualRecord(req.body); // Assumes that all required fields are provided in the body
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: "Error creating record: " + error.message });
  }
};

// Retrieve all records for a specific year
const getRecordsByYear = async (req, res) => {
  const { year } = req.params;
  try {
    const records = await AnnualRecord.find({ year });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records: " + error.message });
  }
};

// Update a specific record's details for the new year
const duplicateAndUpdateRecordForNewYear = async (req, res) => {
  const { previousYear, newYear, uniqueNumber, updates } = req.body;

  try {
    const oldRecord = await AnnualRecord.findOne({ year: previousYear, uniqueNumber });
    if (!oldRecord) {
      return res.status(404).json({ message: "Previous year's record not found" });
    }

    const newRecordData = {
      ...oldRecord.toObject(),
      year: newYear,
      ...updates // Apply any updates provided in the body
    };

    // Remove the _id from old record to ensure mongoose creates a new document
    delete newRecordData._id; 

    // If the old record is not supposed to carry forward some fields to the new year, explicitly delete them here
    // For example: delete newRecordData.fieldName;

    const newRecord = new AnnualRecord(newRecordData);
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: "Error updating record for new year: " + error.message });
  }
};

// Delete a record
const deleteRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await AnnualRecord.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: "Error deleting record: " + error.message });
  }
};

module.exports = {
  createRecord,
  getRecordsByYear,
  duplicateAndUpdateRecordForNewYear,
  deleteRecord
};

