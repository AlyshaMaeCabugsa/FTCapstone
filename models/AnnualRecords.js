// models/AnnualRecords.js

const mongoose = require('mongoose');

const annualRecordSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Establishment',
    required: true
  },
  listType: {
    type: String,
    enum: ['Positive', 'Negative'], // Enum to restrict to positive or negative
    required: true
  },
  // Common fields that are independent of the list type
  inspectionDate: { type: Date, required: true },
  // Fields specific to the Positive list type
  registrationDate: Date, // Only for Positive
  orNumber: String,       // Only for Positive
  certificationAmount: Number, // Only for Positive
  releaseDate: Date,           // Only for Positive
  certificationStatus: String, // Only for Positive
  // Field specific to the Negative list type
  defectsDeficiencies: String,  // Only for Negative
});

// Pre-save hook for conditional validation
annualRecordSchema.pre('save', function(next) {
  if (this.listType === 'Positive') {
    // Ensure negative-specific fields are not set
    this.defectsDeficiencies = undefined;
  } else if (this.listType === 'Negative') {
    // Ensure positive-specific fields are not set
    this.registrationDate = undefined;
    this.orNumber = undefined;
    this.certificationAmount = undefined;
    this.releaseDate = undefined;
    this.certificationStatus = undefined;
  }
  next();
});

const AnnualRecord = mongoose.model('AnnualRecord', annualRecordSchema);

module.exports = AnnualRecord;
