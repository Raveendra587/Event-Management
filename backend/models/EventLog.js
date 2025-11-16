import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  changeDescription: {
    type: String,
    required: true,
  },
  updatedAtUTC: {
    type: Date,
    default: Date.now,
  },
});

const EventLog = mongoose.model('EventLog', eventLogSchema);
export default EventLog;