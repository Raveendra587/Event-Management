import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IANA_TIMEZONES } from '../components/utils/timezoneHelper';

const API_URL = 'https://event-management-2e2h.onrender.com/api/events';

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (profileId) => {
  if (!profileId) return [];
  const response = await axios.get(`${API_URL}?profileId=${profileId}`);
  return response.data;
});

export const createEvent = createAsyncThunk('events/createEvent', async (eventData, { getState }) => {
  const { profiles, timezone, startDate, startTime, endDate, endTime } = eventData;
  const ianaTimezone = IANA_TIMEZONES[timezone];

  const response = await axios.post(API_URL, {
    profiles,
    timezone: ianaTimezone,
    startDate,
    startTime,
    endDate,
    endTime,
  });
  return response.data;
});

export const updateEvent = createAsyncThunk('events/updateEvent', async (eventData) => {
  const { id, profiles, timezone, startDate, startTime, endDate, endTime } = eventData;
  const ianaTimezone = IANA_TIMEZONES[timezone];

  const response = await axios.put(`${API_URL}/${id}`, {
    profiles,
    timezone: ianaTimezone,
    startDate,
    startTime,
    endDate,
    endTime,
  });
  return response.data;
});

export const fetchEventLogs = createAsyncThunk('events/fetchEventLogs', async (eventId) => {
  const response = await axios.get(`${API_URL}/${eventId}/logs`);
  return response.data;
});

const initialState = {
  list: [],
  logs: [],
  viewTimezone: 'Eastern Time (ET)',
  status: 'idle',
  logStatus: 'idle',
  error: null,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setViewTimezone: (state, action) => {
      state.viewTimezone = action.payload;
    },
    clearLogs: (state) => {
      state.logs = [];
      state.logStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        const existingEvent = state.list.find((event) => event._id === updatedEvent._id);
        if (existingEvent) {
          Object.assign(existingEvent, updatedEvent);
        }
      })
      .addCase(fetchEventLogs.pending, (state) => {
        state.logStatus = 'loading';
      })
      .addCase(fetchEventLogs.fulfilled, (state, action) => {
        state.logStatus = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchEventLogs.rejected, (state) => {
        state.logStatus = 'failed';
      });
  },
});

export const { setViewTimezone, clearLogs } = eventSlice.actions;

export default eventSlice.reducer;