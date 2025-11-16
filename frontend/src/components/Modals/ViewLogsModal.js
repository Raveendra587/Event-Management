import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEventLogs, clearLogs } from '../../features/eventSlice';
import { formatInTimeZone } from '../utils/timezoneHelper';
import Modal from '../Shared/Modal';

const ViewLogsModal = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const { logs, logStatus, viewTimezone } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEventLogs(event._id));
    return () => {
      dispatch(clearLogs());
    }
  }, [dispatch, event._id]);

  return (
    <Modal title="Event Update History" onClose={onClose}>
      <div className="logs-container">
        {logStatus === 'loading' && <p>Loading logs...</p>}
        {logStatus === 'succeeded' && logs.length === 0 && (
          <div className="no-logs">No update history yet</div>
        )}
        {logStatus === 'succeeded' && logs.map(log => (
          <div key={log._id} className="log-item">
            <div className="log-item-time">
              {formatInTimeZone(log.updatedAtUTC, viewTimezone, 'MMM D, YYYY [at] hh:mm A')}
            </div>
            <div className="log-item-desc">
              {log.changeDescription}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default ViewLogsModal;