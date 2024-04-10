const InspectionSchedule = require('../models/InspectionSchedule');
const Establishment = require('../models/Establishment');
const io = require('../websocketServer'); // Adjust the path to your websocketServer.js file

exports.create_inspection_schedule = async (req, res) => {
  try {
    const { establishmentId, date, time } = req.body;

    // Check if the establishment exists
    const establishment = await Establishment.findById(establishmentId);
    if (!establishment) {
      return res.status(404).send({ message: 'Establishment not found.' });
    }

    // Prevent duplicate inspection schedules for the same establishment, date, and time
    const existingSchedule = await InspectionSchedule.findOne({
      establishment: establishmentId,
      date: date,
      time: time,
    });

    if (existingSchedule) {
      return res.status(400).send({ message: 'An inspection schedule for this establishment, date, and time already exists.' });
    }

    const inspectionSchedule = new InspectionSchedule({
      establishment: establishment._id,
      date: date,
      time: time,
      inspector: req.body.inspector,
      status: req.body.status,
      notes: req.body.notes,
    });

    await inspectionSchedule.save();

    // Emit an event for the new inspection
    io.emit('inspectionCreated', inspectionSchedule);

    // Notify admin of successful creation
    const successMessage = `You have scheduled successfully on ${inspectionSchedule.date}`;
    io.emit('notifyAdmin', { message: successMessage });

    // Send the response
    res.status(201).send(inspectionSchedule);
  } catch (error) {
    console.error("Error creating inspection schedule:", error);
    // Enhanced error handling for duplicate key errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).send({ message: 'A duplicate key error occurred. Please ensure unique values for all fields.' });
    }
    res.status(500).send({ message: error.message || 'An error occurred during creation.' });
  }
};

exports.get_all_inspection_schedules = async (req, res, next) => {
  const { status } = req.query;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    let filters = {};
    // Check if status is exactly 'Scheduled' or 'Completed'
    if (status === 'Scheduled' || status === 'Completed') {
      filters.status = status;

      if (status === 'Completed') {
        // Make sure to compare dates only, without time
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        filters.date = { $gte: thirtyDaysAgo };
      }
    } else {
      // Handle case with no status or status is not 'Scheduled'/'Completed'
      filters.$or = [
        { status: { $ne: 'Completed' } },
        { 
          status: 'Completed',
          date: { $gte: thirtyDaysAgo }
        }
      ];
    }

    console.log(`Filters applied: ${JSON.stringify(filters)}`); // Add for debugging

    const schedules = await InspectionSchedule.find(filters).populate('establishment', 'tradeName address');
    res.status(200).send(schedules);
  } catch (error) {
    console.error('Error getting inspection schedules:', error);
    res.status(500).send({ message: error.message });
  }
};



exports.get_inspection_schedule = async (req, res, next) => {
  try {
    const schedule = await InspectionSchedule.findById(req.params.id).populate('establishment', 'tradeName address');
    if (!schedule) {
      return res.status(404).send({ message: 'Inspection Schedule not found.' });
    }
    res.status(200).send(schedule);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update_inspection_schedule = async (req, res) => {
  try {
    const schedule = await InspectionSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('establishment', 'tradeName address');

    if (!schedule) {
      return res.status(404).send({ message: 'Inspection Schedule not found.' });
    }

    // If the status is 'Completed', notify the admin
    if(req.body.status === 'Completed') {
      const completionMessage = `The inspection for ${schedule.establishment.tradeName} is completed`;
      io.emit('notifyAdmin', { message: completionMessage });
    }

    res.status(200).send(schedule);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.delete_inspection_schedule = async (req, res, next) => {
  try {
    await InspectionSchedule.findByIdAndRemove(req.params.id);
    
    io.emit('inspectionDeleted', { id: req.params.id });

    res.status(200).send({ message: 'Inspection Schedule deleted successfully.' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.sendDailyInspectionReminders = async () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedules = await InspectionSchedule.find({
    date: { $eq: tomorrow.toISOString().split('T')[0] }
  }).populate('establishment');

  schedules.forEach(schedule => {
    const reminderMessage = `You have an inspection schedule tomorrow on ${schedule.date} at ${schedule.time} for ${schedule.establishment.tradeName}`;
    io.emit('notifyAdmin', { message: reminderMessage });
  });
};