import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../components/Header';
import CreateEventForm from '../components/CreateEventForm';
import EventList from '../components/EventList';
import { fetchProfiles } from '../features/profileSlice';

function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  return (
    <div className="app-container">
      <Header />
      <main className="dashboard-layout">
        <section className="card">
          <CreateEventForm />
        </section>
        <section className="card">
          <EventList />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;