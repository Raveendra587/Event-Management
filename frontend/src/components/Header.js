import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentProfile, createProfile, fetchProfiles } from '../features/profileSlice';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

const HeaderProfileSelect = () => {
  const dispatch = useDispatch();
  const { list: profiles, currentProfile } = useSelector((state) => state.profiles);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (profile) => {
    dispatch(setCurrentProfile(profile));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      await dispatch(createProfile(newProfileName.trim()));
      await dispatch(fetchProfiles());
      setNewProfileName('');
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="profile-select-wrapper" ref={wrapperRef}>
      <button 
        className={`profile-select-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentProfile ? currentProfile.name : 'Select Profile'}</span>
        <FaChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="profile-select-dropdown">
          <input
            type="text"
            className="profile-search-input"
            placeholder="Search current profile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="profile-options-list">
            {filteredProfiles.map(profile => (
              <div 
                key={profile._id} 
                className={`profile-option ${currentProfile?._id === profile._id ? 'selected' : ''}`}
                onClick={() => handleSelect(profile)}
              >
                <span>{profile.name}</span>
                {currentProfile?._id === profile._id && <FaCheck size={14} />}
              </div>
            ))}
          </div>
          <form className="add-profile-form" onSubmit={handleAddProfile}>
            <input 
              type="text"
              placeholder="Add new profile..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
        </div>
      )}
    </div>
  );
};


const Header = () => {
  return (
    <header className="app-header">
      <div>
        <h1>Event Management</h1>
        <p>Create and manage events across multiple timezones</p>
      </div>
      <div className="header-profile-select">
        <HeaderProfileSelect />
      </div>
    </header>
  );
};

export default Header;