import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profiles';

export const fetchProfiles = createAsyncThunk('profiles/fetchProfiles', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const createProfile = createAsyncThunk('profiles/createProfile', async (name) => {
  const response = await axios.post(API_URL, { name });
  return response.data;
});

const initialState = {
  list: [],
  currentProfile: null,
  status: 'idle',
  error: null,
};

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        if (!state.currentProfile && action.payload.length > 0) {
          state.currentProfile = action.payload[0];
        }
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.list.sort((a, b) => a.name.localeCompare(b.name));
      });
  },
});

export const { setCurrentProfile } = profileSlice.actions;

export default profileSlice.reducer;