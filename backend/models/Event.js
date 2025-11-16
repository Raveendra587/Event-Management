import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  }],
  timezone: {
    type: String,
    required: true,
  },
  startTimeUTC: {
    type: Date,
    required: true,
  },
  endTimeUTC: {
    type: Date,
    required: true,
  },
  createdAtUTC: {
    type: Date,
    default: Date.now,
  },
  updatedAtUTC: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;