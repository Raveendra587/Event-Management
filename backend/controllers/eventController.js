import Event from '../models/Event.js';
import EventLog from '../models/EventLog.js';
import Profile from '../models/Profile.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const convertToUTC = (date, time, tz) => {
  const dateTimeString = `${date}T${time}`;
  return dayjs.tz(dateTimeString, tz).utc().toDate();
};

export const createEvent = async (req, res) => {
  const { profiles, timezone, startDate, startTime, endDate, endTime } = req.body;

  try {
    if (!profiles || !timezone || !startDate || !startTime || !endDate || !endTime) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const startTimeUTC = convertToUTC(startDate, startTime, timezone);
    const endTimeUTC = convertToUTC(endDate, endTime, timezone);

    if (dayjs(endTimeUTC).isBefore(dayjs(startTimeUTC))) {
      return res.status(400).json({ message: 'End date/time must be after start date/time' });
    }

    const event = await Event.create({
      profiles,
      timezone,
      startTimeUTC,
      endTimeUTC,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEvents = async (req, res) => {
  const { profileId } = req.query;
  if (!profileId) {
    return res.status(400).json({ message: 'Profile ID is required' });
  }

  try {
    const events = await Event.find({ profiles: profileId })
      .populate('profiles', 'name')
      .sort({ startTimeUTC: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { profiles, timezone, startDate, startTime, endDate, endTime } = req.body;

  try {
    const event = await Event.findById(id).populate('profiles');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const logsToCreate = [];
    const oldProfileNames = event.profiles.map(p => p.name).sort().join(', ');
    const newStartTimeUTC = convertToUTC(startDate, startTime, timezone);
    const newEndTimeUTC = convertToUTC(endDate, endTime, timezone);
    const newProfiles = await Profile.find({ _id: { $in: profiles } });
    const newProfileNames = newProfiles.map(p => p.name).sort().join(', ');
    if (oldProfileNames !== newProfileNames) {
      logsToCreate.push({
        eventId: id,
        changeDescription: `Profiles changed to: ${newProfileNames || 'None'}`,
      });
    }
    if (event.timezone !== timezone) {
      logsToCreate.push({
        eventId: id,
        changeDescription: `Timezone changed to: ${timezone}`,
      });
    }
    if (event.startTimeUTC.getTime() !== newStartTimeUTC.getTime()) {
      logsToCreate.push({
        eventId: id,
        changeDescription: 'Start date/time updated',
      });
    }
    if (event.endTimeUTC.getTime() !== newEndTimeUTC.getTime()) {
      logsToCreate.push({
        eventId: id,
        changeDescription: 'End date/time updated',
      });
    }
    if (logsToCreate.length > 0) {
      await EventLog.insertMany(logsToCreate);
    }
    event.profiles = profiles;
    event.timezone = timezone;
    event.startTimeUTC = newStartTimeUTC;
    event.endTimeUTC = newEndTimeUTC;
    event.updatedAtUTC = Date.now();
    
    const updatedEvent = await event.save();
    await updatedEvent.populate('profiles', 'name');

    res.json(updatedEvent);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEventLogs = async (req, res) => {
  try {
    const logs = await EventLog.find({ eventId: req.params.id })
      .sort({ updatedAtUTC: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};