import React, { useState, /*useEffect */} from 'react';
import { useDispatch } from 'react-redux';
import { updateEvent } from '../../features/eventSlice';
import { DISPLAY_TIMEZONES, IANA_TIMEZONES } from '../utils/timezoneHelper';
import ProfileSelect from '../Shared/ProfileSelect';
import Modal from '../Shared/Modal';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
const getDisplayTimezone = (ianaName) => {
  return Object.keys(IANA_TIMEZONES).find(key => IANA_TIMEZONES[key] === ianaName) 
         || DISPLAY_TIMEZONES[0];
};

const EditEventModal = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const displayTimezone = getDisplayTimezone(event.timezone);
  const localStartDate = dayjs(event.startTimeUTC).tz(event.timezone).format('YYYY-MM-DD');
  const localStartTime = dayjs(event.startTimeUTC).tz(event.timezone).format('HH:mm');
  const localEndDate = dayjs(event.endTimeUTC).tz(event.timezone).format('YYYY-MM-DD');
  const localEndTime = dayjs(event.endTimeUTC).tz(event.timezone).format('HH:mm');

  const [selectedProfiles, setSelectedProfiles] = useState(event.profiles.map(p => p._id));
  const [timezone, setTimezone] = useState(displayTimezone);
  const [startDate, setStartDate] = useState(localStartDate);
  const [startTime, setStartTime] = useState(localStartTime);
  const [endDate, setEndDate] = useState(localEndDate);
  const [endTime, setEndTime] = useState(localEndTime);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
     if (selectedProfiles.length === 0) {
      setError('Please select at least one profile.');
      return;
    }
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time.');
      return;
    }
    
    setError('');

    dispatch(updateEvent({
      id: event._id,
      profiles: selectedProfiles,
      timezone,
      startDate,
      startTime,
      endDate,
      endTime
    }));
    
    onClose();
  };

  return (
    <Modal title="Edit Event" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profiles</label>
          <ProfileSelect 
            selectedProfileIds={selectedProfiles}
            onChange={setSelectedProfiles}
          />
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {DISPLAY_TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Start Date & Time</label>
          <div className="date-time-group">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label>End Date & Time</label>
          <div className="date-time-group">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        
        {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Event
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;