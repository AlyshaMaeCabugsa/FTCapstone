const socketIo = require('socket.io');
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const AnnualRecord = require('./models/AnnualRecords');
const InspectionSchedule = require('./models/InspectionSchedule');

const { scheduleNotifications } = require('./services/notificationSocket');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const server = http.createServer();

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Be sure to restrict the origin in production
    methods: ["GET", "POST"]
  }
});

const Establishment = require('./models/Establishment'); // Adjust path if necessary

// This function emits the total count of establishments
const emitEstablishmentCount = async () => {
  try {
    const count = await Establishment.countDocuments();
    io.emit('establishmentCount', count);
  } catch (error) {
    console.error('Error emitting establishment count:', error);
  }
};

io.on('connection', (socket) => {
  console.log('Client connected to Socket.IO.');

  // Setup change streams for real-time updates
  setupAnnualRecordChangeStream(socket);
  setupInspectionScheduleChangeStream(socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.IO.');
  });
});

function setupAnnualRecordChangeStream(socket) {
  const changeStream = AnnualRecord.watch();
  changeStream.on('change', (change) => {
    console.log('Change detected on MongoDB for AnnualRecord:', change);

    // Emit changes to the client
    socket.emit('annualRecordChange', { type: change.operationType, data: change.fullDocument });
  });

  socket.on('disconnect', () => {
    changeStream.close();
  });
}

function setupInspectionScheduleChangeStream(socket) {
  const changeStream = InspectionSchedule.watch();
  changeStream.on('change', (change) => {
    console.log('Change detected on MongoDB for InspectionSchedule:', change);

    // Emit changes to the client
    socket.emit('inspectionScheduleChange', { type: change.operationType, data: change.fullDocument });
  });

  socket.on('disconnect', () => {
    changeStream.close();
  });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});

scheduleNotifications(io);

// Export both io and emitEstablishmentCount at the end of the file
module.exports = { io, emitEstablishmentCount };


