import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent } from '../features/eventSlice';
import { DISPLAY_TIMEZONES } from './utils/timezoneHelper';
import ProfileSelect from './Shared/ProfileSelect';
import { FaPlus } from 'react-icons/fa';

// Helper function to get today's date in 'YYYY-MM-DD' format
const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
};

const CreateEventForm = () => {
  const dispatch = useDispatch();

  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState(DISPLAY_TIMEZONES[0]);
  
  // State variables for date/time are maintained as strings
  const [startDate, setStartDate] = useState(''); 
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');

  // Define the minimum allowed date for the 'min' attribute
  const minDateString = getTodayDateString();

  const resetForm = () => {
    setSelectedProfiles([]);
    setTimezone(DISPLAY_TIMEZONES[0]);
    setStartDate('');
    setStartTime('09:00');
    setEndDate('');
    setEndTime('10:00');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile.');
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      setError('Please fill all date and time fields.');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time.');
      return;
    }

    setError('');
    
    dispatch(createEvent({
      profiles: selectedProfiles,
      timezone,
      startDate,
      startTime,
      endDate,
      endTime
    }));
    
    resetForm();
  };

  return (
    <>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem 0' }}>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profiles</label>
          <ProfileSelect 
            selectedProfileIds={selectedProfiles}
            onChange={setSelectedProfiles}
          />
        </div>
        
        {/* Using CustomSelect for Timezone */}
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
            {/* FIX: Added min attribute to block past dates */}
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              min={minDateString} 
            />
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        
        <div className="form-group">
          <label>End Date & Time</label>
          <div className="date-time-group">
            {/* FIX: Added min attribute to block past dates */}
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              min={minDateString} 
            />
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>
        
        {error && <p style={{ color: 'var(--danger-color)' }}>{error}</p>}

        <button type="submit" className="btn btn-primary">
          <FaPlus /> Create Event
        </button>
      </form>
    </>
  );
};

export default CreateEventForm;