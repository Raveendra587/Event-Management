import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setViewTimezone, fetchEvents } from '../features/eventSlice';
import EventItem from './EventItem';
import EditEventModal from './Modals/EditEventModal';
import ViewLogsModal from './Modals/ViewLogsModal';
import { DISPLAY_TIMEZONES } from './utils/timezoneHelper';


const EventList = () => {
  const dispatch = useDispatch();
  
  const { list: events, status, viewTimezone } = useSelector((state) => state.events);
  
  // FIX: Select the primitive ID separately for stable dependency
  const currentProfileId = useSelector((state) => state.profiles.currentProfile?._id);
  // Select the full profile object for use in the JSX/logic check
  const currentProfile = useSelector((state) => state.profiles.currentProfile);
  
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  // CRITICAL FIX: Use currentProfileId in the dependency array
  useEffect(() => {
    // Check if the stable ID is available
    if (currentProfileId) { 
      // Fetch events using the stable ID
      dispatch(fetchEvents(currentProfileId));
    }
  }, [dispatch, currentProfileId]); 

  // Handle case where no profile is selected at all
  if (!currentProfile) {
    return <div className="no-events">Please select a profile to view events.</div>;
  }

  return (
    <>
      <div className="event-list-header">
        <h2>Events</h2>
        <div style={{ width: '200px' }}>
          <label htmlFor="view-timezone" style={{ fontSize: '0.8rem', color: 'var(--text-color-light)'}}>View in Timezone</label>
          <select 
            id="view-timezone"
            value={viewTimezone} 
            onChange={(e) => dispatch(setViewTimezone(e.target.value))}
          >
            {DISPLAY_TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="event-list-container">
        {status === 'loading' && <p>Loading events...</p>}
        {status === 'succeeded' && events.length === 0 && (
          <div className="no-events">No events found</div>
        )}
        {status === 'succeeded' && events.map(event => (
          <EventItem 
            key={event._id} 
            event={event}
            onEdit={() => setEditingEvent(event)}
            onViewLogs={() => setViewingLogsEvent(event)}
          />
        ))}
      </div>

      {/* Modals */}
      {editingEvent && (
        <EditEventModal 
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
      {viewingLogsEvent && (
        <ViewLogsModal 
          event={viewingLogsEvent}
          onClose={() => setViewingLogsEvent(null)}
        />
      )}
    </>
  );
};

export default EventList;