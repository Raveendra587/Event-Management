import React from 'react';
import { useSelector } from 'react-redux';
import { formatInTimeZone } from './utils/timezoneHelper';
import { FaUserFriends, FaRegClock, FaRegCalendarAlt, FaEdit, FaListAlt } from 'react-icons/fa';

const EventItem = ({ event, onEdit, onViewLogs }) => {
  const { viewTimezone } = useSelector((state) => state.events);

  const profileNames = event.profiles.map(p => p.name).join(', ');
  
  // Format all dates/times in the user's selected VIEW timezone
  const startDate = formatInTimeZone(event.startTimeUTC, viewTimezone, 'MMM D, YYYY');
  const startTime = formatInTimeZone(event.startTimeUTC, viewTimezone, 'hh:mm A');
  const endDate = formatInTimeZone(event.endTimeUTC, viewTimezone, 'MMM D, YYYY');
  const endTime = formatInTimeZone(event.endTimeUTC, viewTimezone, 'hh:mm A');

  const createdAt = formatInTimeZone(event.createdAtUTC, viewTimezone, 'MMM D, YYYY [at] hh:mm A');
  const updatedAt = formatInTimeZone(event.updatedAtUTC, viewTimezone, 'MMM D, YYYY [at] hh:mm A');

  return (
    <div className="event-item">
      <div className="event-item-header">
        <FaUserFriends /> <span>{profileNames}</span>
      </div>
      <div className="event-item-details">
        <FaRegCalendarAlt />
        <div>
          <strong>Start:</strong> {startDate}
        </div>
        <FaRegClock />
        <div>{startTime}</div>
        
        <FaRegCalendarAlt />
        <div>
          <strong>End:</strong> {endDate}
        </div>
        <FaRegClock />
        <div>{endTime}</div>
      </div>
      
      <div className="event-item-timestamps">
        <div>Created: {createdAt}</div>
        <div>Updated: {updatedAt}</div>
      </div>
      
      <div className="event-item-actions">
        <button className="btn btn-secondary" onClick={onEdit}>
          <FaEdit /> Edit
        </button>
        <button className="btn btn-secondary" onClick={onViewLogs}>
          <FaListAlt /> View Logs
        </button>
      </div>
    </div>
  );
};

export default EventItem;