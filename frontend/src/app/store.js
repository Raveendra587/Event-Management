import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../features/profileSlice';
import eventReducer from '../features/eventSlice';

export const store = configureStore({
  reducer: {
    profiles: profileReducer,
    events: eventReducer,
  },
});